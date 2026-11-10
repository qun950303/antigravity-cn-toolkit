# Windows 跨机器与多用户环境工程适配规范（SOP）

## 1. 核心目标与原则
在编写供他人使用或分发的命令行工具、Skill 转发脚本与自动化脚本时，必须确保脚本在**任意用户名**、**任意磁盘安装位置**、**任意独立调用形态**下均可 100% 稳定运行。

---

## 2. 根目录双模探测机制（Dual-Mode Detection）

### 痛点根因
- 错误使用 `path.resolve(__dirname, '..', '..')`：当脚本所在目录层级发生微调，或使用者将 `skills/antigravity-setup/` 拷贝到全局配置目录时，相对跳级必然落空，报 `MODULE_NOT_FOUND`。
- 绝对路径硬编码：写死 `D:\...` 或 `C:\Users\Administrator\...`，其他机器或非管理员账户运行必然崩溃。

### 标准实现规范
所有转发与子模块脚本必须实现**向上递归探查 + 持久化安装目录探测**的双模探测机制：

```javascript
const path = require('path');
const fs = require('fs');

function getProjectRoot() {
  // 模式一：向上递归探查标准工程标志（package.json + src/index.js）
  let current = __dirname;
  while (true) {
    if (fs.existsSync(path.join(current, 'package.json')) && 
        fs.existsSync(path.join(current, 'src', 'index.js'))) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }

  // 模式二：全局/持久化目录降级回退
  const localAppData = process.env.LOCALAPPDATA || (process.env.USERPROFILE && path.join(process.env.USERPROFILE, 'AppData', 'Local'));
  const candidates = [
    localAppData ? path.join(localAppData, 'antigravity-cn-toolkit') : null,
    process.env.ANTIGRAVITY_TOOLKIT_ROOT,
    'D:\\antigravity-cn-toolkit'
  ].filter(Boolean);

  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, 'package.json')) && 
        fs.existsSync(path.join(dir, 'src', 'index.js'))) {
      return dir;
    }
  }

  throw new Error('未能在本地找到有效的 antigravity-cn-toolkit 工程根目录。');
}
```

---

## 3. 命令行参数转义与引号防御

### 痛点根因
Windows 用户路径可能包含空格（如 `C:\Program Files`）或单双引号（如爱尔兰裔用户名 `O'Connor`）。直接拼接待执行的 PowerShell 命令会导致语法解析断裂或注入攻击。

### 标准防护方案
1. **参数化执行**：优先使用 `child_process.spawn` 的参数数组传递方式，避免手动字符串拼接。
2. **Base64 转码传递**：当必须通过 `powershell.exe -EncodedCommand` 运行内联命令时，将待执行字符串统一转换为 UTF-16LE 字节流并进行 Base64 编码：
   ```javascript
   function toPowershellEncodedCommand(scriptText) {
     return Buffer.from(scriptText, 'utf16le').toString('base64');
   }
   ```

---

## 4. 交付与配置检查清单
- [ ] 所有脚本与文档中已彻底清除 `Administrator`、特定用户专用路径。
- [ ] 所有涉及环境依赖的检查已改用 `%LOCALAPPDATA%` 或 `os.homedir()` 动态获取。
- [ ] 示例命令与快速开始指南均提供通用环境变量写法。
