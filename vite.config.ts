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
})
