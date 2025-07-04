
use std::collections::HashMap;
use std::time::{Duration, Instant};
use std::sync::Arc;
use tokio::sync::RwLock;
use serde_json::Value;
use redis::AsyncCommands;

#[derive(Clone, Debug)]
pub struct CacheEntry {
    pub data: Value,
    pub created_at: Instant,
    pub ttl: Duration,
}

impl CacheEntry {
    pub fn is_expired(&self) -> bool {
        self.created_at.elapsed() > self.ttl
    }
}

pub struct CacheManager {
    memory_cache: Arc<RwLock<HashMap<String, CacheEntry>>>,
    redis_client: Option<redis::Client>,
    default_ttl: Duration,
}

impl CacheManager {
    pub async fn new() -> Result<Self, Box<dyn std::error::Error>> {
        let redis_url = std::env::var("REDIS_URL").ok();
        let redis_client = if let Some(url) = redis_url {
            Some(redis::Client::open(url)?)
        } else {
            None
        };

        Ok(Self {
            memory_cache: Arc::new(RwLock::new(HashMap::new())),
            redis_client,
            default_ttl: Duration::from_secs(300), // 5 minutes
        })
    }

    pub async fn get(&self, key: &str) -> Option<Value> {
        // Try memory cache first
        {
            let cache = self.memory_cache.read().await;
            if let Some(entry) = cache.get(key) {
                if !entry.is_expired() {
                    return Some(entry.data.clone());
                }
            }
        }

        // Try Redis cache
        if let Some(ref client) = self.redis_client {
            if let Ok(mut conn) = client.get_async_connection().await {
                if let Ok(data) = conn.get::<_, String>(key).await {
                    if let Ok(value) = serde_json::from_str::<Value>(&data) {
                        // Store in memory cache for faster access
                        self.set_memory_cache(key, value.clone(), self.default_ttl).await;
                        return Some(value);
                    }
                }
            }
        }

        None
    }

    pub async fn set(&self, key: &str, value: Value, ttl: Option<Duration>) {
        let ttl = ttl.unwrap_or(self.default_ttl);

        // Set in memory cache
        self.set_memory_cache(key, value.clone(), ttl).await;

        // Set in Redis cache
        if let Some(ref client) = self.redis_client {
            if let Ok(mut conn) = client.get_async_connection().await {
                if let Ok(data) = serde_json::to_string(&value) {
                    let _: Result<(), _> = conn.setex(key, ttl.as_secs() as usize, data).await;
                }
            }
        }
    }

    async fn set_memory_cache(&self, key: &str, value: Value, ttl: Duration) {
        let entry = CacheEntry {
            data: value,
            created_at: Instant::now(),
            ttl,
        };

        let mut cache = self.memory_cache.write().await;
        cache.insert(key.to_string(), entry);
    }

    pub async fn delete(&self, key: &str) {
        // Remove from memory cache
        {
            let mut cache = self.memory_cache.write().await;
            cache.remove(key);
        }

        // Remove from Redis cache
        if let Some(ref client) = self.redis_client {
            if let Ok(mut conn) = client.get_async_connection().await {
                let _: Result<(), _> = conn.del(key).await;
            }
        }
    }

    pub async fn clear_expired(&self) {
        let mut cache = self.memory_cache.write().await;
        cache.retain(|_, entry| !entry.is_expired());
    }

    pub async fn cache_api_response(&self, endpoint: &str, params: &str, response: Value) {
        let cache_key = format!("api:{}:{}", endpoint, params);
        self.set(&cache_key, response, Some(Duration::from_secs(60))).await; // 1 minute for API responses
    }

    pub async fn get_cached_api_response(&self, endpoint: &str, params: &str) -> Option<Value> {
        let cache_key = format!("api:{}:{}", endpoint, params);
        self.get(&cache_key).await
    }

    pub async fn cache_nvidia_session(&self, session_id: &str, session_data: Value) {
        let cache_key = format!("nvidia:session:{}", session_id);
        self.set(&cache_key, session_data, Some(Duration::from_secs(3600))).await; // 1 hour
    }

    pub async fn get_nvidia_session(&self, session_id: &str) -> Option<Value> {
        let cache_key = format!("nvidia:session:{}", session_id);
        self.get(&cache_key).await
    }

    pub async fn cache_user_permissions(&self, user_id: &str, permissions: Value) {
        let cache_key = format!("user:permissions:{}", user_id);
        self.set(&cache_key, permissions, Some(Duration::from_secs(1800))).await; // 30 minutes
    }

    pub async fn get_user_permissions(&self, user_id: &str) -> Option<Value> {
        let cache_key = format!("user:permissions:{}", user_id);
        self.get(&cache_key).await
    }

    pub async fn get_cache_stats(&self) -> HashMap<String, usize> {
        let cache = self.memory_cache.read().await;
        let mut stats = HashMap::new();
        
        stats.insert("total_entries".to_string(), cache.len());
        stats.insert("expired_entries".to_string(), cache.values().filter(|e| e.is_expired()).count());
        
        stats
    }
}
