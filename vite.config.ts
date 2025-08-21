import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AdaptiveCard',
      fileName: 'adaptive-card',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    cors: true
  },
  preview: {
    port: 3001,
    open: true
  },
  optimizeDeps: {
    include: []
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
});