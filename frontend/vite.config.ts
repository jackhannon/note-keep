import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
const env = loadEnv(mode, process.cwd(), '');

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    plugins: [react()],
    test: {
      environment: "jsdom",
      setupFiles: "./tests/setup.ts"
    },
    define: {
      'process.env.API_URL': JSON.stringify(env.API_URL || 'http://localhost:3000'),
    },
  };
})
