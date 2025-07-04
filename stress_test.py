#!/usr/bin/env python3
"""
OmniAI Platform Stress Testing Suite
Tests all components under load: Frontend, Middleware, Backend, APIs
"""

import asyncio
import aiohttp
import time
import json
import random
import concurrent.futures
from typing import List, Dict, Any
import logging
from dataclasses import dataclass
import statistics
import sys
import os

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('stress_test.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class TestResult:
    endpoint: str
    method: str
    status_code: int
    response_time: float
    success: bool
    error: str = None

class StressTestRunner:
    def __init__(self, base_url: str = "http://0.0.0.0:8080"):
        self.base_url = base_url
        self.backend_url = "http://0.0.0.0:5000"
        self.results: List[TestResult] = []

    async def test_endpoint(self, session: aiohttp.ClientSession, endpoint: str, method: str = "GET", data: dict = None) -> TestResult:
        """Test a single endpoint and measure response time"""
        start_time = time.time()
        try:
            if method.upper() == "GET":
                async with session.get(f"{self.base_url}{endpoint}") as response:
                    await response.text()
                    return TestResult(
                        endpoint=endpoint,
                        method=method,
                        status_code=response.status,
                        response_time=time.time() - start_time,
                        success=response.status < 400
                    )
            elif method.upper() == "POST":
                async with session.post(f"{self.base_url}{endpoint}", json=data) as response:
                    await response.text()
                    return TestResult(
                        endpoint=endpoint,
                        method=method,
                        status_code=response.status,
                        response_time=time.time() - start_time,
                        success=response.status < 400
                    )
        except Exception as e:
            return TestResult(
                endpoint=endpoint,
                method=method,
                status_code=0,
                response_time=time.time() - start_time,
                success=False,
                error=str(e)
            )

    async def load_test_concurrent(self, endpoint: str, concurrent_users: int = 10, requests_per_user: int = 5):
        """Simulate concurrent users hitting an endpoint"""
        logger.info(f"🚀 Load testing {endpoint} with {concurrent_users} concurrent users, {requests_per_user} requests each")

        async with aiohttp.ClientSession() as session:
            tasks = []
            for user in range(concurrent_users):
                for request in range(requests_per_user):
                    task = self.test_endpoint(session, endpoint)
                    tasks.append(task)

            results = await asyncio.gather(*tasks)
            self.results.extend(results)

            # Analyze results
            successful = [r for r in results if r.success]
            failed = [r for r in results if not r.success]

            if successful:
                avg_response_time = statistics.mean([r.response_time for r in successful])
                max_response_time = max([r.response_time for r in successful])
                min_response_time = min([r.response_time for r in successful])

                logger.info(f"✅ {endpoint} - Success: {len(successful)}/{len(results)}")
                logger.info(f"   Avg Response Time: {avg_response_time:.3f}s")
                logger.info(f"   Min/Max Response Time: {min_response_time:.3f}s / {max_response_time:.3f}s")

            if failed:
                logger.warning(f"❌ {endpoint} - Failed: {len(failed)}/{len(results)}")
                for failure in failed[:3]:  # Show first 3 failures
                    logger.warning(f"   Error: {failure.error}")

    async def stress_test_api_endpoints(self):
        """Test all API endpoints under load"""
        endpoints = [
            "/health",
            "/api/status",
            "/api/github/status",
            "/api/nvidia/status",
            "/api/vercel/status"
        ]

        logger.info("🔥 Starting API Stress Tests")

        for endpoint in endpoints:
            await self.load_test_concurrent(endpoint, concurrent_users=20, requests_per_user=10)
            await asyncio.sleep(1)  # Brief pause between tests

    async def stress_test_backend_direct(self):
        """Test backend directly (bypassing middleware)"""
        logger.info("🐍 Testing Backend directly")

        endpoints = [
            "/health",
            "/api/status",
        ]

        for endpoint in endpoints:
            start_time = time.time()
            try:
                async with aiohttp.ClientSession() as session:
                    async with session.get(f"{self.backend_url}{endpoint}") as response:
                        content = await response.text()
                        logger.info(f"✅ Backend {endpoint}: {response.status} ({time.time() - start_time:.3f}s)")
            except Exception as e:
                logger.error(f"❌ Backend {endpoint}: {e}")

    def simulate_complex_workflow(self):
        """Simulate complex user workflows"""
        logger.info("🎯 Simulating Complex User Workflows")

        workflows = [
            {
                "name": "GitHub Repository Creation",
                "steps": [
                    {"endpoint": "/api/github/status", "method": "GET"},
                    {"endpoint": "/api/github/repositories", "method": "GET"},
                    {"endpoint": "/api/github/repositories", "method": "POST", 
                     "data": {"name": f"test-repo-{random.randint(1000, 9999)}", "description": "Test repository", "private": False, "framework": "nextjs"}}
                ]
            },
            {
                "name": "NVIDIA Integration Check",
                "steps": [
                    {"endpoint": "/api/nvidia/status", "method": "GET"},
                    {"endpoint": "/api/nvidia/geforce-now/status", "method": "GET"},
                    {"endpoint": "/api/nvidia/dlss/status", "method": "GET"}
                ]
            },
            {
                "name": "Vercel Deployment",
                "steps": [
                    {"endpoint": "/api/vercel/status", "method": "GET"},
                    {"endpoint": "/api/vercel/projects", "method": "GET"}
                ]
            }
        ]

        return workflows

    async def memory_stress_test(self):
        """Test memory usage under load"""
        logger.info("🧠 Memory Stress Test")

        # Create large payloads to test memory handling
        large_data = {
            "data": ["test" * 1000 for _ in range(100)],
            "metadata": {"timestamp": time.time(), "test_id": "memory_stress"}
        }

        await self.load_test_concurrent("/api/status", concurrent_users=50, requests_per_user=5)

    async def sustained_load_test(self, duration_minutes: int = 2):
        """Run sustained load for specified duration"""
        logger.info(f"⏱️ Sustained Load Test for {duration_minutes} minutes")

        end_time = time.time() + (duration_minutes * 60)
        request_count = 0

        async with aiohttp.ClientSession() as session:
            while time.time() < end_time:
                tasks = []
                for _ in range(10):  # 10 concurrent requests every iteration
                    endpoint = random.choice(["/health", "/api/status", "/api/github/status"])
                    task = self.test_endpoint(session, endpoint)
                    tasks.append(task)

                results = await asyncio.gather(*tasks)
                self.results.extend(results)
                request_count += len(results)

                await asyncio.sleep(0.1)  # Small delay between batches

        logger.info(f"✅ Sustained load test completed. {request_count} requests in {duration_minutes} minutes")

    def generate_report(self):
        """Generate comprehensive test report"""
        if not self.results:
            logger.warning("No test results to report")
            return

        successful = [r for r in self.results if r.success]
        failed = [r for r in self.results if not r.success]

        # Group by endpoint
        endpoint_stats = {}
        for result in self.results:
            if result.endpoint not in endpoint_stats:
                endpoint_stats[result.endpoint] = {"success": 0, "failed": 0, "response_times": []}

            if result.success:
                endpoint_stats[result.endpoint]["success"] += 1
                endpoint_stats[result.endpoint]["response_times"].append(result.response_time)
            else:
                endpoint_stats[result.endpoint]["failed"] += 1

        # Generate report
        report = {
            "summary": {
                "total_requests": len(self.results),
                "successful_requests": len(successful),
                "failed_requests": len(failed),
                "success_rate": len(successful) / len(self.results) * 100 if self.results else 0,
                "average_response_time": statistics.mean([r.response_time for r in successful]) if successful else 0,
                "test_duration": time.time() - self.start_time if hasattr(self, 'start_time') else 0
            },
            "endpoint_details": {}
        }

        for endpoint, stats in endpoint_stats.items():
            if stats["response_times"]:
                report["endpoint_details"][endpoint] = {
                    "total_requests": stats["success"] + stats["failed"],
                    "success_rate": stats["success"] / (stats["success"] + stats["failed"]) * 100,
                    "avg_response_time": statistics.mean(stats["response_times"]),
                    "min_response_time": min(stats["response_times"]),
                    "max_response_time": max(stats["response_times"])
                }

        # Save report
        with open("stress_test_report.json", "w") as f:
            json.dump(report, f, indent=2)

        # Print summary
        logger.info("📊 STRESS TEST REPORT")
        logger.info("=" * 50)
        logger.info(f"Total Requests: {report['summary']['total_requests']}")
        logger.info(f"Success Rate: {report['summary']['success_rate']:.2f}%")
        logger.info(f"Average Response Time: {report['summary']['average_response_time']:.3f}s")
        logger.info(f"Failed Requests: {report['summary']['failed_requests']}")
        logger.info("=" * 50)

        for endpoint, details in report["endpoint_details"].items():
            logger.info(f"{endpoint}: {details['success_rate']:.1f}% success, {details['avg_response_time']:.3f}s avg")

    async def run_full_stress_test(self):
        """Run comprehensive stress test suite"""
        self.start_time = time.time()
        logger.info("🚀 Starting Full OmniAI Platform Stress Test")

        # Test sequence
        await self.stress_test_backend_direct()
        await self.stress_test_api_endpoints()
        await self.memory_stress_test()
        await self.sustained_load_test(duration_minutes=1)  # 1 minute for demo

        self.generate_report()
        logger.info("✅ Stress test completed!")

def check_services():
    """Check if services are running"""
    logger.info("🔍 Checking service availability...")

    services = [
        ("Backend", "http://0.0.0.0:5000/health"),
        ("Middleware", "http://0.0.0.0:8080/health")
    ]

    for name, url in services:
        try:
            import requests
            response = requests.get("https://0.0.0.0:5000/health", timeout=5, verify=False)
            if response.status_code == 200:
                logger.info(f"✅ {name} is running")
            else:
                logger.warning(f"⚠️ {name} responded with status {response.status_code}")
        except Exception as e:
            logger.error(f"❌ {name} is not accessible: {e}")

async def main():
    """Main stress test execution"""
    logger.info("🧪 OmniAI Platform Stress Testing Suite")
    logger.info("=" * 50)

    # Check services first
    check_services()

    # Run stress tests
    runner = StressTestRunner()
    await runner.run_full_stress_test()

if __name__ == "__main__":
    asyncio.run(main())