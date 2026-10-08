# SEO 与 RSS

主任务：[raychi #43](https://github.com/raychi-space/raychi/issues/43)，本仓：[lantern #24](https://github.com/raychi-space/lantern/issues/24)。仅消费 wellspring 已有公开 API，无接口或数据库迁移。

## 页面与链接

首页、文章/帖子列表、回顾、更多有独立标题、描述、canonical、Open Graph 与 Twitter 信息。文章/帖子详情只读取发布快照，包含首次发布时间、公开更新时间和已有封面；无标题帖子使用正文首句。列表分页 canonical 保留 page，分类/标签筛选和搜索标记 noindex。不存在、草稿、撤回详情仍返回404，且由 Next notFound 标记 noindex。

`RAYCHI_SITE_URL` 是运行时 HTTP(S) 域名原点，不包含路径、查询或凭证；默认 `https://dev.raychi.site`，本机 `.env.example` 为 `http://127.0.0.1:3000`。公开页面链接加构建固定的 `RAYCHI_BASE_PATH`，不信任请求 Host。图片 API 地址仍在域名根目录。修改正式域名时调整运行时配置即可；修改子路径需要重新构建。

用户明确要求开放 dev 域名收录，本次发布配套移除公开路由的 Nginx 全局 noindex；管理台、搜索和 API 保留排除，已发布公开图片允许抓取。正式域名切换时调整公开URL配置及代理；提供 SEO 信息不等于搜索引擎已收录。

## 站点地图

`/robots.txt` 指向 `/sitemap.xml` 并禁止抓取 API，但更具体的 /api/v1/public/assets/ 允许抓取公开图片以生成分享封面；图片仍按发布快照鉴权，允许抓取搜索及管理入口以读取其 noindex；robots 不承担内容授权。管理台 HTML 本身由 inkwell 标记 noindex,nofollow，线上代理也已有对应响应头。

`/sitemap.xml` 为动态索引：包含 `/sitemap-pages.xml`（公开固定页）和 `/sitemap-1.xml` 等内容分片。每份内容地图50条，覆盖全部已发布文章/帖子，lastmod 使用 publicUpdatedAt，不使用私人工作稿的 updatedAt。根目录 URL 通过 Next rewrite 路由到 `/sitemaps/[name]`。每个分片只请求一页，避免全站正文一次加载；索引最多49999个内容分片，越界失败而不静默截断。

## 订阅

`/feed.xml` 为 RSS 2.0，按首次发布时间倒序提供最近50条文章和帖子的摘要及详情链接，不包含完整正文。GUID 为稳定详情 URL，再次发布更新摘要但保持 GUID 与 pubDate；lastBuildDate 取所选条目的最新公开更新时间。全站提供 RSS alternate 自动发现，页脚有“RSS 订阅”。

XML 字符过滤与转义在 shared/seo；RSS 摘要先转义文本再编码为 HTML，防止订阅软件把正文片段当作标签。RSS和内容地图动态生成且 Cache-Control:no-store，撤回/删除在下次请求移除；已被阅读器下载的副本由阅读器管理。公开 API 故障时返回不缓存的503，不以空列表覆盖订阅。

## 验证

运行 README 的 lint、format:check、typecheck、生产构建；真实 HTTP 回归位于 raychi `scripts/seo-rss-e2e.py`，只能使用显式隔离的数据库、附件和测试凭据。发布 CI 在一次性 MySQL/TLS 服务栈执行此脚本，覆盖发布生命周期、XML转义、50条上限、超过50条地图分页、无标题帖子、元数据、订阅发现与 noindex。额外核对 API故障、配置域名/子路径和真实 Chrome 手机页脚。

依据：[Google sitemap 文档](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)、[Google noindex 文档](https://developers.google.com/search/docs/crawling-indexing/block-indexing)、[RSS 2.0 规范](https://www.rssboard.org/rss-specification)。
