import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: './src/index.js',
      name: 'VueFormique',  // Updated to match the exported library name
      fileName: (format) => `vue-formique.${format}.js`,  // Dynamically generates file names for different formats
    },
    rollupOptions: {
      external: ['vue', 'formique'],  // Ensure that Formique is also external
      output: {
        globals: {
          vue: 'Vue',
          formique: 'Formique',  // Define global for formique too
        },
      },
    },
  },
});
