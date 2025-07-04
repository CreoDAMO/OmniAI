
use serde_json::Value;
use regex::Regex;
use std::collections::HashMap;
use validator::{Validate, ValidationError};

pub struct ValidationManager {
    email_regex: Regex,
    url_regex: Regex,
    api_key_regex: Regex,
}

impl ValidationManager {
    pub fn new() -> Self {
        Self {
            email_regex: Regex::new(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$").unwrap(),
            url_regex: Regex::new(r"^https?://[^\s/$.?#].[^\s]*$").unwrap(),
            api_key_regex: Regex::new(r"^[a-zA-Z0-9_-]{16,}$").unwrap(),
        }
    }

    pub async fn validate_input(&self, data: &Value) -> Result<(), String> {
        match data {
            Value::Object(obj) => {
                for (key, value) in obj {
                    self.validate_field(key, value)?;
                }
            }
            _ => return Err("Input must be a JSON object".to_string()),
        }
        Ok(())
    }

    fn validate_field(&self, key: &str, value: &Value) -> Result<(), String> {
        match key {
            "email" => {
                if let Some(email) = value.as_str() {
                    if !self.email_regex.is_match(email) {
                        return Err("Invalid email format".to_string());
                    }
                }
            }
            "url" | "repository_url" | "webhook_url" => {
                if let Some(url) = value.as_str() {
                    if !self.url_regex.is_match(url) {
                        return Err("Invalid URL format".to_string());
                    }
                }
            }
            "api_key" | "token" | "access_token" => {
                if let Some(key_val) = value.as_str() {
                    if key_val.len() < 16 {
                        return Err("API key too short".to_string());
                    }
                    if key_val.len() > 500 {
                        return Err("API key too long".to_string());
                    }
                }
            }
            "username" => {
                if let Some(username) = value.as_str() {
                    if username.len() < 3 || username.len() > 50 {
                        return Err("Username must be between 3 and 50 characters".to_string());
                    }
                    if !username.chars().all(|c| c.is_alphanumeric() || c == '_' || c == '-') {
                        return Err("Username can only contain alphanumeric characters, underscores, and hyphens".to_string());
                    }
                }
            }
            "password" => {
                if let Some(password) = value.as_str() {
                    if password.len() < 8 {
                        return Err("Password must be at least 8 characters long".to_string());
                    }
                }
            }
            "repo_name" | "project_name" => {
                if let Some(name) = value.as_str() {
                    if name.len() < 1 || name.len() > 100 {
                        return Err("Name must be between 1 and 100 characters".to_string());
                    }
                    if !name.chars().all(|c| c.is_alphanumeric() || c == '_' || c == '-' || c == '.') {
                        return Err("Name can only contain alphanumeric characters, underscores, hyphens, and dots".to_string());
                    }
                }
            }
            _ => {
                // For nested objects and arrays, validate recursively
                match value {
                    Value::Object(obj) => {
                        for (nested_key, nested_value) in obj {
                            self.validate_field(nested_key, nested_value)?;
                        }
                    }
                    Value::Array(arr) => {
                        for item in arr {
                            if let Value::Object(obj) = item {
                                for (nested_key, nested_value) in obj {
                                    self.validate_field(nested_key, nested_value)?;
                                }
                            }
                        }
                    }
                    _ => {}
                }
            }
        }
        Ok(())
    }

    pub fn validate_nvidia_config(&self, config: &Value) -> Result<(), String> {
        let required_fields = ["device_id", "session_id"];
        
        for field in &required_fields {
            if !config.get(field).is_some() {
                return Err(format!("Missing required field: {}", field));
            }
        }

        if let Some(quality) = config.get("quality").and_then(|q| q.as_str()) {
            if !["low", "medium", "high", "ultra", "rtx_enabled"].contains(&quality) {
                return Err("Invalid quality setting".to_string());
            }
        }

        Ok(())
    }

    pub fn validate_github_config(&self, config: &Value) -> Result<(), String> {
        let required_fields = ["repo_name", "owner"];
        
        for field in &required_fields {
            if !config.get(field).is_some() {
                return Err(format!("Missing required field: {}", field));
            }
        }

        if let Some(visibility) = config.get("visibility").and_then(|v| v.as_str()) {
            if !["public", "private"].contains(&visibility) {
                return Err("Invalid repository visibility".to_string());
            }
        }

        Ok(())
    }

    pub fn validate_vercel_config(&self, config: &Value) -> Result<(), String> {
        let required_fields = ["project_name"];
        
        for field in &required_fields {
            if !config.get(field).is_some() {
                return Err(format!("Missing required field: {}", field));
            }
        }

        if let Some(framework) = config.get("framework").and_then(|f| f.as_str()) {
            let valid_frameworks = ["nextjs", "react", "vue", "svelte", "nuxtjs", "gatsby", "static"];
            if !valid_frameworks.contains(&framework) {
                return Err("Invalid framework selection".to_string());
            }
        }

        Ok(())
    }

    pub fn sanitize_input(&self, input: &str) -> String {
        input
            .trim()
            .replace('\n', " ")
            .replace('\r', " ")
            .replace('\t', " ")
            .chars()
            .filter(|c| !c.is_control())
            .collect::<String>()
            .split_whitespace()
            .collect::<Vec<&str>>()
            .join(" ")
    }
}
