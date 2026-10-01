# 前台搜索验收 · 2026-10-02

关联 lantern #9 / raychi #11。候选分支 feat/public-search，准确 SHA 与最终 main 组合见 PR 和跨仓验收。

`npm ci --ignore-scripts`、`npm run typecheck`、`npm run build`通过，生产构建包含动态 `/search`。固定后端候选+真实MySQL8+search-core0.2.0在13000/18080/18091独立端口完成HTTP验证：中文/英文、article/post、nextOffset分页，私人工作稿不显示，标题 `<script>` 被 HTML 转义，不含服务token。

浏览器验证搜索表单、帖子筛选与整条结果链接进入公开帖子，结果为空/未开始提示。后续最终固定 main 组合的浅色/深色和手机适配截图、搜索不可用提示见 raychi 搜索验收。

前台只调用wellspring公开API；service token不提供给浏览器。结果文本没有HTML渲染入口，nextOffset来自后端，不计算total。
