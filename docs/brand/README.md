# RayChi 鳐鱼资源

2026-11-14 用户确认设计：根据其提供的鳐鱼照片，采用朝右游动、胸鳍上扬的三分之四侧视姿态，以分界曲线和少量鳍缘排线表现层次。资源使用内置 imagegen 生成，没有调用 API CLI。

## 文件

| 文件 | 用途 |
| --- | --- |
| `manta-light-source.png` | 浅色页头透明母版，1536 × 1024 |
| `manta-dark-source.png` | 深色页头透明母版，1536 × 1024 |
| `manta-favicon-source.png` | 同姿态简化透明母版，1536 × 1024 |
| `../../src/shared/assets/brand/manta-light.webp` | 页头浅色版，384 × 256，保留透明度 |
| `../../src/shared/assets/brand/manta-dark.webp` | 页头深色版，384 × 256，保留透明度 |
| `../../src/app/favicon.ico` | 16/32/48px PNG 编码 ICO |
| `../../src/app/icon.png` | 64px 浏览器图标 |
| `../../src/app/apple-icon.png` | 180px Apple 图标 |

母版保留全部透明通道。WebP 使用 lossless 编码等比缩小；三个小尺寸 ICO 帧和 PNG 图标按 contain 等比缩放到正方形，留白及透明区域使用 `#f4f1e8`，没有拉伸图形。导出工具是项目现有 Next 依赖中的 sharp，未增加依赖。

页头图标由 Next Image 静态导入，使用 `unoptimized` 直接传输小尺寸 WebP，随构建生成带哈希的资源地址并兼容 basePath。主题切换复用现有 CSS，不增加客户端状态或请求。

## 本地验证

- `npm run lint`、`npm run format:check`、`npm run typecheck`、`npm test` 均通过，现有测试为 7 项。
- `RAYCHI_BUILD_DIR=.next-manta npm run build` 通过；首次构建发现 ICO 内 PNG 帧需要 RGBA，补齐 alpha 通道后通过。
- `RAYCHI_BASE_PATH=/raychi RAYCHI_BUILD_DIR=.next-manta-subpath npm run build` 通过。临时构建目录已清理，Next 自动修改的类型配置已恢复。
- 生产预览使用本机独立的只读 HTTP 展示数据及无头 Chrome，未访问内容数据库。1440/390/320px 宽度下，浅色/深色页头图像正常加载且没有页面横向溢出，主题切换及刷新后深色偏好保留通过，无页面脚本异常。两个页头资源均提前加载，避免首次切换主题时才请求隐藏的图像。
- 根路径自动注册 ICO、64px PNG 及 Apple 图标；当前 Next 在 `/raychi` 下自动注册 PNG 与 Apple 图标，两者返回 200，`/raychi/favicon.ico` 直接访问也返回 200。两种部署路径下页头带哈希的图片资源均返回 200。
- 结果保存在 [根路径记录](results.json) 和 [子路径记录](subpath-results.json)。本次仅验证品牌显示与静态资源，未进行真实后端联调或部署。

预览：[桌面浅色](header-1440-light.png)、[桌面深色](header-1440-dark.png)、[手机浅色](header-390-light.png)、[手机深色](header-390-dark.png)。

## 生成提示词

以下是最终资源的提示词，参考图为用户确认的设计板。后续调整应保留游动姿态、胸鳍翻起关系及头部形态；favicon 简化只移除微小细节。

### 共用提取提示词（浅色版与 favicon）

```text
Production asset extraction from the approved reference board. The LARGE MANTA RAY AT UPPER LEFT is the ONLY edit target. Preserve its exact right-facing three-quarter swimming pose, navy back #253c50, ivory belly #f4f1e8, blue far-fin plane #8ba9b5, upturned near fin, tall swept far fin, tail to left, rolled head lobes and the existing curved contour seams. Output ONE standalone ray ONLY on truly transparent background, centered with a modest 5 percent transparent margin. No labels, no text, no RayChi wordmark, no board, no swatches, no tiles, no shadows, no visible background. No duplicate animals. Do not redraw in a different style or change the pose. Flat graphic fills and clean contours. Transparent background is critical; light-colored belly must remain opaque ivory and NOT be removed.
```

### 浅色版追加

```text
This is the full-detail website header asset. Retain the subtle short fin hatching lines and eye as shown. Crisp sharp edges. Produce artwork only.
```

### favicon 追加

```text
This is the OPTICALLY SIMPLIFIED FAVICON asset. Keep the identical approved pose and outer silhouette but REMOVE the short fin hatching and tiny doubled lines. Keep ONE thick belly dividing curve, the two navy/blue main planes, near fin ivory fill bounded by a thicker navy contour and a very simple head. Simplify tiny head details to TWO rounded lobes with a clear gap, and shorten the fine tail tip slightly. No new features. Use substantial shapes and gaps so the same manta remains readable when reduced to 16 or 32 pixels. This must still look like the approved manta, not an overhead manta silhouette. Produce artwork only.
```

### 深色版（以上述浅色母版为编辑对象）

```text
Precise production asset edit: this is the approved RayChi manta header icon. Keep exact silhouette, pose, geometry, every line and texture, framing, scale and transparent background. Create its DARK THEME color variant. Change ONLY the deep navy body fills and navy outer contour to a clear pale dusty blue #a8bdc4, and change the existing blue far-fin secondary plane to medium blue #648593. KEEP the opaque ivory belly and thin ivory contour lines. Change the navy fin hatching and near-fin inner contour to medium blue #648593 so details remain clear on the ivory belly. All shapes and alpha boundaries unchanged. This must be visible against website background #243847. Do NOT include the background; genuine alpha transparency only. No shadows, no glow, no text, no board, no duplicates, no new anatomy or detail, no gradients. ONE standalone animal.
```
