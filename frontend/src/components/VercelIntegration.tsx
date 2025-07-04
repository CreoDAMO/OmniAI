
import { useState, useEffect } from 'react'
import { Cloud, ExternalLink, Globe, Zap, Settings, Activity } from 'lucide-react'

export default function VercelIntegration() {
  const [projects, setProjects] = useState<any[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [newProject, setNewProject] = useState({
    name: '',
    framework: 'nextjs',
    gitRepo: '',
    environmentVars: [{ key: '', value: '' }]
  })

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      const response = await fetch('/api/vercel/status')
      if (response.ok) {
        const data = await response.json()
        setIsConnected(data.connected)
        if (data.connected) {
          fetchProjects()
        }
      }
    } catch (error) {
      console.error('Failed to check Vercel connection:', error)
    }
  }

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/vercel/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects || [])
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const createProject = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/vercel/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      })
      
      if (response.ok) {
        const data = await response.json()
        setProjects([data.project, ...projects])
        setNewProject({ 
          name: '', 
          framework: 'nextjs', 
          gitRepo: '', 
          environmentVars: [{ key: '', value: '' }] 
        })
      }
    } catch (error) {
      console.error('Failed to create project:', error)
    } finally {
      setLoading(false)
    }
  }

  const deployProject = async (projectId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/vercel/projects/${projectId}/deploy`, {
        method: 'POST',
      })
      
      if (response.ok) {
        fetchProjects() // Refresh projects list
      }
    } catch (error) {
      console.error('Failed to deploy project:', error)
    } finally {
      setLoading(false)
    }
  }

  const addEnvironmentVar = () => {
    setNewProject({
      ...newProject,
      environmentVars: [...newProject.environmentVars, { key: '', value: '' }]
    })
  }

  const updateEnvironmentVar = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...newProject.environmentVars]
    updated[index][field] = value
    setNewProject({ ...newProject, environmentVars: updated })
  }

  const removeEnvironmentVar = (index: number) => {
    const updated = newProject.environmentVars.filter((_, i) => i !== index)
    setNewProject({ ...newProject, environmentVars: updated })
  }

  const frameworks = [
    { value: 'nextjs', label: 'Next.js' },
    { value: 'react', label: 'Create React App' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'svelte', label: 'SvelteKit' },
    { value: 'nuxt', label: 'Nuxt.js' },
    { value: 'gatsby', label: 'Gatsby' },
    { value: 'vite', label: 'Vite' }
  ]

  if (!isConnected) {
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-white">Vercel Integration</h2>
        
        <div className="card text-center max-w-md mx-auto">
          <Cloud className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Connect to Vercel</h3>
          <p className="text-gray-400 mb-6">
            Connect your Vercel account to deploy and manage your applications.
          </p>
          <button className="btn-primary w-full">
            Connect Vercel Account
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Vercel Integration</h2>
        <div className="flex items-center space-x-2 text-green-400">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-sm">Connected</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="text-xl font-semibold text-white mb-6">Deploy New Project</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                className="input w-full"
                placeholder="my-vercel-project"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Framework
              </label>
              <select
                value={newProject.framework}
                onChange={(e) => setNewProject({ ...newProject, framework: e.target.value })}
                className="input w-full"
              >
                {frameworks.map((framework) => (
                  <option key={framework.value} value={framework.value}>
                    {framework.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Git Repository URL
              </label>
              <input
                type="text"
                value={newProject.gitRepo}
                onChange={(e) => setNewProject({ ...newProject, gitRepo: e.target.value })}
                className="input w-full"
                placeholder="https://github.com/username/repo"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Environment Variables
                </label>
                <button
                  type="button"
                  onClick={addEnvironmentVar}
                  className="text-xs text-nvidia-green hover:text-nvidia-green/80"
                >
                  + Add Variable
                </button>
              </div>
              
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {newProject.environmentVars.map((envVar, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="KEY"
                      value={envVar.key}
                      onChange={(e) => updateEnvironmentVar(index, 'key', e.target.value)}
                      className="input flex-1"
                    />
                    <input
                      type="text"
                      placeholder="VALUE"
                      value={envVar.value}
                      onChange={(e) => updateEnvironmentVar(index, 'value', e.target.value)}
                      className="input flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeEnvironmentVar(index)}
                      className="text-red-400 hover:text-red-300 px-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <button
              onClick={createProject}
              disabled={loading || !newProject.name}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create & Deploy Project'}
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-xl font-semibold text-white mb-6">Your Projects</h3>
          
          {loading ? (
            <div className="text-center text-gray-400">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="text-center text-gray-400">No projects found</div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {projects.map((project) => (
                <div key={project.id} className="border border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-white">{project.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded ${
                          project.status === 'ready' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {project.status || 'Unknown'}
                        </span>
                      </div>
                      {project.framework && (
                        <p className="text-sm text-gray-400 mt-1">
                          Framework: {project.framework}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-nvidia-green hover:text-nvidia-green/80"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => deployProject(project.id)}
                        disabled={loading}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Zap className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Globe className="w-3 h-3" />
                      <span>{project.url ? 'Live' : 'Not deployed'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Activity className="w-3 h-3" />
                      <span>Updated {project.updatedAt || 'Unknown'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
