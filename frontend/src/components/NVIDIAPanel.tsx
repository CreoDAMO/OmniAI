
import { useState, useEffect } from 'react'
import { Cpu, Monitor, Zap, Settings, Activity } from 'lucide-react'

export default function NVIDIAPanel() {
  const [nvidiaStatus, setNvidiaStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchNvidiaStatus()
  }, [])

  const fetchNvidiaStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/nvidia/status')
      if (response.ok) {
        const data = await response.json()
        setNvidiaStatus(data)
      }
    } catch (error) {
      console.error('Failed to fetch NVIDIA status:', error)
    } finally {
      setLoading(false)
    }
  }

  const services = [
    {
      name: 'GeForce NOW',
      key: 'gfn',
      icon: Cpu,
      description: 'Cloud gaming streaming service',
      features: ['Game streaming', 'RTX support', 'Low latency']
    },
    {
      name: 'CloudXR',
      key: 'cloudxr',
      icon: Monitor,
      description: 'Extended reality streaming platform',
      features: ['VR/AR streaming', 'Multi-platform', 'Real-time rendering']
    },
    {
      name: 'DLSS 4',
      key: 'dlss',
      icon: Zap,
      description: 'AI-powered super resolution',
      features: ['AI upscaling', 'Frame generation', 'Ray reconstruction']
    }
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">NVIDIA Integration</h2>
        <button 
          onClick={fetchNvidiaStatus}
          disabled={loading}
          className="btn-secondary"
        >
          {loading ? 'Checking...' : 'Refresh Status'}
        </button>
      </div>

      {nvidiaStatus && (
        <div className="card">
          <h3 className="text-xl font-semibold mb-4 text-white">GPU Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-nvidia-green">
                {nvidiaStatus.gpu_available ? 'Available' : 'Not Detected'}
              </div>
              <div className="text-gray-400">GPU Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {nvidiaStatus.gpu_info?.name || 'Unknown'}
              </div>
              <div className="text-gray-400">GPU Model</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {nvidiaStatus.gpu_info?.memory || 'N/A'}
              </div>
              <div className="text-gray-400">VRAM</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const Icon = service.icon
          const status = nvidiaStatus?.services?.[service.key] || 'unknown'
          const isReady = status === 'ready'
          
          return (
            <div key={service.name} className="card">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-3 rounded-lg ${isReady ? 'bg-nvidia-green/20' : 'bg-gray-700'}`}>
                  <Icon className={`w-6 h-6 ${isReady ? 'text-nvidia-green' : 'text-gray-400'}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                  <div className={`text-sm ${isReady ? 'text-green-400' : 'text-yellow-400'}`}>
                    {isReady ? 'Ready' : 'Not Configured'}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-400 text-sm mb-4">{service.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="text-sm font-medium text-gray-300">Features:</div>
                <ul className="text-xs text-gray-400 space-y-1">
                  {service.features.map((feature, index) => (
                    <li key={index}>• {feature}</li>
                  ))}
                </ul>
              </div>
              
              <button className={`w-full ${isReady ? 'btn-secondary' : 'btn-primary'}`}>
                {isReady ? 'Configure' : 'Setup'}
              </button>
            </div>
          )
        })}
      </div>

      <div className="card">
        <h3 className="text-xl font-semibold mb-4 text-white">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">0ms</div>
            <div className="text-sm text-gray-400">Latency</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">60fps</div>
            <div className="text-sm text-gray-400">Frame Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">4K</div>
            <div className="text-sm text-gray-400">Resolution</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">45%</div>
            <div className="text-sm text-gray-400">GPU Usage</div>
          </div>
        </div>
      </div>
    </div>
  )
}
