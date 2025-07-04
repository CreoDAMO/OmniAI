
import { useState, useEffect } from 'react'
import { Cpu, Cloud, Zap, Github, Settings, Monitor } from 'lucide-react'
import Dashboard from './components/Dashboard'
import NVIDIAPanel from './components/NVIDIAPanel'
import DeploymentPanel from './components/DeploymentPanel'
import GitHubIntegration from './components/GitHubIntegration'
import VercelIntegration from './components/VercelIntegration'

type Tab = 'dashboard' | 'nvidia' | 'github' | 'vercel' | 'deployment'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [platformStatus, setPlatformStatus] = useState<any>(null)

  useEffect(() => {
    fetchPlatformStatus()
  }, [])

  const fetchPlatformStatus = async () => {
    try {
      const response = await fetch('/api/status')
      const data = await response.json()
      setPlatformStatus(data)
    } catch (error) {
      console.error('Failed to fetch platform status:', error)
    }
  }

  const tabs = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: Monitor },
    { id: 'nvidia' as Tab, label: 'NVIDIA', icon: Cpu },
    { id: 'github' as Tab, label: 'GitHub', icon: Github },
    { id: 'vercel' as Tab, label: 'Vercel', icon: Cloud },
    { id: 'deployment' as Tab, label: 'Deploy', icon: Zap },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-omni-dark via-gray-900 to-omni-dark">
      <header className="border-b border-gray-800 bg-omni-dark/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-nvidia-green rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">OmniAI</h1>
                <p className="text-sm text-gray-400">AI-Powered XR & Cloud Gaming Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${platformStatus ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-400">
                {platformStatus ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <nav className="border-b border-gray-800 bg-omni-gray/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-nvidia-green text-nvidia-green'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <Dashboard status={platformStatus} />}
        {activeTab === 'nvidia' && <NVIDIAPanel />}
        {activeTab === 'github' && <GitHubIntegration />}
        {activeTab === 'vercel' && <VercelIntegration />}
        {activeTab === 'deployment' && <DeploymentPanel />}
      </main>
    </div>
  )
}

export default App
