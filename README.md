# lantern

**Part of Raychi · 公开站**。访客在这里进入个人空间，浏览已发布文章和帖子。Next.js 16.3.8 + TypeScript；内容由 [wellspring](https://github.com/raychi-space/wellspring) 的公开 API 提供，管理界面在 [inkwell](https://github.com/raychi-space/inkwell)。

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

模块内部职责见[模块说明](docs/module.md)，早期 v0.2 范围见[产品范围文档](docs/product-scope-v0.2.md)；当前路由和展示以本 README 为准，Agent 长期约定见 [AGENTS.md](AGENTS.md)。跨仓任务按[项目流程](https://github.com/raychi-space/raychi/blob/main/docs/workflow.md)处理；实时状态看[Raychi Project](https://github.com/orgs/raychi-space/projects/1)及对应 Issue/PR。

## 目录约束

- `src/app/` 遵循 Next.js App Router 文件约定，放路由、布局、404 和全局样式。
- `src/features/articles/` 保留旧文章 API 类型；`src/features/contents/` 放 v0.2 内容与配置 API、独立 types.ts、components/ 展示组件及 index.ts 公开入口；首页和回顾的组合逻辑也在该功能目录中。其他业务功能以 `src/features/<feature>/` 扩展。
- 导航和主题切换在 `src/shared/ui/`，导航数据类型在 `src/shared/types/`。页面从功能目录读取数据，不在页面中复制 `/api/v1` 请求逻辑；仅服务端访问 `RAYCHI_API_URL`。
- `docs/` 放产品或技术说明；构建配置、环境示例和 CI 留在仓库根目录。

## 搜索

`/search` 使用 wellspring 的 `GET /api/v1/public/search`，支持关键词、article/post 筛选与 nextOffset 分页。配置服务端 `RAYCHI_API_URL`；禁止配置搜索内核 token 或让浏览器直连内核。页面按纯文本渲染结果，保留关键词和筛选，提供空状态、加载与独立搜索故障提示。

接口契约：[wellspring 搜索 v1](https://github.com/raychi-space/wellspring/blob/main/docs/api/search-v1.md)。跨仓复现脚本及验收位于 raychi `scripts/search-e2e.ts` 与 `docs/search`。

## SEO 与 RSS

公开页面有独立标题、描述、canonical、Open Graph/Twitter；`/robots.txt`、动态分页 `/sitemap.xml` 和 `/feed.xml` 已实现。RSS 提供最近50条文章/帖子的摘要和详情链接，包含自动发现和页脚入口；草稿不进入，撤回/删除在下次请求移除。搜索、筛选页面及管理台不收录。

`RAYCHI_SITE_URL` 配置公开 HTTP(S) 域名原点，不含路径，默认 `https://dev.raychi.site`；与 `RAYCHI_BASE_PATH` 组合生成绝对链接，不读取 Host。本次按用户要求配套开放开发域名公开页面收录，管理台、搜索与 API 继续排除。详见[SEO/RSS 说明](docs/seo-rss.md)。

## 代码与故障回归（2026-10-03）

`npm run lint` 检查功能和 shared 依赖边界；`npm run format:check` 检查统一排版，`npm run format` 修复排版。CI 执行上述检查。网站级 HTTP 回归脚本位于 raychi 的 `scripts/site-e2e.py`，只允许显式确认的隔离环境；运行方式见项目的完整网站验收文档。

回顾页每栏最多 50 条，文章/帖子分页和排序各自独立；后端先排序再分页，不再读取全部归档。公开内容请求有 5 秒超时；页面和根布局故障提供重新加载入口。生产验证可设置 `RAYCHI_BUILD_DIR=.next-audit` 使用独立构建目录，构建与启动必须使用相同目录和 API 地址。

## 子路径独立部署

保留既有网站时，可在构建与启动阶段设置 `RAYCHI_BASE_PATH=/raychi`。导航与搜索表单均使用该前缀；接口与上传图片仍由同源 `/api/v1/` 提供，需配置代理。`RAYCHI_STANDALONE=1` 生成 Next standalone 服务目录；复制 `.next/static` 与 public 到该目录后，通过 Node server.js 启动。前缀在构建时固定，修改后须重新构建。未设置时保留根路径部署。

## 访问统计与退出

已成功加载的公开首页、列表、详情、回顾及更多页在浏览器可见后采集路径，不采集搜索、404、预取、查询词或全文。页脚可关闭统计，同时遵守浏览器 DNT/GPC；随机访客标识仅保存在当前标签页，每个 UTC 日更新，存储受限时仅匿名 PV。采集失败不会显示阅读错误。后端配置及保留策略见 [站点统计 v1](https://github.com/raychi-space/wellspring/blob/main/docs/api/analytics-v1.md)，启用线上服务仍需批准发布。

## GitHub 评论

已发布文章/帖子详情可按需加载 giscus 评论，使用 GitHub 账号，无需注册本站。默认关闭，通过运行环境配置公开仓库及分类 ID；按内容 UUID 严格匹配讨论，支持主题切换和加载失败重试。列表、404 和撤回内容没有入口。配置步骤、数据归属与真实 OAuth 验收边界见 [评论说明](docs/comments.md)。

## 文章目录

文章详情根据已发布 Markdown 的二至四级顶层标题生成可折叠目录（至少两项、最多100项）；代码块、引用和原始 HTML 不作为目录章节。正文和目录共用 CommonMark/GFM 标题顺序，中文和重复标题各有独立锚点；点击只改变 URL 片段，不额外采集浏览。目录服务端渲染，无额外客户端监听；只有工作稿保存不会改变公开目录。`npm test`（Node22.18+）验证真实解析树与锚点一致性，生产构建仍按原命令运行。锚点序号随正文标题结构调整，不作为永久章节链接承诺。

## 相关文章

文章详情显示至多3篇有共同发布标签或非默认分类的文章；评分、精确标签匹配和限量由 wellspring 负责，只消费公开元数据。工作稿不改变推荐，帖子不展示；空结果或可选接口失败/1500ms超时隐藏推荐，正文仍可读。契约见 [相关文章v1](https://github.com/raychi-space/wellspring/blob/main/docs/api/related-articles-v1.md)。`scripts/related-articles-e2e.mjs` 在明确隔离环境验证真实后端和生产页面；故障验收使用仅用于测试的 `related-fault-proxy.mjs`，不安装到生产。
