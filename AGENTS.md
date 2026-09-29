<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Raychi · 公开站入口

开始任务先读本仓 [README](README.md)、当前 Issue/PR、[Raychi 仓库地图](https://github.com/raychi-space/raychi#仓库地图)、[开发流程](https://github.com/raychi-space/raychi/blob/main/docs/workflow.md)、[接口与联调](https://github.com/raychi-space/raychi/blob/main/docs/integration.md)及[验收规则](https://github.com/raychi-space/raychi/blob/main/docs/acceptance.md)；具体职责见[模块说明](docs/module.md)。无法访问项目仓库时先从这些链接和当前 Issue 确认范围，不能自行重定义跨仓规则。

本仓只做公开阅读，消费 wellspring 的公开 API；不读取工作稿、数据库或相邻仓库源码。接口以 [wellspring 契约目录](https://github.com/raychi-space/wellspring/tree/main/docs/api)及 Issue 指定的 PR/提交为准。变更请求或字段时先协调 wellspring 的 OpenAPI/语义文档，并在 PR 写明兼容性和对其他仓库的影响。

改动后按 README 执行 npm run typecheck 和 npm run build；涉及用户路径时用对应后端做浏览器/HTTP 验证。PR 关联 Issue，记录命令、版本、实际结果与未覆盖项。本仓检查通过不代表主 Issue 验收通过；联调组合和最终结果由主 Issue 记录。GitHub 操作优先 gh CLI，不可用时用网页。
