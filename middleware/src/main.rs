
use std::collections::HashMap;
use std::convert::Infallible;
use std::env;
use std::sync::Arc;

use warp::Filter;
use serde::{Deserialize, Serialize};
use tokio::sync::RwLock;
use uuid::Uuid;

mod auth;
mod proxy;
mod security;
mod validation;
mod cache;
mod rate_limit;

use auth::AuthManager;
use proxy::ProxyManager;
use security::SecurityManager;
use validation::ValidationManager;
use cache::CacheManager;
use rate_limit::RateLimitManager;

#[derive(Clone)]
pub struct MiddlewareState {
    pub auth: Arc<AuthManager>,
    pub proxy: Arc<ProxyManager>,
    pub security: Arc<SecurityManager>,
    pub validation: Arc<ValidationManager>,
    pub cache: Arc<CacheManager>,
    pub rate_limit: Arc<RateLimitManager>,
    pub sessions: Arc<RwLock<HashMap<String, SessionData>>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SessionData {
    pub user_id: String,
    pub permissions: Vec<String>,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub last_accessed: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub data: Option<T>,
    pub error: Option<String>,
    pub request_id: String,
}

impl<T> ApiResponse<T> {
    pub fn success(data: T) -> Self {
        Self {
            success: true,
            data: Some(data),
            error: None,
            request_id: Uuid::new_v4().to_string(),
        }
    }

    pub fn error(error: String) -> Self {
        Self {
            success: false,
            data: None,
            error: Some(error),
            request_id: Uuid::new_v4().to_string(),
        }
    }
}

#[tokio::main]
async fn main() {
    env_logger::init();
    
    let backend_url = env::var("BACKEND_URL").unwrap_or_else(|_| "http://127.0.0.1:5000".to_string());
    let middleware_port = env::var("MIDDLEWARE_PORT")
        .unwrap_or_else(|_| "8080".to_string())
        .parse::<u16>()
        .expect("Invalid middleware port");

    // Initialize managers
    let auth_manager = Arc::new(AuthManager::new().await.expect("Failed to initialize auth manager"));
    let proxy_manager = Arc::new(ProxyManager::new(backend_url));
    let security_manager = Arc::new(SecurityManager::new());
    let validation_manager = Arc::new(ValidationManager::new());
    let cache_manager = Arc::new(CacheManager::new().await.expect("Failed to initialize cache"));
    let rate_limit_manager = Arc::new(RateLimitManager::new());

    let state = MiddlewareState {
        auth: auth_manager,
        proxy: proxy_manager,
        security: security_manager,
        validation: validation_manager,
        cache: cache_manager,
        rate_limit: rate_limit_manager,
        sessions: Arc::new(RwLock::new(HashMap::new())),
    };

    // CORS filter
    let cors = warp::cors()
        .allow_any_origin()
        .allow_headers(vec!["content-type", "authorization", "x-api-key"])
        .allow_methods(vec!["GET", "POST", "PUT", "DELETE", "OPTIONS"]);

    // Health check endpoint
    let health = warp::path("health")
        .and(warp::get())
        .map(|| {
            warp::reply::json(&ApiResponse::success(serde_json::json!({
                "status": "healthy",
                "service": "omni-ai-middleware",
                "version": "0.1.0"
            })))
        });

    // API routes with middleware chain
    let api_routes = warp::path("api")
        .and(with_state(state.clone()))
        .and(warp::body::json())
        .and_then(handle_api_request);

    // Static file serving for frontend
    let frontend = warp::path("static")
        .and(warp::fs::dir("../frontend/dist"));

    // Root path serves frontend
    let root = warp::path::end()
        .and(warp::fs::file("../frontend/dist/index.html"));

    let routes = health
        .or(api_routes)
        .or(frontend)
        .or(root)
        .with(cors)
        .with(warp::log("omni-ai-middleware"));

    println!("🦀 OmniAI Rust Middleware starting on port {}", middleware_port);
    println!("🔗 Proxying to backend: {}", state.proxy.backend_url);
    
    warp::serve(routes)
        .run(([0, 0, 0, 0], middleware_port))
        .await;
}

fn with_state(state: MiddlewareState) -> impl Filter<Extract = (MiddlewareState,), Error = Infallible> + Clone {
    warp::any().map(move || state.clone())
}

async fn handle_api_request(
    state: MiddlewareState,
    body: serde_json::Value,
) -> Result<impl warp::Reply, Infallible> {
    let request_id = Uuid::new_v4().to_string();
    
    // Security validation
    if let Err(e) = state.security.validate_request(&body).await {
        log::warn!("Security validation failed: {}", e);
        return Ok(warp::reply::with_status(
            warp::reply::json(&ApiResponse::<()>::error(format!("Security validation failed: {}", e))),
            warp::http::StatusCode::BAD_REQUEST,
        ));
    }

    // Rate limiting
    if let Err(e) = state.rate_limit.check_rate_limit("default").await {
        log::warn!("Rate limit exceeded: {}", e);
        return Ok(warp::reply::with_status(
            warp::reply::json(&ApiResponse::<()>::error("Rate limit exceeded".to_string())),
            warp::http::StatusCode::TOO_MANY_REQUESTS,
        ));
    }

    // Input validation
    if let Err(e) = state.validation.validate_input(&body).await {
        log::warn!("Input validation failed: {}", e);
        return Ok(warp::reply::with_status(
            warp::reply::json(&ApiResponse::<()>::error(format!("Validation failed: {}", e))),
            warp::http::StatusCode::BAD_REQUEST,
        ));
    }

    // Proxy to backend
    match state.proxy.forward_request(body).await {
        Ok(response) => {
            log::info!("Request {} processed successfully", request_id);
            Ok(warp::reply::with_status(
                warp::reply::json(&response),
                warp::http::StatusCode::OK,
            ))
        }
        Err(e) => {
            log::error!("Proxy error for request {}: {}", request_id, e);
            Ok(warp::reply::with_status(
                warp::reply::json(&ApiResponse::<()>::error(format!("Proxy error: {}", e))),
                warp::http::StatusCode::INTERNAL_SERVER_ERROR,
            ))
        }
    }
}
