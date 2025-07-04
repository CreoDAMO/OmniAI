
use std::collections::HashMap;
use std::time::{Duration, Instant};
use std::sync::Arc;
use tokio::sync::RwLock;

#[derive(Clone, Debug)]
pub struct RateLimitEntry {
    pub count: u32,
    pub window_start: Instant,
    pub window_duration: Duration,
    pub max_requests: u32,
}

impl RateLimitEntry {
    pub fn new(max_requests: u32, window_duration: Duration) -> Self {
        Self {
            count: 0,
            window_start: Instant::now(),
            window_duration,
            max_requests,
        }
    }

    pub fn is_expired(&self) -> bool {
        self.window_start.elapsed() > self.window_duration
    }

    pub fn reset_if_expired(&mut self) {
        if self.is_expired() {
            self.count = 0;
            self.window_start = Instant::now();
        }
    }

    pub fn can_proceed(&self) -> bool {
        self.count < self.max_requests
    }

    pub fn increment(&mut self) {
        self.count += 1;
    }
}

pub struct RateLimitManager {
    limits: Arc<RwLock<HashMap<String, RateLimitEntry>>>,
    default_max_requests: u32,
    default_window: Duration,
}

impl RateLimitManager {
    pub fn new() -> Self {
        Self {
            limits: Arc::new(RwLock::new(HashMap::new())),
            default_max_requests: 100, // 100 requests per minute
            default_window: Duration::from_secs(60), // 1 minute window
        }
    }

    pub async fn check_rate_limit(&self, identifier: &str) -> Result<(), String> {
        let mut limits = self.limits.write().await;
        
        let entry = limits
            .entry(identifier.to_string())
            .or_insert_with(|| RateLimitEntry::new(self.default_max_requests, self.default_window));

        entry.reset_if_expired();

        if entry.can_proceed() {
            entry.increment();
            Ok(())
        } else {
            Err("Rate limit exceeded".to_string())
        }
    }

    pub async fn check_api_rate_limit(&self, endpoint: &str, user_id: &str) -> Result<(), String> {
        let identifier = format!("api:{}:{}", endpoint, user_id);
        let (max_requests, window) = self.get_endpoint_limits(endpoint);

        let mut limits = self.limits.write().await;
        
        let entry = limits
            .entry(identifier.clone())
            .or_insert_with(|| RateLimitEntry::new(max_requests, window));

        entry.reset_if_expired();

        if entry.can_proceed() {
            entry.increment();
            Ok(())
        } else {
            Err(format!("Rate limit exceeded for endpoint: {}", endpoint))
        }
    }

    pub async fn check_ip_rate_limit(&self, ip_address: &str) -> Result<(), String> {
        let identifier = format!("ip:{}", ip_address);
        let max_requests = 1000; // Higher limit for IP-based limiting
        let window = Duration::from_secs(3600); // 1 hour window

        let mut limits = self.limits.write().await;
        
        let entry = limits
            .entry(identifier.clone())
            .or_insert_with(|| RateLimitEntry::new(max_requests, window));

        entry.reset_if_expired();

        if entry.can_proceed() {
            entry.increment();
            Ok(())
        } else {
            Err("IP rate limit exceeded".to_string())
        }
    }

    fn get_endpoint_limits(&self, endpoint: &str) -> (u32, Duration) {
        match endpoint {
            "/api/nvidia/stream" => (10, Duration::from_secs(60)), // 10 per minute for streaming
            "/api/nvidia/launch" => (5, Duration::from_secs(60)),  // 5 per minute for launching
            "/api/github/create" => (10, Duration::from_secs(3600)), // 10 per hour for repo creation
            "/api/vercel/deploy" => (20, Duration::from_secs(3600)), // 20 per hour for deployments
            "/api/auth/login" => (5, Duration::from_secs(300)),    // 5 per 5 minutes for login attempts
            _ => (self.default_max_requests, self.default_window),
        }
    }

    pub async fn get_rate_limit_status(&self, identifier: &str) -> Option<(u32, u32, Duration)> {
        let limits = self.limits.read().await;
        
        if let Some(entry) = limits.get(identifier) {
            let remaining = entry.max_requests.saturating_sub(entry.count);
            let reset_in = entry.window_duration.saturating_sub(entry.window_start.elapsed());
            Some((entry.count, remaining, reset_in))
        } else {
            None
        }
    }

    pub async fn reset_rate_limit(&self, identifier: &str) {
        let mut limits = self.limits.write().await;
        limits.remove(identifier);
    }

    pub async fn cleanup_expired(&self) {
        let mut limits = self.limits.write().await;
        limits.retain(|_, entry| !entry.is_expired());
    }

    pub async fn get_global_stats(&self) -> HashMap<String, u32> {
        let limits = self.limits.read().await;
        let mut stats = HashMap::new();
        
        let total_entries = limits.len() as u32;
        let active_entries = limits.values().filter(|entry| !entry.is_expired()).count() as u32;
        let total_requests = limits.values().map(|entry| entry.count).sum::<u32>();
        
        stats.insert("total_entries".to_string(), total_entries);
        stats.insert("active_entries".to_string(), active_entries);
        stats.insert("total_requests".to_string(), total_requests);
        
        stats
    }
}
