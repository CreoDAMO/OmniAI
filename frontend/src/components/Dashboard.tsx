
import { useState, useEffect } from 'react'
import { Activity, Server, Database, Cpu, Cloud, Zap } from 'lucide-react'

interface DashboardProps {
  status: any
}

export default function Dashboard({ status }: DashboardProps) {
  const [healthData, setHealthData] = useState<any>(null)

  useEffect(() => {
    fetchHealthData()
    const interval = setInterval(fetchHealthData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchHealthData = async () => {
    try {
      const response = await fetch('/health')
      const data = await response.json()
      setHealthData(data)
    } catch (error) {
      console.error('Failed to fetch health data:', error)
    }
  }

  const services = [
    {
      name: 'NVIDIA GeForce NOW',
      status: status?.nvidia_integration?.geforce_now || 'not_configured',
      icon: Cpu,
      description: 'Cloud gaming streaming service'
    },
    {
      name: 'NVIDIA CloudXR',
      status: status?.nvidia_integration?.cloudxr || 'not_configured',
      icon: Server,
      description: 'Extended reality streaming platform'
    },
    {
      name: 'NVIDIA DLSS',
      status: status?.nvidia_integration?.dlss || 'not_configured',
      icon: Zap,
      description: 'AI-powered super resolution'
    },
    {
      name: 'GitHub Integration',
      status: status?.deployment?.github || 'not_configured',
      icon: Database,
      description: 'Repository management and automation'
    },
    {
      name: 'Vercel Platform',
      status: status?.deployment?.vercel || 'not_configured',
      icon: Cloud,
      description: 'Deployment and hosting platform'
    },
    {
      name: 'AI Services',
      status: status?.ai_services?.openai || 'not_configured',
      icon: Activity,
      description: 'OpenAI and Pinecone integration'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-400'
      case 'not_configured': return 'text-yellow-400'
      default: return 'text-red-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Online'
      case 'not_configured': return 'Not Configured'
      default: return 'Offline'
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Platform Overview</h2>
        <button 
          onClick={fetchHealthData}
          className="btn-secondary"
        >
          Refresh Status
        </button>
      </div>

      {healthData && (
        <div className="card">
          <h3 className="text-xl font-semibold mb-4 text-white">System Health</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{healthData.status}</div>
              <div className="text-gray-400">Overall Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {Object.keys(healthData.services || {}).length}
              </div>
              <div className="text-gray-400">Active Services</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">v1.0.0</div>
              <div className="text-gray-400">Platform Version</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const Icon = service.icon
          return (
            <div key={service.name} className="card hover:bg-gray-800/50 transition-colors">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-nvidia-green/20 rounded-lg">
                  <Icon className="w-6 h-6 text-nvidia-green" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{service.name}</h3>
                  <p className="text-sm text-gray-400 mb-2">{service.description}</p>
                  <div className={`text-sm font-medium ${getStatusColor(service.status)}`}>
                    {getStatusText(service.status)}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="card">
        <h3 className="text-xl font-semibold mb-4 text-white">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-primary w-full">
            Configure NVIDIA SDKs
          </button>
          <button className="btn-secondary w-full">
            Setup GitHub Integration
          </button>
          <button className="btn-secondary w-full">
            Deploy to Vercel
          </button>
        </div>
      </div>
    </div>
  )
}
