import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  base: Boolean((globalThis as { process?: { env?: { GITHUB_ACTIONS?: string } } }).process?.env?.GITHUB_ACTIONS) ? '/CCS-CoTFE/' : '/',
})
