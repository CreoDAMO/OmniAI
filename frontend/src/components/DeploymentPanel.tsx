
import { useState } from 'react'
import { Rocket, Github, Cloud, Settings, CheckCircle, AlertCircle } from 'lucide-react'

export default function DeploymentPanel() {
  const [activeDeployment, setActiveDeployment] = useState<string | null>(null)
  const [deploymentConfig, setDeploymentConfig] = useState({
    projectName: '',
    repository: '',
    framework: 'nextjs',
    buildCommand: '',
    outputDirectory: '',
    environmentVars: {}
  })

  const deploymentSteps = [
    {
      id: 'github',
      title: 'GitHub Repository',
      description: 'Create or select repository',
      icon: Github,
      status: 'pending'
    },
    {
      id: 'configure',
      title: 'Configuration',
      description: 'Set build and environment settings',
      icon: Settings,
      status: 'pending'
    },
    {
      id: 'deploy',
      title: 'Deploy to Vercel',
      description: 'Build and deploy to production',
      icon: Cloud,
      status: 'pending'
    },
    {
      id: 'complete',
      title: 'Complete',
      description: 'Your application is live',
      icon: CheckCircle,
      status: 'pending'
    }
  ]

  const quickDeployOptions = [
    {
      name: 'Next.js App',
      framework: 'nextjs',
      description: 'React framework with SSR and static generation',
      buildCommand: 'npm run build',
      outputDirectory: '.next'
    },
    {
      name: 'React App',
      framework: 'react',
      description: 'Single-page application with Create React App',
      buildCommand: 'npm run build',
      outputDirectory: 'build'
    },
    {
      name: 'Svelte App',
      framework: 'svelte',
      description: 'Compiled frontend framework',
      buildCommand: 'npm run build',
      outputDirectory: 'dist'
    },
    {
      name: 'Python API',
      framework: 'python',
      description: 'FastAPI or Flask backend',
      buildCommand: 'pip install -r requirements.txt',
      outputDirectory: ''
    }
  ]

  const handleQuickDeploy = (option: any) => {
    setDeploymentConfig({
      ...deploymentConfig,
      framework: option.framework,
      buildCommand: option.buildCommand,
      outputDirectory: option.outputDirectory
    })
  }

  const startDeployment = async () => {
    setActiveDeployment('github')
    // Simulate deployment process
    setTimeout(() => setActiveDeployment('configure'), 2000)
    setTimeout(() => setActiveDeployment('deploy'), 4000)
    setTimeout(() => setActiveDeployment('complete'), 6000)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Deployment Center</h2>
        <button className="btn-primary">
          <Rocket className="w-4 h-4 mr-2" />
          New Deployment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="text-xl font-semibold text-white mb-6">Quick Deploy</h3>
          
          <div className="space-y-4">
            {quickDeployOptions.map((option) => (
              <div
                key={option.name}
                className="border border-gray-700 rounded-lg p-4 hover:border-nvidia-green/50 cursor-pointer transition-colors"
                onClick={() => handleQuickDeploy(option)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white">{option.name}</h4>
                    <p className="text-sm text-gray-400 mt-1">{option.description}</p>
                  </div>
                  <button className="btn-secondary text-xs">Select</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-xl font-semibold text-white mb-6">Custom Configuration</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={deploymentConfig.projectName}
                onChange={(e) => setDeploymentConfig({ 
                  ...deploymentConfig, 
                  projectName: e.target.value 
                })}
                className="input w-full"
                placeholder="my-awesome-project"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Repository URL
              </label>
              <input
                type="text"
                value={deploymentConfig.repository}
                onChange={(e) => setDeploymentConfig({ 
                  ...deploymentConfig, 
                  repository: e.target.value 
                })}
                className="input w-full"
                placeholder="https://github.com/username/repo"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Build Command
              </label>
              <input
                type="text"
                value={deploymentConfig.buildCommand}
                onChange={(e) => setDeploymentConfig({ 
                  ...deploymentConfig, 
                  buildCommand: e.target.value 
                })}
                className="input w-full"
                placeholder="npm run build"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Output Directory
              </label>
              <input
                type="text"
                value={deploymentConfig.outputDirectory}
                onChange={(e) => setDeploymentConfig({ 
                  ...deploymentConfig, 
                  outputDirectory: e.target.value 
                })}
                className="input w-full"
                placeholder="dist"
              />
            </div>
            
            <button
              onClick={startDeployment}
              disabled={!deploymentConfig.projectName}
              className="btn-primary w-full disabled:opacity-50"
            >
              Start Deployment
            </button>
          </div>
        </div>
      </div>

      {activeDeployment && (
        <div className="card">
          <h3 className="text-xl font-semibold text-white mb-6">Deployment Progress</h3>
          
          <div className="space-y-4">
            {deploymentSteps.map((step) => {
              const Icon = step.icon
              const isActive = activeDeployment === step.id
              const isCompleted = deploymentSteps.findIndex(s => s.id === activeDeployment) > 
                                deploymentSteps.findIndex(s => s.id === step.id)
              
              return (
                <div key={step.id} className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-green-500' : 
                    isActive ? 'bg-nvidia-green animate-pulse' : 
                    'bg-gray-700'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <Icon className={`w-5 h-5 ${isActive ? 'text-black' : 'text-gray-400'}`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${isActive || isCompleted ? 'text-white' : 'text-gray-400'}`}>
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-400">{step.description}</p>
                  </div>
                  {isActive && (
                    <div className="text-sm text-nvidia-green">In Progress...</div>
                  )}
                  {isCompleted && (
                    <div className="text-sm text-green-400">Completed</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
