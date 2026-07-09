import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // 允许通过局域网IP访问，监听所有网络接口
    port: 5173, // 默认端口，可以修改
    strictPort: false, // 如果端口被占用，自动尝试下一个可用端口
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 将大型功能组件分组
          'fortune-telling': [
            './src/components/BaziFortune',
            './src/components/ZiweiDoushu',
            './src/components/QimenDunjia',
            './src/components/NameTest',
          ],
          'divination': [
            './src/components/DivinationDraw',
            './src/components/DreamInterpretation',
            './src/components/AuspiciousDate',
          ],
          'tools': [
            './src/components/NameGenerator',
            './src/components/app/HoroscopeMainView',
            './src/components/Almanac',
            './src/components/NumberEnergy',
            './src/components/LuckyColor',
          ],
          'other': [
            './src/components/CyberMerit',
            './src/components/FengshuiCompass',
            './src/components/ShengxiaoPairing',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 600, // 提高警告阈值到 600KB
  },
})
