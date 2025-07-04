
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRecoilState } from 'recoil'
import { 
  AppShell, 
  Group, 
  Text, 
  UnstyledButton, 
  Indicator,
  ActionIcon,
  rem,
  useMantineColorScheme,
  Tooltip,
  Avatar,
  Menu,
  Badge
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { 
  IconCpu, 
  IconCloud, 
  IconBolt, 
  IconBrandGithub, 
  IconSettings, 
  IconDashboard,
  IconSun,
  IconMoon,
  IconUser,
  IconLogout,
  IconBell
} from '@tabler/icons-react'
import Dashboard from './components/Dashboard'
import NVIDIAPanel from './components/NVIDIAPanel'
import DeploymentPanel from './components/DeploymentPanel'
import GitHubIntegration from './components/GitHubIntegration'
import VercelIntegration from './components/VercelIntegration'
import { platformStatusState } from './state/atoms'

type Tab = 'dashboard' | 'nvidia' | 'github' | 'vercel' | 'deployment'

const tabs = [
  { id: 'dashboard' as Tab, label: 'Dashboard', icon: IconDashboard, color: 'blue' },
  { id: 'nvidia' as Tab, label: 'NVIDIA', icon: IconCpu, color: 'green' },
  { id: 'github' as Tab, label: 'GitHub', icon: IconBrandGithub, color: 'dark' },
  { id: 'vercel' as Tab, label: 'Vercel', icon: IconCloud, color: 'cyan' },
  { id: 'deployment' as Tab, label: 'Deploy', icon: IconBolt, color: 'orange' },
]

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [platformStatus, setPlatformStatus] = useRecoilState(platformStatusState)
  const [opened, { toggle }] = useDisclosure()
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()

  useEffect(() => {
    fetchPlatformStatus()
    const interval = setInterval(fetchPlatformStatus, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchPlatformStatus = async () => {
    try {
      const response = await fetch('/api/status')
      const data = await response.json()
      setPlatformStatus(data)
      
      if (data.backend && data.middleware) {
        notifications.show({
          title: 'System Status',
          message: 'All services are online',
          color: 'green',
          autoClose: 3000,
        })
      }
    } catch (error) {
      console.error('Failed to fetch platform status:', error)
      notifications.show({
        title: 'Connection Error',
        message: 'Unable to connect to services',
        color: 'red',
        autoClose: 5000,
      })
    }
  }

  const isOnline = platformStatus.backend && platformStatus.middleware

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{ width: 280, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Group gap="sm">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <IconSettings size={24} color="white" />
                </div>
                <div>
                  <Text size="xl" fw={700} c="bright">
                    OmniAI
                  </Text>
                  <Text size="xs" c="dimmed">
                    AI-Powered XR & Cloud Gaming
                  </Text>
                </div>
              </Group>
            </motion.div>
          </Group>

          <Group>
            <Indicator 
              color={isOnline ? 'green' : 'red'} 
              size={10} 
              offset={7}
              position="top-end"
            >
              <Badge 
                variant="light" 
                color={isOnline ? 'green' : 'red'}
                size="sm"
              >
                {isOnline ? 'Online' : 'Offline'}
              </Badge>
            </Indicator>

            <Tooltip label="Notifications">
              <ActionIcon variant="subtle" size="lg">
                <IconBell size={20} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label={`Switch to ${colorScheme === 'dark' ? 'light' : 'dark'} mode`}>
              <ActionIcon 
                variant="subtle" 
                size="lg"
                onClick={() => toggleColorScheme()}
              >
                {colorScheme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
              </ActionIcon>
            </Tooltip>

            <Menu shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon variant="subtle" size="lg">
                  <Avatar size="sm" color="blue">
                    <IconUser size={16} />
                  </Avatar>
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<IconUser size={14} />}>
                  Profile
                </Menu.Item>
                <Menu.Item leftSection={<IconSettings size={14} />}>
                  Settings
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item leftSection={<IconLogout size={14} />} color="red">
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <div className="flex flex-col gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <motion.div
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <UnstyledButton
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full p-3 rounded-lg transition-all duration-200
                    ${activeTab === tab.id 
                      ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  <Group>
                    <Icon size={20} />
                    <Text fw={activeTab === tab.id ? 700 : 500}>
                      {tab.label}
                    </Text>
                  </Group>
                </UnstyledButton>
              </motion.div>
            )
          })}
        </div>
      </AppShell.Navbar>

      <AppShell.Main>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'nvidia' && <NVIDIAPanel />}
            {activeTab === 'github' && <GitHubIntegration />}
            {activeTab === 'vercel' && <VercelIntegration />}
            {activeTab === 'deployment' && <DeploymentPanel />}
          </motion.div>
        </AnimatePresence>
      </AppShell.Main>
    </AppShell>
  )
}

export default App
