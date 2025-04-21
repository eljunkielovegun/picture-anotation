import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // or whatever plugin you use

// Use conditional base path - empty for dev, repo name for production
export default defineConfig(({ command }) => {
  const base = command === 'serve' ? '/' : '/picture-anotation/';
  
  return {
    base,
    plugins: [react()]
  }
})