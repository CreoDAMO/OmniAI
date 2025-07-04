
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { ModalsProvider } from '@mantine/modals'
import { RecoilRoot } from 'recoil'
import App from './App.tsx'
import './index.css'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/charts/styles.css'
import { theme } from './theme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RecoilRoot>
      <MantineProvider theme={theme}>
        <Notifications />
        <ModalsProvider>
          <App />
        </ModalsProvider>
      </MantineProvider>
    </RecoilRoot>
  </StrictMode>,
)
