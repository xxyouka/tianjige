# 天机阁 · AI 命理

AI 驱动的命理推算平台，融合东方传统与西方神秘学，覆盖 20 种命理功能。

## 功能模块

### 中国命理
| 模块 | 说明 |
|------|------|
| 八字排盘 | 四柱八字、十神分析、大运流年 |
| 周易占卜 | 六十四卦、爻辞解读 |
| 梅花易数 | 时间起卦、卦象分析 |
| 称骨算命 | 袁天罡称骨、骨重命运 |
| 测字 | 汉字拆解、笔画分析 |
| 灵签 | 求签问卦、签诗解读 |
| 姓名测算 | 五格三才、姓名吉凶 |
| 紫微斗数 | 星曜排盘、十二宫分析 |
| 手相分析 | 掌纹解读、三大主线 |
| 面相分析 | 五官面型、运势吉凶 |

### 西方体系
| 模块 | 说明 |
|------|------|
| 星座运势 | 十二星座、每日/年度运势 |
| 塔罗牌 | 78 张牌、多种牌阵 |
| 星盘 | 行星相位、宫位分析 |
| 数字命理 | 生命数字、命运密码 |
| 卢恩符文 | 24 符文、占卜解读 |
| 生日花语 | 365 天、花语寓意 |

### 综合功能
| 模块 | 说明 |
|------|------|
| 综合运势 | 全方位命理分析、AI 深度解读 |
| 梦境解析 | 周公解梦、梦境符号库 |
| 每日运势 | 黄历宜忌、吉时查询 |
| 一键推算 | 20 种命理并行分析 |

## 技术栈

### 前端
- **框架**：Vue 3 + Composition API（`<script setup>`）
- **构建**：Vite 8
- **样式**：TailwindCSS 4（CSS 变量主题系统）
- **路由**：Vue Router 4（代码分割 + 预加载）
- **Markdown**：marked + DOMPurify（XSS 安全渲染）
- **PWA**：Service Worker（网络优先策略、自动缓存更新）

### 后端
- **运行时**：Node.js + Express
- **AI**：Mimo API（小米大模型，`@anthropic-ai/sdk` 客户端）
- **安全**：helmet 安全头、CORS 白名单、express-rate-limit（全局 60/min，AI 10/min）
- **性能**：gzip 压缩、请求超时 90s
- **日志**：morgan 请求日志
- **运维**：优雅关闭（SIGTERM/SIGINT）

## 快速开始

### 1. 安装依赖

```bash
# 前端
npm install

# 后端
cd server
npm install
```

### 2. 配置环境变量

复制 `server/.env.example` 为 `server/.env`，填入你的 API Key：

```env
MIMO_API_KEY=your_api_key_here
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

### 3. 启动项目

```bash
# 启动后端（在 server 目录）
npm run dev

# 启动前端（在项目根目录）
npm run dev
```

访问 http://localhost:3000

### 4. 构建部署

```bash
# 构建前端
npm run build

# 预览构建产物
npm run preview
```

## 项目结构

```
ai-fortune/
├── src/
│   ├── views/              # 20 个功能页面
│   ├── components/
│   │   ├── ui/             # 通用 UI 组件
│   │   └── fortune/        # 命理专用组件
│   ├── composables/        # 组合式函数
│   │   ├── useApiRequest   # 请求管理（loading/error/timeout/abort）
│   │   ├── useBirthDate    # 出生日期选择器
│   │   ├── useHistory      # 历史记录（localStorage）
│   │   ├── useFavorites    # 收藏功能
│   │   ├── useTheme        # 主题切换
│   │   ├── useSound        # 音效控制
│   │   ├── useFocusTrap    # 模态框焦点陷阱
│   │   └── useCustomTheme  # 自定义主题
│   ├── constants/          # 命理常量数据
│   ├── services/
│   │   └── api.js          # API 客户端（统一错误处理）
│   └── style.css           # 全局样式（CSS 变量主题）
├── server/
│   ├── src/
│   │   ├── routes/         # 20 个 API 路由
│   │   ├── services/
│   │   │   ├── ai.js       # AI 客户端（重试 + 指数退避）
│   │   │   └── bazi.js     # 八字计算逻辑
│   │   └── prompts/        # AI 系统提示词
│   ├── index.js            # 服务入口
│   ├── .env                # 环境变量（不提交）
│   └── .env.example        # 环境变量模板
├── public/
│   ├── sw.js               # Service Worker
│   ├── manifest.json       # PWA 清单
│   └── icons/              # SVG 图标
├── vite.config.js          # Vite 配置（含 SW 哈希插件）
└── index.html              # 入口 HTML（SEO + 结构化数据）
```

## Composables

| Composable | 职责 |
|-----------|------|
| `useApiRequest` | 统一管理 API 请求的 loading、error、超时、abort，组件卸载自动取消 |
| `useBirthDate` | 出生年/月/日/时辰选择器，年份范围 1940-2024 |
| `useHistory` | 历史记录增删改查，localStorage 持久化 |
| `useFavorites` | 功能收藏管理 |
| `useTheme` | 深色/浅色主题切换 |
| `useSound` | 音效开关控制 |
| `useFocusTrap` | 模态框焦点锁定，支持 Tab 循环 |
| `useCustomTheme` | 自定义主题颜色 |

## 安全措施

- **XSS 防护**：Markdown 渲染使用 DOMPurify 白名单过滤
- **链接安全**：`target="_blank"` 自动添加 `rel="noopener noreferrer"`
- **CORS**：白名单限制，仅允许配置的域名
- **速率限制**：全局 60 次/min，AI 接口 10 次/min
- **安全头**：helmet 中间件（HSTS、X-Content-Type-Options 等）
- **请求校验**：JSON body 限制 100KB，History 导入数据结构校验
- **环境变量**：`.env` 在 `.gitignore` 中，不提交到版本控制

## 无障碍

- 语义化 HTML 标签（`role="navigation"`, `role="main"`, `role="link"`）
- 模态框焦点陷阱（Tab 键循环锁定）
- `:focus-visible` 焦点样式（键盘导航可见，鼠标点击隐藏）
- 按钮 `aria-label`（图标按钮、删除按钮）
- 性别切换 `role="radio"` + `aria-pressed` 状态指示
- `prefers-reduced-motion` 减少动画支持

## PWA

- Service Worker 网络优先策略
- 构建时自动注入缓存版本哈希，更新时自动清理旧缓存
- 离线回退到缓存页面
- 更新时 toast 通知用户
- SVG 图标（192px / 512px）

## 许可

MIT
