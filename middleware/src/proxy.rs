
use std::collections::HashMap;
use serde_json::Value;
use reqwest::Client;

pub struct ProxyManager {
    pub backend_url: String,
    pub client: Client,
}

impl ProxyManager {
    pub fn new(backend_url: String) -> Self {
        Self {
            backend_url,
            client: Client::new(),
        }
    }

    pub async fn forward_request(&self, body: Value) -> Result<Value, Box<dyn std::error::Error>> {
        let endpoint = body.get("endpoint")
            .and_then(|e| e.as_str())
            .unwrap_or("/api/status");

        let method = body.get("method")
            .and_then(|m| m.as_str())
            .unwrap_or("GET");

        let data = body.get("data");

        let url = format!("{}{}", self.backend_url, endpoint);

        let response = match method.to_uppercase().as_str() {
            "GET" => {
                self.client
                    .get(&url)
                    .header("Content-Type", "application/json")
                    .send()
                    .await?
            }
            "POST" => {
                let mut request = self.client
                    .post(&url)
                    .header("Content-Type", "application/json");

                if let Some(data) = data {
                    request = request.json(data);
                }

                request.send().await?
            }
            "PUT" => {
                let mut request = self.client
                    .put(&url)
                    .header("Content-Type", "application/json");

                if let Some(data) = data {
                    request = request.json(data);
                }

                request.send().await?
            }
            "DELETE" => {
                self.client
                    .delete(&url)
                    .header("Content-Type", "application/json")
                    .send()
                    .await?
            }
            _ => {
                return Err(format!("Unsupported HTTP method: {}", method).into());
            }
        };

        if response.status().is_success() {
            let response_body: Value = response.json().await?;
            Ok(response_body)
        } else {
            Err(format!("Backend error: {}", response.status()).into())
        }
    }

    pub async fn health_check(&self) -> Result<bool, Box<dyn std::error::Error>> {
        let url = format!("{}/health", self.backend_url);
        let response = self.client.get(&url).send().await?;
        Ok(response.status().is_success())
    }

    pub async fn forward_nvidia_request(&self, nvidia_data: Value) -> Result<Value, Box<dyn std::error::Error>> {
        let endpoint = "/api/nvidia/process";
        let url = format!("{}{}", self.backend_url, endpoint);

        let response = self.client
            .post(&url)
            .header("Content-Type", "application/json")
            .json(&nvidia_data)
            .send()
            .await?;

        if response.status().is_success() {
            Ok(response.json().await?)
        } else {
            Err(format!("NVIDIA API error: {}", response.status()).into())
        }
    }

    pub async fn forward_github_request(&self, github_data: Value) -> Result<Value, Box<dyn std::error::Error>> {
        let endpoint = "/api/github/process";
        let url = format!("{}{}", self.backend_url, endpoint);

        let response = self.client
            .post(&url)
            .header("Content-Type", "application/json")
            .json(&github_data)
            .send()
            .await?;

        if response.status().is_success() {
            Ok(response.json().await?)
        } else {
            Err(format!("GitHub API error: {}", response.status()).into())
        }
    }

    pub async fn forward_vercel_request(&self, vercel_data: Value) -> Result<Value, Box<dyn std::error::Error>> {
        let endpoint = "/api/vercel/process";
        let url = format!("{}{}", self.backend_url, endpoint);

        let response = self.client
            .post(&url)
            .header("Content-Type", "application/json")
            .json(&vercel_data)
            .send()
            .await?;

        if response.status().is_success() {
            Ok(response.json().await?)
        } else {
            Err(format!("Vercel API error: {}", response.status()).into())
        }
    }
}
