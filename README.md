# lantern

**Part of Raychi · 公开站**。访客在这里进入个人空间，浏览已发布的长文、帖子、思考与回顾。Next.js 16 + TypeScript；内容由 [wellspring](https://github.com/raychi-space/wellspring) 的公开 API 提供，管理界面在 [inkwell](https://github.com/raychi-space/inkwell)。

当前实现混合首页 `/`、长文 `/writing`、帖子 `/posts`、思考 `/thoughts`、回顾 `/archive`、更多 `/more` 及各类型详情和 404。只读取发布快照；服务端请求使用 `no-store`，文章图片通过同源 `/api` 转发给内容服务鉴权。原始 HTML 不作为 Markdown 渲染输入。

## 本机运行

需要 Node.js 20.9+，以及已运行的 wellspring。

```bash
cp .env.example .env.local
npm ci
npm run dev
```

默认访问 <http://127.0.0.1:3000>。`RAYCHI_API_URL` 是服务端访问 wellspring 的地址，默认 `http://127.0.0.1:8080`。它也用于构建时生成图片 `/api` 代理目标，因此生产构建和启动要使用同一个值。生产构建执行 `npm run build`，类型检查执行 `npm run typecheck`。

本仓库独立构建，不读取相邻仓库的文件。产品依据、跨仓流程和唯一项目进度见 [raychi 项目文档](https://github.com/raychi-space/raychi)。

模块内部职责见[模块说明](docs/module.md)，新一轮公开站目标见[产品任务说明](docs/product-scope-v0.2.md)；Agent 长期约定见 [AGENTS.md](AGENTS.md)。跨仓任务按[项目流程](https://github.com/raychi-space/raychi/blob/main/docs/workflow.md)处理，当前状态看[唯一进度表](https://github.com/raychi-space/raychi/blob/main/docs/progress.md)。

## 目录约束

- `src/app/` 遵循 Next.js App Router 文件约定，放路由、布局、404 和全局样式。
- `src/features/articles/` 保留旧文章 API 类型；`src/features/contents/` 放 v0.2 内容、配置 API 与展示组件；其他业务功能以 `src/features/<feature>/` 扩展。
- 页面从功能目录读取数据，不在页面中复制 `/api/v1` 请求逻辑；仅服务端访问 `RAYCHI_API_URL`。
- `docs/` 放产品或技术说明；构建配置、环境示例和 CI 留在仓库根目录。
