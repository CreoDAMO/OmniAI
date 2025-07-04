
import { createTheme } from '@mantine/core'

export const theme = createTheme({
  colors: {
    brand: [
      '#e7f5ff',
      '#d0ebff',
      '#a5d8ff',
      '#74c0fc',
      '#339af0',
      '#228be6',
      '#1971c2',
      '#1864ab',
      '#0c5aa6',
      '#1098ad'
    ],
    nvidia: [
      '#e8f5e8',
      '#d3f3d3',
      '#a8e6a8',
      '#7dd87d',
      '#5ccc5c',
      '#4ac34a',
      '#3db83d',
      '#2fa22f',
      '#269126',
      '#1a7f1a'
    ],
    dark: [
      '#f8f9fa',
      '#e9ecef',
      '#dee2e6',
      '#ced4da',
      '#adb5bd',
      '#6c757d',
      '#495057',
      '#343a40',
      '#212529',
      '#0d1117'
    ]
  },
  primaryColor: 'brand',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  headings: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    sizes: {
      h1: { fontSize: '2.5rem', fontWeight: '700' },
      h2: { fontSize: '2rem', fontWeight: '600' },
      h3: { fontSize: '1.5rem', fontWeight: '600' },
    }
  },
  defaultRadius: 'md',
  defaultGradient: {
    from: 'brand.6',
    to: 'nvidia.6',
    deg: 45,
  },
  other: {
    chartsColors: ['brand.6', 'nvidia.6', 'blue.6', 'teal.6', 'yellow.6', 'red.6', 'grape.6'],
  }
})
