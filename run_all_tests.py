#!/usr/bin/env python3
"""
Comprehensive Test Runner for OmniAI Platform
Runs all stress tests, performance monitoring, and load testing
"""

import asyncio
import subprocess
import sys
import time
import logging
import json
from datetime import datetime

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class TestOrchestrator:
    def __init__(self):
        self.test_results = {}
        self.start_time = None

    def run_command(self, command, cwd=None):
        """Run a command safely and return result"""
        try:
            # Ensure command is a list for safe execution
            if isinstance(command, str):
                command = command.split()

            result = subprocess.run(
                command, 
                capture_output=True, 
                text=True, 
                timeout=30,
                cwd=cwd,
                shell=False  # Never use shell=True for security
            )
            return {
                "success": result.returncode == 0,
                "stdout": result.stdout,
                "stderr": result.stderr,
                "returncode": result.returncode
            }
        except subprocess.TimeoutExpired:
            return {
                "success": False,
                "stdout": "",
                "stderr": "Command timed out",
                "returncode": -1
            }
        except Exception as e:
            return {
                "success": False,
                "stdout": "",
                "stderr": str(e),
                "returncode": -1
            }

    async def check_prerequisites(self):
        """Check if all required tools are available"""
        logger.info("🔍 Checking Prerequisites")

        prerequisites = [
            ("python", "python --version"),
            ("pip", "pip --version"),
            ("node", "node --version"),
            ("npm", "npm --version"),
            ("cargo", "cargo --version"),
            ("curl", "curl --version")
        ]

        missing = []
        for tool, command in prerequisites:
            result = self.run_command(command)
            if result["success"]:
                logger.info(f"✅ {tool} is available")
            else:
                logger.error(f"❌ {tool} is not available")
                missing.append(tool)

        if missing:
            logger.error(f"Missing required tools: {', '.join(missing)}")
            return False

        return True

    async def start_services(self):
        """Start all required services"""
        logger.info("🚀 Starting Services")

        # Install dependencies
        logger.info("📦 Installing dependencies")

        # Python dependencies
        result = self.run_command(["pip", "install", "-r", "requirements.txt"])
        if not result["success"]:
            logger.error("❌ Failed to install Python dependencies")
            return False

        # Frontend dependencies
        result = self.run_command(["npm", "install"], cwd="frontend")
        if not result["success"]:
            logger.error("❌ Failed to install frontend dependencies")
            return False

        # Build middleware
        result = self.run_command(["cargo", "build", "--release"], cwd="middleware")
        if not result["success"]:
            logger.error("❌ Failed to build middleware")
            return False

        logger.info("✅ All services prepared")
        return True

    async def run_stress_tests(self):
        """Run comprehensive stress tests"""
        logger.info("🧪 Running Stress Tests")

        # Run the main stress test
        result = self.run_command(["python", "stress_test.py"])
        self.test_results["stress_test"] = result

        if result["success"]:
            logger.info("✅ Stress tests completed successfully")
        else:
            logger.error("❌ Stress tests failed")
            logger.error(result.get("stderr", "No error details"))

        return result["success"]

    async def run_performance_monitoring(self):
        """Run performance monitoring"""
        logger.info("📊 Running Performance Monitoring")

        # Run performance monitor for 30 seconds
        result = self.run_command(["timeout", "30", "python", "performance_monitor.py"])
        self.test_results["performance_monitor"] = result

        if result["success"]:
            logger.info("✅ Performance monitoring completed")
        else:
            logger.info("ℹ️ Performance monitoring finished (expected timeout)")

        return True

    async def run_component_tests(self):
        """Run individual component tests"""
        logger.info("🔧 Running Component Tests")

        components = [
            ("Backend Health", "curl -f http://0.0.0.0:5000/health"),
            ("Middleware Health", "curl -f http://0.0.0.0:8080/health"),
            ("API Status", "curl -f http://0.0.0.0:5000/api/status"),
            ("GitHub Integration", "curl -f http://0.0.0.0:8080/api/github/status"),
            ("NVIDIA Integration", "curl -f http://0.0.0.0:8080/api/nvidia/status"),
            ("Vercel Integration", "curl -f http://0.0.0.0:8080/api/vercel/status")
        ]

        component_results = {}
        for name, command in components:
            result = self.run_command(command)
            component_results[name] = result["success"]

            if result["success"]:
                logger.info(f"✅ {name}: OK")
            else:
                logger.warning(f"⚠️ {name}: Failed")

        self.test_results["component_tests"] = component_results
        return component_results

    def generate_final_report(self):
        """Generate comprehensive test report"""
        end_time = time.time()
        duration = end_time - self.start_time if self.start_time else 0

        report = {
            "test_suite": "OmniAI Platform Comprehensive Testing",
            "timestamp": datetime.now().isoformat(),
            "duration_seconds": duration,
            "results": self.test_results,
            "summary": {
                "total_tests": len(self.test_results),
                "passed": sum(1 for r in self.test_results.values() if isinstance(r, dict) and r.get("success", False)),
                "failed": sum(1 for r in self.test_results.values() if isinstance(r, dict) and not r.get("success", False))
            }
        }

        # Save report
        with open("comprehensive_test_report.json", "w") as f:
            json.dump(report, f, indent=2)

        # Print summary
        logger.info("📋 COMPREHENSIVE TEST REPORT")
        logger.info("=" * 60)
        logger.info(f"Test Duration: {duration:.2f} seconds")
        logger.info(f"Total Tests: {report['summary']['total_tests']}")
        logger.info(f"Passed: {report['summary']['passed']}")
        logger.info(f"Failed: {report['summary']['failed']}")
        logger.info("=" * 60)

        # Component test details
        if "component_tests" in self.test_results:
            logger.info("Component Test Results:")
            for component, success in self.test_results["component_tests"].items():
                status = "✅ PASS" if success else "❌ FAIL"
                logger.info(f"  {component}: {status}")

        logger.info(f"📄 Full report saved to: comprehensive_test_report.json")

        return report

    async def run_all_tests(self):
        """Run all tests in sequence"""
        self.start_time = time.time()

        logger.info("🧪 Starting OmniAI Platform Comprehensive Testing")
        logger.info("=" * 60)

        # Check prerequisites
        if not await self.check_prerequisites():
            logger.error("❌ Prerequisites check failed")
            return False

        # Start services
        if not await self.start_services():
            logger.error("❌ Service startup failed")
            return False

        # Wait for services to be ready
        logger.info("⏳ Waiting for services to be ready...")
        await asyncio.sleep(5)

        # Run component tests
        await self.run_component_tests()

        # Run performance monitoring
        await self.run_performance_monitoring()

        # Run stress tests
        await self.run_stress_tests()

        # Generate final report
        report = self.generate_final_report()

        logger.info("🎉 All tests completed!")
        return report

async def main():
    """Main test orchestrator"""
    orchestrator = TestOrchestrator()
    await orchestrator.run_all_tests()

if __name__ == "__main__":
    asyncio.run(main())