# lantern 模块说明

本仓是 Raychi 的公开阅读端。路由、布局和阅读样式在 `src/app/`；旧文章的 HTTP 类型在 `src/features/articles/`；文章、帖子与站点配置的 HTTP 访问和展示组件在 `src/features/contents/`；搜索在 `src/features/search/`。页面组件通过功能层读取 wellspring 的公开 API，不访问管理 API、数据库或相邻仓库文件。当前路径包括 `/`、`/writing`、`/posts`、`/archive`、`/more`、`/search`、两类详情及 404；旧 `/thoughts` 路径转向帖子。

服务端用 `RAYCHI_API_URL` 请求内容服务且设置 `no-store`。浏览器图片地址保持同源 `/api/v1/public/assets/{id}/content`，由 Next 转发到 wellspring；是否可读由内容服务按当前发布快照判定。正文使用 `react-markdown` 与 GFM 显示，不执行原始 HTML。接口字段、错误和私密图片语义以 [wellspring v0.2 契约](https://github.com/raychi-space/wellspring/blob/main/docs/api/contract-v0.2.md) 为准；管理写作在 [inkwell](https://github.com/raychi-space/inkwell)。

改动公开页面时，检查深链接、未发布/撤回返回、危险链接与图片代理是否仍符合契约；运行 `npm run typecheck && npm run build`，涉及用户路径还要用当前 wellspring 做浏览器/HTTP 验证并在 PR 记录实际结果。跨仓任务按[项目流程](https://github.com/raychi-space/raychi/blob/main/docs/workflow.md)关联 Issue/PR，模块构建通过不代表整功能验收通过。

访问统计接入见 [wellspring 统计契约](https://github.com/raychi-space/wellspring/blob/main/docs/api/analytics-v1.md)。采集服务和聚合状态归独立 waymarks；应用不访问其 SQLite，浏览器不接收服务 token。

`features/comments` 独立管理 giscus 配置和浏览器组件，由 app 路由通过内容详情的服务端 footer 插槽组合；不导入 contents 功能，也不修改站点 API 或评论存储。详见 [评论说明](comments.md)。
