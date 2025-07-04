
#!/usr/bin/env python3
"""
Quick Test Runner for OmniAI Platform
Runs essential tests quickly
"""

import asyncio
import aiohttp
import requests
import logging
import time

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def quick_stress_test():
    """Quick stress test of all endpoints"""
    logger.info("🚀 Running Quick Stress Test")
    
    endpoints = [
        ("Backend Health", "http://0.0.0.0:5000/health"),
        ("Backend Status", "http://0.0.0.0:5000/api/status"),
        ("Middleware Health", "http://0.0.0.0:8080/health"),
        ("GitHub Status", "http://0.0.0.0:8080/api/github/status"),
        ("NVIDIA Status", "http://0.0.0.0:8080/api/nvidia/status"),
        ("Vercel Status", "http://0.0.0.0:8080/api/vercel/status")
    ]
    
    results = {}
    
    async with aiohttp.ClientSession() as session:
        for name, url in endpoints:
            try:
                start_time = time.time()
                async with session.get(url, timeout=10) as response:
                    response_time = time.time() - start_time
                    content = await response.text()
                    
                    results[name] = {
                        "status": response.status,
                        "response_time": response_time,
                        "success": response.status < 400
                    }
                    
                    status_emoji = "✅" if response.status < 400 else "❌"
                    logger.info(f"{status_emoji} {name}: {response.status} ({response_time:.3f}s)")
                    
            except Exception as e:
                results[name] = {
                    "error": str(e),
                    "success": False
                }
                logger.error(f"❌ {name}: {e}")
    
    # Summary
    successful = sum(1 for r in results.values() if r.get("success", False))
    total = len(results)
    success_rate = (successful / total) * 100 if total > 0 else 0
    
    logger.info("=" * 50)
    logger.info(f"Quick Test Results: {successful}/{total} endpoints successful ({success_rate:.1f}%)")
    logger.info("=" * 50)
    
    return results

async def load_test_sample():
    """Sample load test with concurrent requests"""
    logger.info("🔥 Running Sample Load Test")
    
    async def make_request(session, url):
        start_time = time.time()
        try:
            async with session.get(url) as response:
                return {
                    "status": response.status,
                    "response_time": time.time() - start_time,
                    "success": response.status < 400
                }
        except Exception as e:
            return {
                "error": str(e),
                "response_time": time.time() - start_time,
                "success": False
            }
    
    # Test with 10 concurrent requests to health endpoint
    async with aiohttp.ClientSession() as session:
        tasks = [make_request(session, "http://0.0.0.0:5000/health") for _ in range(10)]
        results = await asyncio.gather(*tasks)
    
    successful = [r for r in results if r.get("success", False)]
    avg_response_time = sum(r["response_time"] for r in successful) / len(successful) if successful else 0
    
    logger.info(f"🎯 Load Test: {len(successful)}/10 requests successful")
    logger.info(f"📊 Average Response Time: {avg_response_time:.3f}s")
    
    return results

async def main():
    """Main quick test runner"""
    logger.info("🧪 OmniAI Platform Quick Test")
    logger.info("=" * 40)
    
    start_time = time.time()
    
    # Run quick tests
    await quick_stress_test()
    await load_test_sample()
    
    duration = time.time() - start_time
    logger.info(f"✅ Quick tests completed in {duration:.2f} seconds")

if __name__ == "__main__":
    asyncio.run(main())
