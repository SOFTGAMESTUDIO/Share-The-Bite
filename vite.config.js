import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  // Use /Share-The-Bite/ on GitHub Actions cloud deploy, and relative ./ for local builds & preview
  base: isGitHubActions ? '/Share-The-Bite/' : './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
});
