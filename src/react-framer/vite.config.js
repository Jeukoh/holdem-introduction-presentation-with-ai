import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],

  // 브라우저용 환경변수 치환
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },

  // 라이브러리 빌드 설정
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib.jsx'),
      name: 'HoldemEngine',
      fileName: (format) => `holdem-engine.${format}.js`,
      formats: ['es', 'umd', 'iife'],
    },
    rollupOptions: {
      // React는 external로 (호스트에서 제공)
      external: ['react', 'react-dom', 'react-dom/client'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-dom/client': 'ReactDOM',
        },
        // CSS를 별도 파일로
        assetFileNames: 'holdem-engine.[ext]',
      },
    },
    // 빌드 출력 경로
    outDir: 'dist',
  },

  base: '/holdem-introduction-presentation-with-ai/',
})
