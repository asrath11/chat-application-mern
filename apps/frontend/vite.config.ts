import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import checker from 'vite-plugin-checker';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss(), checker({ typescript: true })],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 5173,
    allowedHosts: true,
  },

  preview: {
    host: '0.0.0.0',
    port: Number(process.env.PORT),
    allowedHosts: true,
  },
});
