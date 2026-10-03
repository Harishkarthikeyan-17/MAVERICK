import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        // ── Development proxy ──────────────────────────────────────────────────
        // Forwards /api/* requests to the Express dev server so the Vite dev
        // server on :3000 can reach the API on :5000 without CORS issues.
        // This proxy is ONLY active during `npm run dev` — it has no effect on
        // the production build served by Express directly.
        proxy: {
          '/api': {
            target: 'http://localhost:5000',
            changeOrigin: true,
            // Do not rewrite — keep /api prefix so Express routes match.
          },
        },
      },
      plugins: [react()],
      define: {
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        }
      }
    };
});
