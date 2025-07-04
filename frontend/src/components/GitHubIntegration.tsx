
import { useState, useEffect } from 'react'
import { Github, GitBranch, Users, Star, ExternalLink } from 'lucide-react'

export default function GitHubIntegration() {
  const [repositories, setRepositories] = useState<any[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [newRepo, setNewRepo] = useState({
    name: '',
    description: '',
    private: false,
    framework: 'nextjs'
  })

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      const response = await fetch('/api/github/status')
      if (response.ok) {
        const data = await response.json()
        setIsConnected(data.connected)
        if (data.connected) {
          fetchRepositories()
        }
      }
    } catch (error) {
      console.error('Failed to check GitHub connection:', error)
    }
  }

  const fetchRepositories = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/github/repositories')
      if (response.ok) {
        const data = await response.json()
        setRepositories(data.repositories || [])
      }
    } catch (error) {
      console.error('Failed to fetch repositories:', error)
    } finally {
      setLoading(false)
    }
  }

  const createRepository = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/github/repositories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRepo),
      })
      
      if (response.ok) {
        const data = await response.json()
        setRepositories([data.repository, ...repositories])
        setNewRepo({ name: '', description: '', private: false, framework: 'nextjs' })
      }
    } catch (error) {
      console.error('Failed to create repository:', error)
    } finally {
      setLoading(false)
    }
  }

  const frameworks = [
    { value: 'nextjs', label: 'Next.js' },
    { value: 'react', label: 'React' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'python', label: 'Python' },
    { value: 'nodejs', label: 'Node.js' }
  ]

  if (!isConnected) {
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-white">GitHub Integration</h2>
        
        <div className="card text-center max-w-md mx-auto">
          <Github className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Connect to GitHub</h3>
          <p className="text-gray-400 mb-6">
            Connect your GitHub account to enable repository management and automated deployments.
          </p>
          <button className="btn-primary w-full">
            Connect GitHub Account
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">GitHub Integration</h2>
        <div className="flex items-center space-x-2 text-green-400">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-sm">Connected</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="text-xl font-semibold text-white mb-6">Create New Repository</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Repository Name
              </label>
              <input
                type="text"
                value={newRepo.name}
                onChange={(e) => setNewRepo({ ...newRepo, name: e.target.value })}
                className="input w-full"
                placeholder="my-awesome-project"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={newRepo.description}
                onChange={(e) => setNewRepo({ ...newRepo, description: e.target.value })}
                className="input w-full h-20 resize-none"
                placeholder="A brief description of your project"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Framework
              </label>
              <select
                value={newRepo.framework}
                onChange={(e) => setNewRepo({ ...newRepo, framework: e.target.value })}
                className="input w-full"
              >
                {frameworks.map((framework) => (
                  <option key={framework.value} value={framework.value}>
                    {framework.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="private"
                checked={newRepo.private}
                onChange={(e) => setNewRepo({ ...newRepo, private: e.target.checked })}
                className="mr-3"
              />
              <label htmlFor="private" className="text-sm text-gray-300">
                Private Repository
              </label>
            </div>
            
            <button
              onClick={createRepository}
              disabled={loading || !newRepo.name}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Repository'}
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-xl font-semibold text-white mb-6">Your Repositories</h3>
          
          {loading ? (
            <div className="text-center text-gray-400">Loading repositories...</div>
          ) : repositories.length === 0 ? (
            <div className="text-center text-gray-400">No repositories found</div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {repositories.map((repo) => (
                <div key={repo.id} className="border border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-white">{repo.name}</h4>
                        {repo.private && (
                          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                            Private
                          </span>
                        )}
                      </div>
                      {repo.description && (
                        <p className="text-sm text-gray-400 mt-1">{repo.description}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <GitBranch className="w-3 h-3" />
                          <span>{repo.default_branch || 'main'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3" />
                          <span>{repo.stargazers_count || 0}</span>
                        </div>
                      </div>
                    </div>
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-nvidia-green hover:text-nvidia-green/80"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
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
