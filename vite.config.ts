import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Ensure static assets resolve correctly when the site is hosted from the /Void/ sub-path on GitHub Pages.
  base: mode === 'production' ? '/Void/' : '/',
}));
