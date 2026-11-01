require('dotenv').config()
const express = require('express')
const cors = require('cors')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const morgan = require('morgan')

const app = express()
const PORT = process.env.PORT || 3001

// 安全头
app.use(helmet({
  contentSecurityPolicy: false, // 前端是 SPA，CSP 由 Vite 构建处理
  crossOriginEmbedderPolicy: false
}))

// 请求日志
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// gzip 压缩
app.use(compression({
  threshold: 1024, // 超过 1KB 才压缩
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false
    return compression.filter(req, res)
  }
}))

// CORS：开发环境允许 localhost，生产环境限制为配置的域名
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
  : ['http://localhost:3000', 'http://localhost:3001']
app.use(cors({
  origin: (origin, cb) => {
    // 允许无 origin 的请求（如 curl、同源）
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
    cb(new Error('CORS not allowed'))
  }
}))
app.use(express.json({ limit: '100kb' }))

// 全局速率限制：每 IP 每分钟最多 60 次请求
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: '请求过于频繁，请稍后再试' }
})
app.use(globalLimiter)

// AI 接口更严格的限制：每 IP 每分钟最多 10 次
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'AI 推算请求过于频繁，请稍后再试' }
})
app.use('/api/all', aiLimiter)
app.use('/api/bazi', aiLimiter)
app.use('/api/zhouyi', aiLimiter)
app.use('/api/tarot', aiLimiter)
app.use('/api/xingzuo', aiLimiter)
app.use('/api/lingqian', aiLimiter)
app.use('/api/cezi', aiLimiter)
app.use('/api/chengu', aiLimiter)
app.use('/api/astrology', aiLimiter)
app.use('/api/numerology', aiLimiter)
app.use('/api/runes', aiLimiter)
app.use('/api/flower', aiLimiter)
app.use('/api/xingming', aiLimiter)
app.use('/api/dream', aiLimiter)
app.use('/api/daily', aiLimiter)
app.use('/api/comprehensive', aiLimiter)
app.use('/api/ziwei', aiLimiter)
app.use('/api/palmistry', aiLimiter)
app.use('/api/faceReading', aiLimiter)
app.use('/api/meihua', aiLimiter)

// 请求超时 90 秒
app.use((req, res, next) => {
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      res.status(408).json({ error: '请求超时' })
    }
  }, 90000)

  res.on('finish', () => clearTimeout(timeout))
  res.on('close', () => clearTimeout(timeout))
  next()
})

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  })
})

// 路由
app.use('/api/bazi', require('./src/routes/bazi'))
app.use('/api/zhouyi', require('./src/routes/zhouyi'))
app.use('/api/xingzuo', require('./src/routes/xingzuo'))
app.use('/api/tarot', require('./src/routes/tarot'))
app.use('/api/all', require('./src/routes/all'))
app.use('/api/lingqian', require('./src/routes/lingqian'))
app.use('/api/cezi', require('./src/routes/cezi'))
app.use('/api/chengu', require('./src/routes/chengu'))
app.use('/api/astrology', require('./src/routes/astrology'))
app.use('/api/numerology', require('./src/routes/numerology'))
app.use('/api/runes', require('./src/routes/runes'))
app.use('/api/flower', require('./src/routes/flower'))
app.use('/api/xingming', require('./src/routes/xingming'))
app.use('/api/dream', require('./src/routes/dream'))
app.use('/api/daily', require('./src/routes/daily'))
app.use('/api/comprehensive', require('./src/routes/comprehensive'))
app.use('/api/ziwei', require('./src/routes/ziwei'))
app.use('/api/palmistry', require('./src/routes/palmistry'))
app.use('/api/faceReading', require('./src/routes/faceReading'))
app.use('/api/meihua', require('./src/routes/meihua'))

// 全局错误处理
app.use((err, req, res, next) => {
  console.error('Server error:', err.message)

  // CORS 错误返回 403
  if (err.message === 'CORS not allowed') {
    return res.status(403).json({ error: '跨域请求被拒绝' })
  }

  res.status(500).json({
    error: '服务器内部错误，请稍后重试',
    ...(process.env.NODE_ENV === 'development' && { detail: err.message })
  })
})

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// 优雅关闭
function shutdown(signal) {
  console.log(`\n收到 ${signal}，正在关闭服务...`)
  server.close(() => {
    console.log('服务已关闭')
    process.exit(0)
  })
  // 10 秒后强制退出
  setTimeout(() => {
    console.log('强制退出')
    process.exit(1)
  }, 10000)
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
