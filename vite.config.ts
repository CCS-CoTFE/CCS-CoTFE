import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  // Keep the checked-in static paper assets when a local build is run.
  // GitHub Pages receives the complete dist directory after this build.
  build: { emptyOutDir: false },
  base: Boolean((globalThis as { process?: { env?: { GITHUB_ACTIONS?: string } } }).process?.env?.GITHUB_ACTIONS) ? '/CCS-CoTFE/' : '/',
})
