import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Product images live in ../pics, outside the client folder.
    fs: { allow: ['..'] },
    proxy: { '/api': 'http://localhost:5000' },
  },
});
