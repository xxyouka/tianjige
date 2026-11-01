# 天机阁 · AI 命理

AI 驱动的命理推算平台，覆盖 20 种中西命理模块：八字、周易、梅花易数、紫微斗数、塔罗、星盘、姓名测算、手相、面相、解梦、每日运势等。

> 一个个人实验项目。所有推算内容仅供娱乐与讨论，不构成任何决策依据。

## 技术栈

- **前端**：Vue 3 + Vite + TailwindCSS + Vue Router + PWA
- **后端**：Node.js + Express + `@anthropic-ai/sdk`
- **AI**：MIMO API（服务端调用，密钥只放在环境变量里，不提交）
- **安全**：helmet、CORS 白名单、速率限制、DOMPurify

## 目录

```text
ai-fortune/           Vue 前端
  src/                页面、组件、composables
  server/             Express 后端
    src/routes/       20 个 API 路由
    src/services/     AI、八字等服务
    src/prompts/      AI 提示词
    .env.example      环境变量模板
  public/             PWA 清单与图标
```

## 本地运行

```bash
cd ai-fortune
npm install

cd server
npm install
cp .env.example .env   # 填入 MIMO_API_KEY
npm run dev            # 后端，默认 3001
```

另开一个终端：

```bash
cd ai-fortune
npm run dev            # 前端，默认 3000
```

打开 http://localhost:3000 。生产构建用 `npm run build`。

## 环境变量

| 变量 | 说明 |
| --- | --- |
| `MIMO_API_KEY` | MIMO API 密钥，只放在 `server/.env` |
| `PORT` | 后端端口，默认 3001 |
| `CORS_ORIGIN` | 允许的前端域名，逗号分隔 |

`.env` 已在 `.gitignore` 中，不要提交真实密钥。

## 更多文档

完整的功能清单、API 路由和设计说明见 [ai-fortune/README.md](ai-fortune/README.md)。

## License

MIT © 2026 xx