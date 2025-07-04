
use regex::Regex;
use serde_json::Value;
use std::collections::HashSet;
use once_cell::sync::Lazy;

static DANGEROUS_PATTERNS: Lazy<Vec<Regex>> = Lazy::new(|| {
    vec![
        Regex::new(r"(?i)<script[^>]*>.*?</script>").unwrap(),
        Regex::new(r"(?i)javascript:").unwrap(),
        Regex::new(r"(?i)on\w+\s*=").unwrap(),
        Regex::new(r"(?i)eval\s*\(").unwrap(),
        Regex::new(r"(?i)expression\s*\(").unwrap(),
        Regex::new(r"(?i)vbscript:").unwrap(),
        Regex::new(r"(?i)<!--.*?-->").unwrap(),
        Regex::new(r"(?i)<iframe[^>]*>.*?</iframe>").unwrap(),
    ]
});

static SQL_INJECTION_PATTERNS: Lazy<Vec<Regex>> = Lazy::new(|| {
    vec![
        Regex::new(r"(?i)\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b").unwrap(),
        Regex::new(r"(?i)(\-\-|\#|\/\*|\*\/)").unwrap(),
        Regex::new(r"(?i)(\bor\b|\band\b)\s+\d+\s*=\s*\d+").unwrap(),
        Regex::new(r"(?i)'\s*or\s*'[^']*'\s*=\s*'[^']*'").unwrap(),
    ]
});

static ALLOWED_DOMAINS: Lazy<HashSet<&'static str>> = Lazy::new(|| {
    [
        "github.com",
        "api.github.com",
        "vercel.com",
        "api.vercel.com",
        "developer.nvidia.com",
        "api.nvidia.com",
        "openai.com",
        "api.openai.com",
        "pinecone.io",
        "api.pinecone.io",
    ].iter().cloned().collect()
});

pub struct SecurityManager {
    max_request_size: usize,
    max_string_length: usize,
}

impl SecurityManager {
    pub fn new() -> Self {
        Self {
            max_request_size: 10 * 1024 * 1024, // 10MB
            max_string_length: 10000,
        }
    }

    pub async fn validate_request(&self, request: &Value) -> Result<(), String> {
        // Check request size
        let request_str = serde_json::to_string(request)
            .map_err(|e| format!("JSON serialization error: {}", e))?;
        
        if request_str.len() > self.max_request_size {
            return Err("Request size exceeds maximum allowed".to_string());
        }

        // Recursively validate all string values
        self.validate_value(request)?;

        // Validate URLs if present
        if let Some(url) = request.get("url").and_then(|u| u.as_str()) {
            self.validate_url(url)?;
        }

        Ok(())
    }

    fn validate_value(&self, value: &Value) -> Result<(), String> {
        match value {
            Value::String(s) => {
                self.validate_string(s)?;
            }
            Value::Array(arr) => {
                for item in arr {
                    self.validate_value(item)?;
                }
            }
            Value::Object(obj) => {
                for (_, v) in obj {
                    self.validate_value(v)?;
                }
            }
            _ => {} // Numbers, booleans, null are safe
        }
        Ok(())
    }

    fn validate_string(&self, s: &str) -> Result<(), String> {
        // Check string length
        if s.len() > self.max_string_length {
            return Err("String length exceeds maximum allowed".to_string());
        }

        // Check for XSS patterns
        for pattern in DANGEROUS_PATTERNS.iter() {
            if pattern.is_match(s) {
                return Err("Potentially dangerous content detected".to_string());
            }
        }

        // Check for SQL injection patterns
        for pattern in SQL_INJECTION_PATTERNS.iter() {
            if pattern.is_match(s) {
                return Err("Potentially malicious SQL pattern detected".to_string());
            }
        }

        // Check for null bytes
        if s.contains('\0') {
            return Err("Null bytes not allowed".to_string());
        }

        Ok(())
    }

    fn validate_url(&self, url: &str) -> Result<(), String> {
        let parsed_url = url::Url::parse(url)
            .map_err(|_| "Invalid URL format")?;

        // Check if scheme is allowed
        match parsed_url.scheme() {
            "http" | "https" => {}
            _ => return Err("Only HTTP and HTTPS URLs are allowed".to_string()),
        }

        // Check if domain is in allowed list
        if let Some(domain) = parsed_url.domain() {
            if !ALLOWED_DOMAINS.contains(domain) {
                return Err(format!("Domain '{}' is not in the allowed list", domain));
            }
        } else {
            return Err("URL must have a valid domain".to_string());
        }

        Ok(())
    }

    pub fn sanitize_string(&self, input: &str) -> String {
        let mut sanitized = input.to_string();

        // Remove dangerous HTML/JS patterns
        for pattern in DANGEROUS_PATTERNS.iter() {
            sanitized = pattern.replace_all(&sanitized, "").to_string();
        }

        // Escape HTML entities
        sanitized = sanitized
            .replace('&', "&amp;")
            .replace('<', "&lt;")
            .replace('>', "&gt;")
            .replace('"', "&quot;")
            .replace('\'', "&#x27;");

        // Remove null bytes
        sanitized = sanitized.replace('\0', "");

        // Trim whitespace
        sanitized.trim().to_string()
    }

    pub async fn generate_csrf_token(&self) -> String {
        use sha2::{Sha256, Digest};
        use base64::{Engine as _, engine::general_purpose};

        let timestamp = chrono::Utc::now().timestamp();
        let random_bytes = uuid::Uuid::new_v4().as_bytes();
        
        let mut hasher = Sha256::new();
        hasher.update(timestamp.to_be_bytes());
        hasher.update(random_bytes);
        
        let hash = hasher.finalize();
        general_purpose::URL_SAFE_NO_PAD.encode(hash)
    }

    pub fn validate_csrf_token(&self, token: &str) -> Result<(), String> {
        use base64::{Engine as _, engine::general_purpose};

        // Decode the token
        let decoded = general_purpose::URL_SAFE_NO_PAD
            .decode(token)
            .map_err(|_| "Invalid CSRF token format")?;

        if decoded.len() != 32 {
            return Err("Invalid CSRF token length".to_string());
        }

        // In a real implementation, you'd validate against stored tokens
        // For now, we just check the format
        Ok(())
    }
}
