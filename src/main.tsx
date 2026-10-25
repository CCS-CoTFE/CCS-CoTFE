import { createRoot } from 'react-dom/client'
import '@glass-sdk/liquid-glass/styles.css'
import './styles/global.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <App />,
)
