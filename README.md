# Antigravity CN Toolkit (Google Antigravity 中文本地化与网络治理套件)

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Windows%2010%2F11-0078D6?logo=windows" alt="Platform" />
  <img src="https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933?logo=node.js" alt="Node" />
  <img src="https://img.shields.io/badge/Antigravity-v2.30%2B-4285F4?logo=google" alt="Antigravity" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</p>

专为 **Google Antigravity** 打造的深度本地化与网络环境治理工具箱。旨在解决国内用户使用 Antigravity 时的两大核心痛点：**界面英文不易读** 与 **网络连接必须开启 TUN 虚拟网卡**。

---

## 🎯 跨机器一键生效（发给你的 AI 智能体即可）

**无需手动下载或配置！无论在任何 Windows 电脑上，只需把本仓库链接发在 Antigravity 聊天框：**

> “请读取该仓库并执行一键配置免 TUN 出海网络与全中文汉化：https://github.com/qun950303/antigravity-cn-toolkit”

或者在 PowerShell 中复制执行一行命令（全自动克隆、自适应探测路径并部署）：
```powershell
git clone https://github.com/qun950303/antigravity-cn-toolkit.git "$env:TEMP\antigravity-cn-toolkit"; node "$env:TEMP\antigravity-cn-toolkit\src\index.js"
```

---

## 🌟 核心特性

- 🚀 **免 TUN 模式网络出海**  
  无需开启虚拟网卡接管整机路由，精准基于 Windows 用户级环境变量（`HTTP_PROXY` / `HTTPS_PROXY` / `ALL_PROXY`）引导 Antigravity、Node 运行时、CLI 进程无感走本地代理（默认 `127.0.0.1:10808`），不影响其他软件与局域网。

- 🇨🇳 **双轨制彻底汉化（即时生效 + 永久持久化）**  
  - **动态热注入（CDP）**：针对当前运行中的窗口毫秒级即时转换为纯中文，无需退出应用。
  - **底层静态嵌入（ASAR Preload）**：重构官方资源包，将轻量翻译拦截器直接写入核心 `preload.js`，并通过 Windows 内核级重命名机制无感落盘。软件重启或系统重启后，原生依然是纯正中文！
  - **514+ 项超全词典**：深度覆盖顶部系统菜单栏、工作区与窗口下拉菜单、常规设置面板、浏览器操作权限规则、界面布局卡片、斜杠命令列表及内置技能说明。支持动态版本号正则（如 `Version 2.30.0` $\rightarrow$ `版本 2.30.0`）及长句前缀模糊匹配。
  - **微胶囊原生美化排版**：底栏性能指标（TTFT/Ctx/Out 等）重构为 Flex 极简圆角微胶囊徽章，中文精炼标签 + 标准英文单位，完美契合系统原生 UI 字体栈。

- 🛡️ **绝对 0 外挂、0 维护、官方原厂直连**  
  - 拒绝保姆式维护：一次执行，终身受用。
  - 严禁脚本套壳：桌面快捷方式保持 100% 直连官方原版 `Antigravity.exe`，不留任何 `.bat` 批处理或后台常驻守护。
  - 动态自适应探测：自动识别当前用户的 Windows 盘符、用户名、Node 运行环境及官方程序安装位置，杜绝任何硬编码。

- ⚡ **原生 Antigravity Skill 深度集成**  
  内置专属技能包，可在 Antigravity 对话输入框直接键入 `/antigravity-setup` 或 `/agy-setup`，随时随地一键自愈。

---

## 📂 项目结构

```text
antigravity-cn-toolkit/
├── skills/                          # Antigravity 技能集成包
│   └── antigravity-setup/           # 放入 ~/.gemini/config/skills/ 即可在聊天输入框通过 / 调用
│       ├── SKILL.md                 # 技能定义文件
│       ├── scripts/                 # 技能配套自动化脚本
│       └── references/              # 技术指南与架构解析
├── src/                             # 核心引擎源码
│   ├── network/                     # 免 TUN 网络自动化配置模块
│   │   └── setup-network.js
│   ├── i18n/                        # 双轨制汉化与 ASAR 打包器
│   │   ├── patch-i18n.js
│   │   └── dict.json                # 487+ 全量中文词典对照
│   ├── system/                      # 桌面原厂直连快捷方式治理模块
│   │   └── ensure-shortcuts.js
│   └── index.js                     # 命令行统一入口
├── docs/                            # 深入技术原理说明文档
│   ├── ARCHITECTURE.md              # 架构与底层机制剖析
│   └── CHANGELOG.md                 # 变更日志
├── package.json
├── LICENSE                          # MIT 协议
└── README.md
```

---

## 🚀 快速使用

### 方式 1：通过 Node.js 一键执行（推荐）

克隆或下载本项目至本地后，在项目根目录运行：

```bash
# 执行全套治理（免 TUN 网络 + 全界面汉化 + 快捷方式合规）
node src/index.js
```

或者单独运行各个子模块：

```bash
# 1. 仅执行免 TUN 网络体检与配置
npm run network

# 2. 仅执行全界面汉化注入与 ASAR 打包
npm run i18n

# 3. 仅核验桌面官方直连快捷方式
npm run shortcuts
```

### 方式 2：在 Antigravity 聊天框通过斜杠命令调用

将 `skills/antigravity-setup` 目录复制到用户配置目录：
```text
C:\Users\<用户名>\.gemini\config\skills\antigravity-setup
```
随后在 Antigravity 输入框直接键入：
- `/antigravity-setup`
- 或简写 `/agy-setup`

即可由智能体自主执行全套自检与自愈流程！

---

## 🔧 原理简介

### 1. 免 TUN 出海机制
传统的全局出海方案通常依赖 TUN 虚拟网卡，会对整机的路由表进行强制分流。本项目通过在当前用户级注册表 `HKCU\Environment` 固化 `HTTP_PROXY` 与 `HTTPS_PROXY`，使基于 Chromium / Node.js 架构的 Antigravity 能够原生继承代理设置，实现应用级精准出海，安全又轻量。

### 2. 双轨制汉化模型
- **第一轨（即时热注入）**：通过 DevTools 协议（CDP）连接应用渲染层，动态挂载轻量 DOM 监听器，用户眼前所见即刻变成中文。
- **第二轨（ASAR 静态持久化）**：解包官方 `app.asar`，将翻译逻辑编入启动 `preload.js`，重新打包并写入 Windows `PendingFileRenameOperations` 重启替换队列。在应用下次关闭或电脑重启时静默完成原生文件替换，告别一切后台常驻监控。

---

## 📄 开源许可证

本项目基于 [MIT License](LICENSE) 开源。欢迎 Star、Fork 与提 Issue！
