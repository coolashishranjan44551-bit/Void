import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Use a relative base so the build works when served from a sub-path (e.g., GitHub Pages)
  base: './',
});
