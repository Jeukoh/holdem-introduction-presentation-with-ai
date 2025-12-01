import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // base를 설정하면 import.meta.env.BASE_URL에 반영됨
  // GitHub Pages 등 sub-path 호스팅 시 여기서 설정
  // base: '/holdem-introduction-presentation-with-ai/',
})
