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
          'fortune-telling': [
            './src/components/app/BaziMainView',
            './src/components/app/ZiweiMainView',
            './src/components/app/QimenMainView',
            './src/components/app/NameTestMainView',
          ],
          'divination': [
            './src/components/app/DivinationMainView',
            './src/components/app/DreamMainView',
            './src/components/app/AuspiciousMainView',
          ],
          'tools': [
            './src/components/app/HoroscopeMainView',
            './src/components/app/AlmanacMainView',
            './src/components/app/NumberEnergyMainView',
            './src/components/app/LuckyColorMainView',
          ],
          'other': [
            './src/components/app/CyberMeritMainView',
            './src/components/app/FengshuiMainView',
            './src/components/app/ShengxiaoMainView',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 600, // 提高警告阈值到 600KB
  },
})
