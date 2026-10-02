# lantern

**Part of Raychi · 公开站**。访客在这里进入个人空间，浏览已发布文章和帖子。Next.js 16 + TypeScript；内容由 [wellspring](https://github.com/raychi-space/wellspring) 的公开 API 提供，管理界面在 [inkwell](https://github.com/raychi-space/inkwell)。

当前实现首页 `/`、文章 `/writing`、帖子 `/posts`、回顾 `/archive`、更多 `/more`、详情页和 404；旧 `/thoughts` 路径转向帖子。只读取发布快照；服务端请求使用 `no-store`，文章图片通过同源 `/api` 转发给内容服务鉴权。原始 HTML 不作为 Markdown 渲染输入。

首页精选与文章列表首条采用直角图文长条，桌面图片/内容比例为 3:7；后续文章为无图单列条目，只保留左侧细线。标题、类别、日期、摘要来自公开内容接口，整条可进入详情。手机上首条图文改为上下排列；未配置封面时使用装饰图形。帖子时间线只显示日期点与正文，不使用包围内容的圆角卡片；点击标题或正文进入详情，不再另外显示“独立链接”。正文内的链接和标签保留各自的目标。

## 本机运行

需要 Node.js 20.9+，以及已运行的 wellspring。

```bash
cp .env.example .env.local
npm ci
npm run dev
```

默认访问 <http://127.0.0.1:3000>。`RAYCHI_API_URL` 是服务端访问 wellspring 的地址，默认 `http://127.0.0.1:8080`。生产构建执行 `npm run build`，类型检查执行 `npm run typecheck`。

本仓库独立构建，不读取相邻仓库的文件。产品依据、跨仓流程和 [Raychi Project](https://github.com/orgs/raychi-space/projects/1) 的进度入口见 [raychi 项目文档](https://github.com/raychi-space/raychi)。

模块内部职责见[模块说明](docs/module.md)，v0.2 范围见[任务文档 PR #3](https://github.com/raychi-space/lantern/pull/3)；Agent 长期约定见 [AGENTS.md](AGENTS.md)。跨仓任务按[项目流程](https://github.com/raychi-space/raychi/blob/main/docs/workflow.md)处理；实时状态看[Raychi Project](https://github.com/orgs/raychi-space/projects/1)及对应 Issue/PR。

## 目录约束

- `src/app/` 遵循 Next.js App Router 文件约定，放路由、布局、404 和全局样式。
- `src/features/articles/` 保留旧文章 API 类型；`src/features/contents/` 放 v0.2 内容与配置 API、独立 types.ts、components/ 展示组件及 index.ts 公开入口；首页和回顾的组合逻辑也在该功能目录中。其他业务功能以 `src/features/<feature>/` 扩展。
- 导航和主题切换在 `src/shared/ui/`，导航数据类型在 `src/shared/types/`。页面从功能目录读取数据，不在页面中复制 `/api/v1` 请求逻辑；仅服务端访问 `RAYCHI_API_URL`。
- `docs/` 放产品或技术说明；构建配置、环境示例和 CI 留在仓库根目录。

## 搜索

`/search` 使用 wellspring 的 `GET /api/v1/public/search`，支持关键词、article/post 筛选与 nextOffset 分页。配置服务端 `RAYCHI_API_URL`；禁止配置搜索内核 token 或让浏览器直连内核。页面按纯文本渲染结果，保留关键词和筛选，提供空状态、加载与独立搜索故障提示。

接口契约：[wellspring 搜索 v1](https://github.com/raychi-space/wellspring/blob/main/docs/api/search-v1.md)。跨仓复现脚本及验收位于 raychi `scripts/search-e2e.ts` 与 `docs/search`。

## 代码与故障回归（2026-10-03）

`npm run lint` 检查功能和 shared 依赖边界；`npm run format:check` 检查统一排版，`npm run format` 修复排版。CI 执行上述检查。网站级 HTTP 回归脚本位于 raychi 的 `scripts/site-e2e.py`，只允许显式确认的隔离环境；运行方式见项目的完整网站验收文档。

回顾页每栏最多 50 条，文章/帖子分页和排序各自独立；后端先排序再分页，不再读取全部归档。公开内容请求有 5 秒超时；页面和根布局故障提供重新加载入口。生产验证可设置 `RAYCHI_BUILD_DIR=.next-audit` 使用独立构建目录，构建与启动必须使用相同目录和 API 地址。
