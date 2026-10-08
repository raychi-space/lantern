# GitHub 评论

文章和帖子的已发布详情页可接入 giscus。访客使用 GitHub 登录；评论保存在公开 GitHub Discussions，站长在 GitHub 管理。网站不保存评论或 GitHub OAuth 密钥，也不提供站内注册、Google 登录或先审核后公开的自建流程。

服务端运行环境设置 `RAYCHI_GISCUS_ENABLED=true`，以及 `.env.example` 的仓库、仓库 ID、分类和分类 ID。四项来自 [giscus 配置页](https://giscus.app/zh-CN)，都是公开标识。默认关闭；缺项或非法配置时隐藏入口，不影响阅读。这些变量在请求时读取，不使用 `NEXT_PUBLIC_`，同一构建可通过重启切换配置。线上安装方式由 raychi 发布配置负责。

需要公开仓库、启用 Discussions、安装 giscus App，并建议使用仅管理员发起讨论的 Announcements 分类。实际启用前在评论仓库根目录设置 `giscus.json`，将 `origins` 限制为允许的站点原点；详见 [官方高级说明](https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md)。启用线上配置、GitHub 授权和部署均等待用户确认。

discussion 使用 `specific` + `strict=1`，关联键为 `raychi-content:{公开内容 UUID}`，不会随标题、slug、域名改变。内容迁移到另一个数据库时必须保留 UUID；删除正文不会自动删除 GitHub 上已有评论，撤回只隐藏网站入口。

默认点击“加载 GitHub 评论”后才连接 giscus，提示评论公开存储位置。GitHub OAuth 回跳带 `giscus` 参数时自动恢复评论。组件使用官方 `@giscus/react`，随站点深色/浅色主题更新，不重载 iframe；路由离开时移除组件及监听。第三方首次加载 15 秒无响应或报错时提供重试和 GitHub 讨论区链接。新内容的“Discussion not found”属于正常状态，首次评论由 giscus 建立讨论。

本地浏览器测试通过隔离内容服务创建公开文章/帖子，并拦截 giscus iframe 请求，验证映射、主题、失败和路由隔离。此测试不访问真实 GitHub OAuth、不产生真实评论；真实登录与发表须在 App 配置后另行验收。
