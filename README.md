# lantern

RayChi 的公开阅读站，使用 Next.js 展示已发布的文章、帖子和站点内容。内容由 [wellspring](https://github.com/raychi-space/wellspring) 提供。

## 本地开发

使用 Node.js 26，并先本地启动 wellspring。

```bash
npm ci
npm run dev
```

开发站点默认在 `http://127.0.0.1:3000`。如需连接其他本地后端，设置 `RAYCHI_API_URL`，默认值是 `http://127.0.0.1:8080`。

## 验证

```bash
npm run lint
npm run format:check
npm run typecheck
npm test
npm run build
```
