# Antigravity 双轨制全中文汉化与零维护原理

## 1. 双轨制注入模型
1. **即时热注入 (CDP Hot-Injection)**：
   - 通过 Chrome DevTools Protocol 远程调试端口（DevToolsActivePort 动态探测），直接向当前运行中的 Antigravity 界面注入轻量 MutationObserver 引擎与 487+ 词典。
   - 实现效果：当前屏幕无需关闭或重启，毫秒级直接切换为中文。
2. **底层原生注入 (ASAR Preload Embedding)**：
   - 将汉化拦截引擎静态打包进解包后的 `preload.js`，重新打包为 `app.asar.patched`。
   - 登记 Windows 内核级重启替换队列 `PendingFileRenameOperations`。
   - 实现效果：应用或电脑重启后，主程序随原生加载即为纯中文，后台无任何挂载进程。

## 2. 词典与动态正则能力
- **精确词典**：覆盖菜单栏、设置面板、右键上下文、斜杠命令列表、内置技能说明。
- **动态版本正则**：`^Version\s+(.*)$` $\rightarrow$ `版本 $1`，随官方版本升级永久生效。
- **前缀模糊匹配**：防止 UI 截断（带 `...`）导致长句漏翻。
