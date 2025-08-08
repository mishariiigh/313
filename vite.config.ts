import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname and __filename for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  // Frontend root directory
  root: path.resolve(__dirname, 'client'),

  // Use relative paths in build output
  base: './',

  build: {
    // Show warnings for chunks > 1MB
    chunkSizeWarningLimit: 1000,

    // Build output folder for Netlify deployment
    outDir: path.resolve(__dirname, 'netlify_build_output'),

    // Keep previous files instead of clearing the folder
    emptyOutDir: false,

    // Ensure files are written to disk
    write: true,

    // Generate manifest.json for server-side reference
    manifest: true,

    rollupOptions: {
      output: {
        // Separate vendor chunks for better caching
        manualChunks: {
          firebase: [
            'firebase/app',
            'firebase/firestore',
            'firebase/auth',
            'firebase/storage',
          ],
          react: ['react', 'react-dom'],
        },
      },
    },
  },

  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
      '@shared': path.resolve(__dirname, 'shared'),
      '@assets': path.resolve(__dirname, 'attached_assets'),
      '@server': path.resolve(__dirname, 'server'),
    },
  },

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
