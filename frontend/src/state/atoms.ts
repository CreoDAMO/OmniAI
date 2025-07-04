
import { atom } from 'recoil'

export interface DeploymentState {
  status: 'idle' | 'loading' | 'success' | 'error'
  repoName: string
  projectName: string
  message?: string
}

export interface NVIDIAState {
  dlssEnabled: boolean
  cloudxrConnected: boolean
  gfnStatus: 'disconnected' | 'connecting' | 'connected'
  performance: {
    fps: number
    latency: number
    bandwidth: number
  }
}

export interface ProjectState {
  name: string
  framework: 'nextjs' | 'react' | 'svelte' | 'vue'
  private: boolean
  description: string
  features: string[]
}

export const deploymentState = atom<DeploymentState>({
  key: 'deploymentState',
  default: {
    status: 'idle',
    repoName: '',
    projectName: '',
  },
})

export const nvidiaState = atom<NVIDIAState>({
  key: 'nvidiaState',
  default: {
    dlssEnabled: false,
    cloudxrConnected: false,
    gfnStatus: 'disconnected',
    performance: {
      fps: 0,
      latency: 0,
      bandwidth: 0,
    },
  },
})

export const projectState = atom<ProjectState>({
  key: 'projectState',
  default: {
    name: '',
    framework: 'nextjs',
    private: false,
    description: '',
    features: [],
  },
})

export const platformStatusState = atom({
  key: 'platformStatusState',
  default: {
    backend: false,
    middleware: false,
    nvidia: false,
    github: false,
    vercel: false,
  },
})
