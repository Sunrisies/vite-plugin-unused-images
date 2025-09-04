import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import unusedImagesPlugin from 'vite-plugin-unused-images'; // 插件路径

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),
  unusedImagesPlugin({
    // imageDirs: ['src/assets', 'public'],
    // sourceDirs: ['src', 'components'],
    // extensions: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'],
    // exclude: ['**/node_modules/**', '**/dist/**', '**/test-assets/**'],
    // outputFile: 'unused-images-report.json',
    failOnUnused: false,// 设为 true 可以在发现未使用图片时使构建失败
    deleteUnused: true,   // 构建时真正删除
  })
  ],
})
