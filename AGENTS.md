<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Raychi 仓库约定

先读本仓 [README](README.md) 与[模块说明](docs/module.md)；产品依据、唯一进度和跨仓流程在 [raychi 项目仓库](https://github.com/raychi-space/raychi)。本仓只负责公开阅读，通过 wellspring 公开 API 获取发布快照；不读取草稿、数据库或相邻仓库源码。接口变更先核对 [wellspring 契约](https://github.com/raychi-space/wellspring/blob/main/docs/api/contract-v0.1.md)。改动后运行 `npm run typecheck && npm run build`，涉及用户路径时记录与真实服务的验证结果；在 PR 中关联 Issue 和契约变更。

GitHub 上查看、创建和更新 Issue/PR，以及查询审查和检查状态，默认使用 `gh` CLI；仅在 CLI 不可用或无法完成所需操作时使用网页，详见[项目流程](https://github.com/raychi-space/raychi/blob/main/docs/workflow.md#github-%E6%93%8D%E4%BD%9C)。
