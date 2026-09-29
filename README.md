# lantern

**Part of Raychi · 公开站**。访客在这里进入个人空间，浏览已发布长文、帖子和思考。Next.js 16 + TypeScript；内容由 [wellspring](https://github.com/raychi-space/wellspring) 的公开 API 提供，管理界面在 [inkwell](https://github.com/raychi-space/inkwell)。

当前实现首页 `/`、长文 `/writing`、帖子 `/posts`、思考 `/thoughts`、回顾 `/archive`、更多 `/more`、详情页和 404。只读取发布快照；服务端请求使用 `no-store`，文章图片通过同源 `/api` 转发给内容服务鉴权。原始 HTML 不作为 Markdown 渲染输入。

## 本机运行

需要 Node.js 20.9+，以及已运行的 wellspring。

```bash
cp .env.example .env.local
npm ci
npm run dev
```

默认访问 <http://127.0.0.1:3000>。`RAYCHI_API_URL` 是服务端访问 wellspring 的地址，默认 `http://127.0.0.1:8080`。生产构建执行 `npm run build`，类型检查执行 `npm run typecheck`。

本仓库独立构建，不读取相邻仓库的文件。产品依据、跨仓流程和 [Raychi Project](https://github.com/orgs/raychi-space/projects/1) 的进度入口见 [raychi 项目文档](https://github.com/raychi-space/raychi)。

本仓模块边界见[模块说明](docs/module.md)，v0.2 范围由[任务文档 PR #3](https://github.com/raychi-space/lantern/pull/3)维护，Agent 长期约定见 [AGENTS.md](AGENTS.md)。跨仓任务按[项目流程](https://github.com/raychi-space/raychi/blob/main/docs/workflow.md)处理；实时状态看[Raychi Project](https://github.com/orgs/raychi-space/projects/1)及对应 Issue/PR；Project 当前为私有。
