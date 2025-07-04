
#!/usr/bin/env python3
"""
Frontend Load Testing for OmniAI Platform
Tests React frontend performance and user interactions
"""

import asyncio
import aiohttp
import time
import random
import logging
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import concurrent.futures

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class FrontendLoadTest:
    def __init__(self, base_url: str = "http://0.0.0.0:3000"):
        self.base_url = base_url
        self.results = []
        
    async def test_frontend_endpoints(self):
        """Test frontend static file serving"""
        logger.info("🌐 Testing Frontend Asset Loading")
        
        endpoints = [
            "/",
            "/assets/index.css",
            "/assets/index.js",
            "/favicon.ico"
        ]
        
        async with aiohttp.ClientSession() as session:
            for endpoint in endpoints:
                try:
                    start_time = time.time()
                    async with session.get(f"{self.base_url}{endpoint}") as response:
                        content = await response.text()
                        load_time = time.time() - start_time
                        
                        logger.info(f"✅ {endpoint}: {response.status} ({load_time:.3f}s, {len(content)} bytes)")
                        
                except Exception as e:
                    logger.error(f"❌ {endpoint}: {e}")
    
    def simulate_user_interactions(self):
        """Simulate user interactions with Selenium"""
        logger.info("👤 Simulating User Interactions")
        
        # Configure Chrome options for headless mode
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        
        try:
            driver = webdriver.Chrome(options=chrome_options)
            driver.get(self.base_url)
            
            # Wait for page to load
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            
            # Simulate user actions
            logger.info("✅ Frontend loaded successfully")
            
            # Check for React components
            try:
                # Look for common React elements
                elements = driver.find_elements(By.CSS_SELECTOR, "[data-testid], .mantine-")
                logger.info(f"✅ Found {len(elements)} React components")
            except Exception as e:
                logger.warning(f"⚠️ React components not found: {e}")
            
            driver.quit()
            
        except Exception as e:
            logger.error(f"❌ Browser simulation failed: {e}")
    
    async def concurrent_user_simulation(self, num_users: int = 5):
        """Simulate multiple concurrent users"""
        logger.info(f"👥 Simulating {num_users} concurrent users")
        
        async def simulate_user():
            async with aiohttp.ClientSession() as session:
                # Simulate user journey
                journey = [
                    "/",
                    "/api/status",
                    "/api/github/status",
                    "/api/nvidia/status"
                ]
                
                for step in journey:
                    try:
                        start_time = time.time()
                        url = f"{self.base_url}{step}" if step.startswith("/api") else f"{self.base_url}{step}"
                        async with session.get(url) as response:
                            load_time = time.time() - start_time
                            logger.info(f"User journey {step}: {response.status} ({load_time:.3f}s)")
                        
                        # Simulate user think time
                        await asyncio.sleep(random.uniform(0.5, 2.0))
                        
                    except Exception as e:
                        logger.error(f"User journey error at {step}: {e}")
        
        # Run concurrent user simulations
        tasks = [simulate_user() for _ in range(num_users)]
        await asyncio.gather(*tasks)
    
    async def run_frontend_load_test(self):
        """Run complete frontend load test"""
        logger.info("🚀 Starting Frontend Load Test")
        
        await self.test_frontend_endpoints()
        await self.concurrent_user_simulation(num_users=3)
        
        logger.info("✅ Frontend load test completed!")

async def main():
    """Main frontend load test execution"""
    logger.info("🧪 OmniAI Frontend Load Testing")
    logger.info("=" * 50)
    
    tester = FrontendLoadTest()
    await tester.run_frontend_load_test()

if __name__ == "__main__":
    asyncio.run(main())
