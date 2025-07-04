
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRecoilValue } from 'recoil'
import {
  Grid,
  Card,
  Text,
  Progress,
  Group,
  RingProgress,
  SimpleGrid,
  Badge,
  ActionIcon,
  Tooltip,
  Stack,
  Alert,
  Notification,
  rem
} from '@mantine/core'
import { LineChart, AreaChart, BarChart } from '@mantine/charts'
import {
  IconCpu,
  IconCloud,
  IconBolt,
  IconActivity,
  IconTrendingUp,
  IconServer,
  IconDatabase,
  IconRefresh,
  IconAlertTriangle,
  IconCheck
} from '@tabler/icons-react'
import { platformStatusState, nvidiaState } from '../state/atoms'
import { formatBytes, formatDuration } from '../lib/utils'

const performanceData = [
  { time: '00:00', fps: 60, latency: 15, bandwidth: 1.2 },
  { time: '00:05', fps: 58, latency: 18, bandwidth: 1.4 },
  { time: '00:10', fps: 62, latency: 12, bandwidth: 1.3 },
  { time: '00:15', fps: 59, latency: 16, bandwidth: 1.5 },
  { time: '00:20', fps: 61, latency: 14, bandwidth: 1.1 },
]

const systemMetrics = [
  { label: 'CPU Usage', value: 45, color: 'blue' },
  { label: 'Memory', value: 67, color: 'green' },
  { label: 'Storage', value: 23, color: 'orange' },
  { label: 'Network', value: 89, color: 'red' },
]

function Dashboard() {
  const platformStatus = useRecoilValue(platformStatusState)
  const nvidia = useRecoilValue(nvidiaState)
  const [metrics, setMetrics] = useState({
    activeProjects: 3,
    totalDeployments: 12,
    averageLatency: 15,
    uptime: 99.9
  })

  useEffect(() => {
    // Simulate real-time metrics updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        averageLatency: Math.floor(Math.random() * 10) + 10,
        uptime: 99.9 + Math.random() * 0.1
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const statCards = [
    {
      title: 'Active Projects',
      value: metrics.activeProjects,
      icon: IconActivity,
      color: 'blue',
      change: '+12%',
      positive: true
    },
    {
      title: 'Total Deployments',
      value: metrics.totalDeployments,
      icon: IconBolt,
      color: 'green',
      change: '+8%',
      positive: true
    },
    {
      title: 'Avg Latency',
      value: `${metrics.averageLatency}ms`,
      icon: IconTrendingUp,
      color: 'orange',
      change: '-5%',
      positive: true
    },
    {
      title: 'Uptime',
      value: `${metrics.uptime.toFixed(1)}%`,
      icon: IconServer,
      color: 'teal',
      change: '+0.1%',
      positive: true
    }
  ]

  return (
    <Stack gap="lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Group justify="space-between" align="center">
          <div>
            <Text size="xl" fw={700} mb={5}>
              Platform Dashboard
            </Text>
            <Text c="dimmed" size="sm">
              Monitor your XR and cloud gaming platform performance
            </Text>
          </div>
          <Tooltip label="Refresh Data">
            <ActionIcon variant="light" size="lg">
              <IconRefresh size={20} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </motion.div>

      {/* Status Alert */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Alert 
          icon={platformStatus.backend ? <IconCheck size={16} /> : <IconAlertTriangle size={16} />}
          color={platformStatus.backend ? 'green' : 'red'}
          title={platformStatus.backend ? 'All Systems Operational' : 'System Issues Detected'}
        >
          {platformStatus.backend 
            ? 'All services are running smoothly. NVIDIA integration is active.'
            : 'Some services are experiencing issues. Please check the system logs.'
          }
        </Alert>
      </motion.div>

      {/* Stats Cards */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card padding="lg" radius="md" withBorder>
              <Group justify="space-between">
                <div>
                  <Text c="dimmed" size="sm" tt="uppercase" fw={700}>
                    {stat.title}
                  </Text>
                  <Text fw={700} size="xl" mt={5}>
                    {stat.value}
                  </Text>
                  <Badge 
                    color={stat.positive ? 'green' : 'red'} 
                    variant="light" 
                    size="sm"
                    mt={5}
                  >
                    {stat.change}
                  </Badge>
                </div>
                <ActionIcon variant="light" color={stat.color} size="xl" radius="md">
                  <stat.icon size={28} />
                </ActionIcon>
              </Group>
            </Card>
          </motion.div>
        ))}
      </SimpleGrid>

      {/* Charts and Metrics */}
      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card padding="lg" radius="md" withBorder>
              <Text fw={700} mb="md">Performance Metrics</Text>
              <AreaChart
                h={300}
                data={performanceData}
                dataKey="time"
                series={[
                  { name: 'fps', color: 'blue.6' },
                  { name: 'latency', color: 'red.6' },
                  { name: 'bandwidth', color: 'green.6' }
                ]}
                curveType="monotone"
                connectNulls={false}
                withGradient
              />
            </Card>
          </motion.div>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="lg">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card padding="lg" radius="md" withBorder>
                <Text fw={700} mb="md">System Health</Text>
                <Stack gap="sm">
                  {systemMetrics.map((metric) => (
                    <div key={metric.label}>
                      <Group justify="space-between" mb={5}>
                        <Text size="sm">{metric.label}</Text>
                        <Text size="sm" fw={500}>{metric.value}%</Text>
                      </Group>
                      <Progress 
                        value={metric.value} 
                        color={metric.color}
                        size="sm"
                        radius="xs"
                      />
                    </div>
                  ))}
                </Stack>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card padding="lg" radius="md" withBorder>
                <Text fw={700} mb="md">NVIDIA Status</Text>
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Text size="sm">DLSS</Text>
                    <Badge 
                      color={nvidia.dlssEnabled ? 'green' : 'gray'}
                      variant="light"
                      size="sm"
                    >
                      {nvidia.dlssEnabled ? 'Active' : 'Inactive'}
                    </Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm">CloudXR</Text>
                    <Badge 
                      color={nvidia.cloudxrConnected ? 'green' : 'gray'}
                      variant="light"
                      size="sm"
                    >
                      {nvidia.cloudxrConnected ? 'Connected' : 'Disconnected'}
                    </Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm">GeForce NOW</Text>
                    <Badge 
                      color={nvidia.gfnStatus === 'connected' ? 'green' : 'gray'}
                      variant="light"
                      size="sm"
                    >
                      {nvidia.gfnStatus}
                    </Badge>
                  </Group>
                </Stack>
              </Card>
            </motion.div>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  )
}

export default Dashboard
