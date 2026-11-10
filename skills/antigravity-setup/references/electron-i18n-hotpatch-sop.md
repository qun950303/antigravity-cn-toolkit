# Electron / ASAR 动态热补丁注入与词典质量管理规范（SOP）

## 1. 核心目标
解决基于 Chrome DevTools Protocol (CDP) WebSocket 的客户端内存热注入在词典更新后“无法即时更新已打开页面文本”、“历史旧补丁配置干扰”以及“短语防吞字”三大核心工程问题。

---

## 2. 动态内容 MD5 版本失效机制（Dynamic Hash Invalidation）

### 痛点根因
前端注入的翻译脚本采用 WeakMap 与 DOM 节点属性标记是否已翻译。若注入脚本的版本号（`PATCH_VERSION`）是固定的（如 `v1.3.1`），当词典内容发生修改且用户再次执行注入时，已打开的前端页面检测到版本号相同，会直接跳过已标记节点的重新计算，导致界面呈现旧译文，必须重启客户端才能生效。

### 标准规范
必须计算词典内容序列化的 MD5 哈希并拼接入版本号。一旦词典内容发生任何变化，版本号随之变动：
```javascript
const crypto = require('crypto');

function computePatchVersion(baseVersion, dict) {
  const dictHash = crypto.createHash('md5')
    .update(JSON.stringify(dict))
    .digest('hex')
    .slice(0, 8);
  return `${baseVersion}-${dictHash}`;
}
```
**注入效果**：
- 前端页面 MutationObserver 识别到版本号差异；
- 自动清理上一版本的节点映射并触发全量 DOM 热重译；
- 彻底实现“不重启客户端、热重载即刻生效”。

---

## 3. 历史僵尸配置隔离与环境卫生治理（Zombie Override Hygiene）

### 痛点根因
工具如果隐式读取历史外部目录（如 `.gemini\antigravity\theme-patch\user\i18n.override.json`），极易造成用户在不知情的情况下被多天前残留的废弃覆盖配置反向覆盖最新词典，引发难以排查的“语义倒退”怪相。

### 标准规范
1. **单一可信配置源**：热补丁运行时只加载受当前工程版本控制的官方词典与受管配置。
2. **主动巡检与清理**：在执行补丁注入前，主动扫描已知的废弃历史覆盖路径；若发现冲突文件，执行自动归档或静默清除，防止反客为主。

---

## 4. 语义语境优先翻译（Contextual vs. Literal）

### 规范细则
1. **严禁脱离 UI 上下文直译**：
   - 示例：大语言模型推理强度设置 `Thinking Effort: High / Medium / Low`。
   - 错误直译/意译：误译为“额度充裕 / 适中 / 紧张”（把思考深度误判为 API 配额余额，引起用户焦虑）。
   - 正确语境翻译：应精准翻译为“深度思考 / 平衡思考 / 轻量思考”。
2. **配套操作精准匹配**：
   - `View Usage` 应翻译为“查看用量统计”，精准指代引导至配额看板。
   - `Notice` 应翻译为“使用提示”。

---

## 5. 防吞字词典质量门禁（Anti-Text-Swallowing Dict Gate）

### 痛点根因
在全词替换模式下，若词典中收录了英文句中词组（如 `to be installed.` 或 `when working in this project.`），且错误地映射为单个标点符号（如 `。`），会导致宿主 UI 中只要命中该片段，整句长文本即刻被截断吞没。

### 门禁规则
词典发布与构建时必须执行自动化静态检查：
```javascript
function validateDictionary(dict) {
  for (const [key, value] of Object.entries(dict)) {
    // 规则 1：禁止非纯标点英文短语被替换为纯中文标点
    if (/^[a-zA-Z\s]{4,}\.?$/.test(key.trim()) && /^[。，！？；：、]$/.test(value.trim())) {
      throw new Error(`检测到高危防吞字词条："${key}" -> "${value}"`);
    }
  }
}
```
