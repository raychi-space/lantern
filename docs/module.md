# lantern 模块说明

所有者：lantern；核对：2026-10-15。本文描述已提交的模块基线，功能开发分支的扩展另行验证。系统边界见[架构](https://github.com/raychi-space/raychi/blob/main/ARCHITECTURE.md)，本仓契约与代码仍需按任务指定提交核对。

本仓是 Raychi 的公开阅读端。路由、布局和阅读样式在 `src/app/`；旧文章的 HTTP 类型在 `src/features/articles/`；文章、帖子与站点配置的 HTTP 访问和展示组件在 `src/features/contents/`；拾阅公开 DTO 与热榜/最新/汇总展示在 `src/features/reading/`；搜索在 `src/features/search/`。页面组件通过功能层读取 wellspring 的公开 API，不访问管理 API、AIHOT、数据库或相邻仓库文件。当前路径包括 `/`、`/writing`、`/posts`、`/archive`、`/reading`、`/more`、`/search`、两类详情及 404；旧 `/thoughts` 路径转向帖子。

服务端用 `RAYCHI_API_URL` 请求内容服务且设置 `no-store`。浏览器图片地址保持同源 `/api/v1/public/assets/{id}/content`，由 Next 转发到 wellspring；是否可读由内容服务按当前发布快照判定。正文使用 `react-markdown` 与 GFM 显示，文章额外支持 math/KaTeX，不执行原始 HTML。接口字段、错误和私密图片语义以 [wellspring v0.2 契约](https://github.com/raychi-space/wellspring/blob/main/docs/api/contract-v0.2.md) 为准；管理写作在 [inkwell](https://github.com/raychi-space/inkwell)。

改动公开页面时，检查深链接、未发布/撤回返回、危险链接与图片代理是否仍符合契约；运行 `npm run typecheck && npm run build`，涉及用户路径还要用当前 wellspring 做浏览器/HTTP 验证并在 PR 记录实际结果。跨仓任务按[项目流程](https://github.com/raychi-space/raychi/blob/main/docs/workflow.md)关联 Issue/PR，模块构建通过不代表整功能验收通过。

访问统计接入见 [wellspring 统计契约](https://github.com/raychi-space/wellspring/blob/main/docs/api/analytics-v2.md)。采集服务和聚合状态归独立 waymarks；应用不访问其 SQLite，浏览器不接收服务 token。

文章目录与相关文章均归 `features/contents`；相关文章只读取公开元数据，接口错误/1500ms超时返回空推荐，正文保留。`shared/api/publicApi` 的默认5000ms读取预算保持不变，可选推荐传入独立预算。排序语义由 wellspring 契约定义，不在前端重复实现。

文章数学语法和安全选项集中在 `features/contents/article-markdown.ts`，`reading-outline.ts` 复用同一 remark 插件列表，避免公式中的标题标记造成锚点错位。`ArticleDetail` 在服务端组合正文与目录；`ReadingOutline` 复用一份链接组件，按CSS断点显示桌面常开侧栏或移动端原生折叠目录，不增加客户端状态或滚动监听。KaTeX样式在根布局导入，版本、预算及验收入口见 README 的数学公式说明。

`features/comments` 独立管理 giscus 配置和浏览器组件，由 app 路由通过内容详情的服务端 footer 插槽组合；不导入 contents 功能，也不修改站点 API 或评论存储。详见 [评论说明](comments.md)。

## 路由与辅助能力入口

SEO/RSS 路由包括 `robots.ts`、`sitemap.xml/route.ts`、`sitemaps/[name]/route.ts` 与 `feed.xml/route.ts`，链接/XML 共用 shared/seo；字段只读发布版。`/illustrations` 是纸感封面预览，noindex、不进入主导航/站点地图，浏览按全公开页规则采集，规则见[插画设计](paper-storybook.md)。访问采集在 `shared/lib/analytics.ts` 与 `shared/ui/PublicPageView.tsx`，由根布局统一注册；不再逐页添加采集组件。导航查询串只触发翻页统计，事件本身仅带路径；匿名标识、隐私退出与 CSRF 请求集中在该库，服务 token 不进入浏览器。`/reading` 只读取 wellspring 的站点 DTO；新接口不可用时显示可恢复状态，后端未启用时保留旧卡片，不直连来源站或 AIHOT。
