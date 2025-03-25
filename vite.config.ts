import { defineConfig } from 'vite';
import viteReact from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    viteReact(),
    viteTsconfigPaths(),
    svgrPlugin(),
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  }
});
