import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { createHash } from 'crypto'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

// 构建时将 sw.js 中的 __BUILD_HASH__ 替换为实际哈希
function swHashPlugin() {
  return {
    name: 'sw-hash',
    writeBundle(options) {
      const swPath = resolve(options.dir, 'sw.js')
      try {
        const content = readFileSync(swPath, 'utf-8')
        // 基于产物文件内容计算哈希，确保内容不变时哈希不变
        const assetsDir = resolve(options.dir, 'assets')
        const { readdirSync } = require('fs')
        let combined = ''
        try {
          const files = readdirSync(assetsDir).filter(f => f.endsWith('.js') || f.endsWith('.css'))
          for (const file of files) {
            combined += readFileSync(resolve(assetsDir, file), 'utf-8')
          }
        } catch {
          // assets 目录不存在时回退
          combined = content
        }
        const hash = createHash('md5').update(combined).digest('hex').slice(0, 8)
        const replaced = content.replace(/__BUILD_HASH__/g, `'${hash}'`)
        writeFileSync(swPath, replaced)
      } catch {
        // sw.js 不存在时跳过
      }
    }
  }
}

export default defineConfig({
  plugins: [vue(), tailwindcss(), swHashPlugin()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  build: {
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    sourcemap: false
  },
  optimizeDeps: {
    include: ['vue', 'vue-router']
  }
})
