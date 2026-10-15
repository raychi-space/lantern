<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## RayChi · 公开站

先读本仓 [README](README.md)，按任务读[模块说明](docs/module.md)、[SEO/RSS](docs/seo-rss.md)、[评论](docs/comments.md)或[插画设计](docs/paper-storybook.md)，再检查相关 Issue/PR 与契约。

新需求先检查相关需求、设计/ADR 与现有代码和公共能力，提出范围、复用方案、接口影响和验收方式，获得用户明确实施确认后再修改功能代码、配置或数据库。重大偏离重新确认；确认范围内持续执行，不重复审批常规细节。部署/线上启用另需授权。

跨仓规则见[开发流程](https://github.com/raychi-space/raychi/blob/main/docs/workflow.md#文档驱动开发)、[架构](https://github.com/raychi-space/raychi/blob/main/ARCHITECTURE.md)、[文档地图](https://github.com/raychi-space/raychi/blob/main/docs/README.md)和[验收](https://github.com/raychi-space/raychi/blob/main/docs/acceptance.md)。这些项目资料为私有；无权限时从本仓和授权提供的相关资料明确范围，由负责人补必要约束，不能把 404 当作不存在或自行重定义跨仓规则。

本仓只消费 wellspring 公开 API，不读取工作稿、数据库或相邻仓源码；Markdown 安全渲染与托管图片授权不能退化。可选访问采集也只经本站同源 Cookie/CSRF API，不将内核 token 发给浏览器。字段归 [wellspring API](https://github.com/raychi-space/wellspring/tree/main/docs/api)，变更先评审提供方 OpenAPI/语义定义及消费方兼容性，不在本仓另建字段权威。

验证入口在 README/CI：lint、format:check、typecheck、npm test、build；受影响用户路径另用对应后端做 HTTP/浏览器验证，区分真实与模拟。纯文档修改只查内容、链接与差异。PR 记录版本、命令、实际结果和未覆盖项，同步本仓说明；单仓通过不代表主功能完成。历史验证保持固定日期/版本。GitHub 操作优先 gh CLI；不要提交密钥或私有运维资料。
