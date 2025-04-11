import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiProxyUrl = env.VITE_SERVER_API;

  return {
    plugins: [react()],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use '/src/styles/_variables.scss' as variables;`
        }
      }
    },
    server: {
      proxy: {
        '/api': {
          target: apiProxyUrl,
          changeOrigin: true,
          secure: false, // Set to true if using HTTPS
          rewrite: (path) => path.replace(/^\/api/, '/api'),
        },
      },
    },
  };
});