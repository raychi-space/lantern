# lantern

**Part of Raychi · 公开站**。访客在这里进入个人空间，浏览已发布文章。Next.js 16 + TypeScript；内容由 [wellspring](https://github.com/raychi-space/wellspring) 的公开 API 提供，管理界面在 [inkwell](https://github.com/raychi-space/inkwell)。

当前实现首页 `/`、文章列表 `/writing`、文章详情 `/writing/[slug]` 和 404。只读取发布快照；服务端请求使用 `no-store`，文章图片通过同源 `/api` 转发给内容服务鉴权。原始 HTML 不作为 Markdown 渲染输入。

## 本机运行

需要 Node.js 20.9+，以及已运行的 wellspring。

```bash
cp .env.example .env.local
npm ci
npm run dev
```

默认访问 <http://127.0.0.1:3000>。`RAYCHI_API_URL` 是服务端访问 wellspring 的地址，默认 `http://127.0.0.1:8080`。生产构建执行 `npm run build`，类型检查执行 `npm run typecheck`。

本仓库独立构建，不读取相邻仓库的文件。产品规划和完整本地联调步骤保存在 RayDev 工作区的项目总纲中。
