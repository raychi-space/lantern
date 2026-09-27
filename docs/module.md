# lantern 模块说明

本仓是 Raychi 的公开阅读端。Next.js 路由、布局和阅读样式在 `src/app/`；当前 `main` 的文章 API 请求与传输类型在 `src/lib/api.ts`。页面只调用 wellspring 的 `/api/v1/public/articles` 与详情，不访问管理 API、数据库或相邻仓库文件。当前可从代码核对的路径是 `/`、`/writing`、`/writing/[slug]`、404；其他规划导航不视为已实现。

服务端通过 `RAYCHI_API_URL` 请求内容服务且设置 `no-store`。浏览器图片地址保持同源 `/api/v1/public/assets/{id}/content`，由 Next 转发到 wellspring；是否可读由内容服务按当前发布快照判定。正文使用 `react-markdown` 与 GFM 显示，不执行原始 HTML。接口字段、错误和私密图片语义以 [wellspring 契约](https://github.com/raychi-space/wellspring/blob/main/docs/api/contract-v0.1.md) 为准；管理写作在 [inkwell](https://github.com/raychi-space/inkwell)。

改动公开页面时，检查深链接、未发布/撤回返回、危险链接与图片代理是否仍符合契约；运行 `npm run typecheck && npm run build`，涉及用户路径还要用当前 wellspring 做浏览器/HTTP 验证并在 PR 记录实际结果。若 API 层目录调整，在该 PR 同步更新此说明。跨仓任务按[项目流程](https://github.com/raychi-space/raychi/blob/main/docs/workflow.md)关联 Issue/PR，模块构建通过不代表整功能验收通过。
