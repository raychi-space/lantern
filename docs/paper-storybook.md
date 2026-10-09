# 公开站纸感插画风格

配色以米白 `#f4f1e8`、灰蓝和深蓝 `#253c50` 为基础，明黄 `#edcc56` 用在小面积标记和操作按钮。页面使用静态细颗粒层、低对比的色面和留白，移除旧星空、光晕、玻璃模糊、渐变与浮起阴影。文章正文维持可读的深蓝字色。

默认采用米白主题；明确保存的深色偏好仍有效，深色主题使用哑光深蓝。评论组件以相同规则同步主题。首页介绍、内容封面、项目和显示顺序继续服从站点配置。

首页窗边阅读插画由内置 imagegen 工具生成；最终资源保存在 `src/shared/assets/quiet-window.webp`，1600 × 600，约 116 KiB。通过 Next Image 静态导入处理尺寸和子路径部署。插画属装饰性内容，不重复朗读。

文章缺省封面由 `features/contents/content-illustration.ts` 、`illustration-catalog.ts` 和 `components/IllustrationScene.tsx` 生成内联 SVG。使用内容 ID 和规范化的已发布标题、摘要、分类、标签、正文计算 FNV-1a 哈希，驱动种子随机数；发布内容相同则首页和文章列表画面一致，日期、路径与刷新时间不影响画面。关键词按匹配数量独立选择题材、天气和时间，平分和无匹配时由种子选择。题材共18种：海岸、海港、灯塔、山谷、森林、花园、街区、高楼之间、屋顶、车站、桥梁、小巷、窗边、书与信、器物静物、温室、沙丘与梦境意象；天气有晴、阴、雨、雪、雾、风，时间有白天、黄昏、夜晚；这只是规则匹配，不做模型语义推断。随机参数控制色板、朝向、云、植物、建筑、器物、日月和颗粒；生成封面不含人物，使用无描边色块、轻微不规则路径和微量位移纹理。无需外部 API、运行时图片请求或新增依赖。仅替换没有自定义封面的文章，帖子不显示缺省图片。

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

早期五类生成器验证（扩展前）：新增三项确定性、内容差异与场景规则测试，连同原有测试共五项通过。已实际渲染并查看五类场景、十张 SVG 示例；本机 3000 端口首页、文章列表、再次请求首页得到同一文章种子 `1411799897`，三次均返回 HTTP 200。帖子页返回 200 且没有生成封面。重新运行类型检查、构建、边界和排版检查通过。

本地验收曾额外启动已有内容服务包；它将本地已配置的 raychi_preview 数据库从 v7 迁移至 v12，随后因 8080 已占用退出。后续验证使用原本运行的内容服务，未继续启动后端。

独立预览 `/illustrations` 默认展示18类题材各3幅，共54幅。支持题材筛选、6种天气、3个时间、换一组、大图及输入文字生成。选择项只影响预览，不修改文章；页面 noindex，不加入主导航、站点地图或访问统计。文章默认封面使用相同生成器，已设置封面优先，帖子仍无默认图。

18类扩展验证（2026-10-09）：7项测试通过，覆盖全部题材关键词、天气与时间的独立识别、324种预览组合与确定性；类型检查、生产构建、边界、排版、diff检查通过。已渲染并查看18类题材及高楼的18种天气/时间组合。真实本机预览页 HTTP 200，54个唯一封面、18种题材、6种天气、3个时间，SVG资源ID无重复；首页与文章列表种子一致，刷新稳定，帖子仍无默认图。Chrome刷新后确认新版文案、控制项与54幅图片，截图可见新画面；筛选操作遇到用户切换窗口，未完成浏览器逐项交互验收。
