import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'firebase-core': ['firebase/app', 'firebase/auth'],
          'firebase-firestore': ['firebase/firestore'],
          'firebase-storage': ['firebase/storage']
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
});
