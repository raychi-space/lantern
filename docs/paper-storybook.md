# 公开站纸感插画风格

配色以米白 `#f4f1e8`、灰蓝和深蓝 `#253c50` 为基础，明黄 `#edcc56` 用在小面积标记和操作按钮。页面使用静态细颗粒层、低对比的色面和留白，移除旧星空、光晕、玻璃模糊、渐变与浮起阴影。文章正文维持可读的深蓝字色。

默认采用米白主题；明确保存的深色偏好仍有效，深色主题使用哑光深蓝。评论组件以相同规则同步主题。首页介绍、内容封面、项目和显示顺序继续服从站点配置。

插画由内置 imagegen 工具生成；最终资源保存在 `src/shared/assets/quiet-window.webp`，1600 × 600，约 116 KiB。通过 Next Image 静态导入处理尺寸和子路径部署；首页与缺省封面共用资源，实际内容封面不替换。插画属装饰性内容，不重复朗读。

主页默认头像采用用户提供的「耳机少女与诗人工作室」，保存为 `src/shared/assets/headphone-girl-avatar.webp`，512 × 512，约 62 KiB。保持原图构图，桌面显示 128px、手机显示 104px；通过静态导入优化加载，站点配置中的自定义头像仍有优先级。本地主页和新头像资源均验证 HTTP 200。

最终生成提示词：

```text
Use case: illustration-story
Asset type: wide horizontal hero illustration for Raychi, a quiet personal reading website.
Primary request: 无描边的纸感肌理插画，日系绘本与诗意动画的视觉气质。用简洁的大色块塑造人物和环境，依靠相邻颜色差异区分轮廓，形体略带手工感，边缘自然、不完全规整。细腻纸张颗粒、轻微斑驳印刷纹理、哑光水粉质感，剪纸般平面层次，但不是真实纸张拼贴。
Scene: A quiet everyday seaside reading scene that drifts into a dream: a small person in deep navy sitting by a window reading, a pale blue sea and a distant simple island beyond, one tiny vivid yellow light like a sun or a lamp. Minimal environmental detail.
Composition: panoramic horizontal illustration, generous negative space, sparse simplified forms, suitable for a full width website banner, understated handmade edges. Art only, no website UI.
Palette: warm ivory #f4f1e8, muted gray blue #a8bdc4, deeper dusty blue #648593, deep navy #253c50, a very small accent of clear yellow #edcc56.
Mood: quiet, nostalgic, slightly wistful, poetic, everyday scenery interwoven with surreal imagery; restrained lighting.
Avoid: any outlines or black linework, smooth vector surfaces, photography, photorealism, volumetric highlights, complex gradients, actual paper collage, harsh shadows, ornate detail, text, logos, watermark.
```

验证：类型检查、构建、代码边界、排版和现有 Markdown 目录测试通过。生产预览在 `http://127.0.0.1:3100`：首页、文章、帖子、回顾、更多、搜索和真实文章/帖子详情均返回 HTTP 200，不存在的页面返回 404；Next Image 优化后的插画资源返回 200。浏览器辅助功能树可读取首页内容。截图工具返回 ScreenCaptureKit 捕获失败，因此尚未完成桌面/手机截图走查。

本地验收曾额外启动已有内容服务包；它将本地已配置的 raychi_preview 数据库从 v7 迁移至 v12，随后因 8080 已占用退出。后续验证使用原本运行的内容服务，未继续启动后端。
