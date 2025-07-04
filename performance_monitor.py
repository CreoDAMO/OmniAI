
#!/usr/bin/env python3
"""
Real-time Performance Monitor for OmniAI Platform
Monitors system resources, response times, and service health
"""

import asyncio
import aiohttp
import psutil
import time
import json
import logging
from datetime import datetime
import threading
import queue

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PerformanceMonitor:
    def __init__(self):
        self.metrics = []
        self.running = False
        self.metric_queue = queue.Queue()
        
    def collect_system_metrics(self):
        """Collect system resource metrics"""
        return {
            "timestamp": datetime.now().isoformat(),
            "cpu_percent": psutil.cpu_percent(),
            "memory_percent": psutil.virtual_memory().percent,
            "disk_percent": psutil.disk_usage('/').percent,
            "network_io": psutil.net_io_counters()._asdict(),
            "process_count": len(psutil.pids())
        }
    
    async def check_service_health(self, session: aiohttp.ClientSession):
        """Check health of all services"""
        services = {
            "backend": "http://0.0.0.0:5000/health",
            "middleware": "http://0.0.0.0:8080/health"
        }
        
        health_status = {}
        for name, url in services.items():
            try:
                start_time = time.time()
                async with session.get(url, timeout=5) as response:
                    response_time = time.time() - start_time
                    health_status[name] = {
                        "status": "healthy" if response.status == 200 else "unhealthy",
                        "response_time": response_time,
                        "status_code": response.status
                    }
            except Exception as e:
                health_status[name] = {
                    "status": "error",
                    "error": str(e),
                    "response_time": None
                }
        
        return health_status
    
    async def monitor_loop(self):
        """Main monitoring loop"""
        logger.info("📊 Starting Performance Monitor")
        
        async with aiohttp.ClientSession() as session:
            while self.running:
                try:
                    # Collect metrics
                    system_metrics = self.collect_system_metrics()
                    health_status = await self.check_service_health(session)
                    
                    combined_metrics = {
                        **system_metrics,
                        "services": health_status
                    }
                    
                    self.metrics.append(combined_metrics)
                    
                    # Log current status
                    logger.info(f"CPU: {system_metrics['cpu_percent']:.1f}% | "
                              f"Memory: {system_metrics['memory_percent']:.1f}% | "
                              f"Backend: {health_status.get('backend', {}).get('status', 'unknown')} | "
                              f"Middleware: {health_status.get('middleware', {}).get('status', 'unknown')}")
                    
                    # Keep only last 100 metrics
                    if len(self.metrics) > 100:
                        self.metrics.pop(0)
                    
                    await asyncio.sleep(5)  # Monitor every 5 seconds
                    
                except Exception as e:
                    logger.error(f"Monitoring error: {e}")
                    await asyncio.sleep(5)
    
    def start_monitoring(self):
        """Start the monitoring process"""
        self.running = True
        return asyncio.create_task(self.monitor_loop())
    
    def stop_monitoring(self):
        """Stop the monitoring process"""
        self.running = False
    
    def get_metrics_report(self):
        """Generate metrics report"""
        if not self.metrics:
            return "No metrics collected yet"
        
        recent_metrics = self.metrics[-10:]  # Last 10 readings
        
        avg_cpu = sum(m['cpu_percent'] for m in recent_metrics) / len(recent_metrics)
        avg_memory = sum(m['memory_percent'] for m in recent_metrics) / len(recent_metrics)
        
        service_health = {}
        for metric in recent_metrics:
            for service, status in metric.get('services', {}).items():
                if service not in service_health:
                    service_health[service] = []
                service_health[service].append(status.get('status') == 'healthy')
        
        report = {
            "system_performance": {
                "avg_cpu_percent": avg_cpu,
                "avg_memory_percent": avg_memory,
                "sample_count": len(recent_metrics)
            },
            "service_availability": {}
        }
        
        for service, health_checks in service_health.items():
            uptime = (sum(health_checks) / len(health_checks)) * 100
            report["service_availability"][service] = f"{uptime:.1f}%"
        
        return json.dumps(report, indent=2)

async def run_performance_monitor():
    """Run performance monitoring"""
    monitor = PerformanceMonitor()
    
    try:
        monitor_task = monitor.start_monitoring()
        
        # Run for 30 seconds as demo
        await asyncio.sleep(30)
        
        monitor.stop_monitoring()
        await monitor_task
        
        # Generate final report
        report = monitor.get_metrics_report()
        logger.info("📈 Performance Report:")
        logger.info(report)
        
    except KeyboardInterrupt:
        logger.info("Monitoring stopped by user")
        monitor.stop_monitoring()

if __name__ == "__main__":
    asyncio.run(run_performance_monitor())
