
use std::collections::HashMap;
use std::env;
use std::sync::Arc;

use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation, Algorithm};
use serde::{Deserialize, Serialize};
use tokio::sync::RwLock;
use uuid::Uuid;
use bcrypt::{hash, verify, DEFAULT_COST};
use redis::AsyncCommands;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub exp: usize,
    pub iat: usize,
    pub permissions: Vec<String>,
}

#[derive(Debug, Clone)]
pub struct User {
    pub id: String,
    pub username: String,
    pub email: String,
    pub permissions: Vec<String>,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

pub struct AuthManager {
    pub jwt_secret: String,
    pub redis_client: redis::Client,
    pub users: Arc<RwLock<HashMap<String, User>>>,
}

impl AuthManager {
    pub async fn new() -> Result<Self, Box<dyn std::error::Error>> {
        let jwt_secret = env::var("JWT_SECRET").unwrap_or_else(|_| "default-secret-key".to_string());
        let redis_url = env::var("REDIS_URL").unwrap_or_else(|_| "redis://127.0.0.1:6379".to_string());
        let redis_client = redis::Client::open(redis_url)?;

        Ok(Self {
            jwt_secret,
            redis_client,
            users: Arc::new(RwLock::new(HashMap::new())),
        })
    }

    pub async fn authenticate_user(&self, username: &str, password: &str) -> Result<String, String> {
        let users = self.users.read().await;
        
        // In a real implementation, this would query a database
        if let Some(user) = users.get(username) {
            // For demo purposes, we'll skip password verification
            // In production, use bcrypt::verify(password, &stored_hash)
            let token = self.generate_jwt_token(&user.id, &user.permissions)?;
            Ok(token)
        } else {
            Err("Invalid credentials".to_string())
        }
    }

    pub fn generate_jwt_token(&self, user_id: &str, permissions: &[String]) -> Result<String, String> {
        let now = chrono::Utc::now();
        let expires_at = now + chrono::Duration::hours(24);

        let claims = Claims {
            sub: user_id.to_string(),
            exp: expires_at.timestamp() as usize,
            iat: now.timestamp() as usize,
            permissions: permissions.to_vec(),
        };

        encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(self.jwt_secret.as_ref()),
        )
        .map_err(|e| format!("JWT encoding error: {}", e))
    }

    pub fn verify_jwt_token(&self, token: &str) -> Result<Claims, String> {
        decode::<Claims>(
            token,
            &DecodingKey::from_secret(self.jwt_secret.as_ref()),
            &Validation::new(Algorithm::HS256),
        )
        .map(|data| data.claims)
        .map_err(|e| format!("JWT verification error: {}", e))
    }

    pub async fn create_user(&self, username: String, email: String, password: String) -> Result<User, String> {
        let user_id = Uuid::new_v4().to_string();
        let password_hash = hash(password, DEFAULT_COST)
            .map_err(|e| format!("Password hashing error: {}", e))?;

        let user = User {
            id: user_id.clone(),
            username: username.clone(),
            email,
            permissions: vec!["user".to_string()],
            created_at: chrono::Utc::now(),
        };

        let mut users = self.users.write().await;
        users.insert(username, user.clone());

        Ok(user)
    }

    pub async fn validate_permissions(&self, user_id: &str, required_permission: &str) -> Result<bool, String> {
        let users = self.users.read().await;
        
        for user in users.values() {
            if user.id == user_id {
                return Ok(user.permissions.contains(&required_permission.to_string()) 
                    || user.permissions.contains(&"admin".to_string()));
            }
        }
        
        Err("User not found".to_string())
    }

    pub async fn store_session(&self, session_id: &str, user_id: &str) -> Result<(), String> {
        let mut conn = self.redis_client
            .get_async_connection()
            .await
            .map_err(|e| format!("Redis connection error: {}", e))?;

        let _: () = conn
            .setex(format!("session:{}", session_id), 3600, user_id)
            .await
            .map_err(|e| format!("Redis setex error: {}", e))?;

        Ok(())
    }

    pub async fn get_session(&self, session_id: &str) -> Result<Option<String>, String> {
        let mut conn = self.redis_client
            .get_async_connection()
            .await
            .map_err(|e| format!("Redis connection error: {}", e))?;

        let result: Option<String> = conn
            .get(format!("session:{}", session_id))
            .await
            .map_err(|e| format!("Redis get error: {}", e))?;

        Ok(result)
    }
}
