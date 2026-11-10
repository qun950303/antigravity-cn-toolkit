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

或者在 PowerShell 中复制执行一行命令（全自动克隆到本地应用持久目录、自适应探测路径并部署）：
```powershell
git clone https://github.com/qun950303/antigravity-cn-toolkit.git "$env:LOCALAPPDATA\antigravity-cn-toolkit"; node "$env:LOCALAPPDATA\antigravity-cn-toolkit\src\index.js"
```

---

## 🌟 核心特性

- 🚀 **免 TUN 模式网络出海**  
  无需开启虚拟网卡接管整机路由，精准基于 Windows 用户级环境变量（`HTTP_PROXY` / `HTTPS_PROXY` / `ALL_PROXY`）引导 Antigravity、Node 运行时、CLI 进程无感走本地代理（默认 `127.0.0.1:10808`），不影响其他软件与局域网。前置测试端口监听与出海连通性，离线自动告警，杜绝断网。

- 🇨🇳 **双轨制彻底汉化（即时生效 + 永久持久化）**  
  - **动态热注入（CDP）**：针对当前运行中的窗口毫秒级即时转换为纯中文，无需退出应用。
  - **底层静态嵌入（ASAR Preload）**：重构官方资源包，将轻量翻译拦截器直接写入核心 `preload.js`，并通过 Windows 内核级重命名机制无感落盘。软件重启或系统重启后，原生依然是纯正中文！
  - **500+ 项精选纯净词典**：深度覆盖顶部系统菜单栏、工作区与窗口下拉菜单、常规设置面板、浏览器操作权限规则、界面布局卡片、斜杠命令列表及内置技能说明。
  - **精准思维链参数汉化**：将模型思考强度（Low / Medium / High）准确汉化为“轻量思考 / 平衡思考 / 深度思考”，彻底告别将思考强度误译为“额度充裕/紧张”的荒谬现象。
  - **微胶囊原生美化排版**：底栏性能指标（TTFT/Ctx/Out 等）重构为 Flex 极简圆角微胶囊徽章，中文精炼标签 + 标准英文单位，完美契合系统原生 UI 字体栈。

- 🛡️ **绝对 0 外挂、0 维护、官方原厂直连**  
  - 拒绝保姆式维护：一次执行，终身受用。
  - 严禁脚本套壳：桌面快捷方式保持 100% 直连官方原版 `Antigravity.exe`，不留任何 `.bat` 批处理或后台常驻守护。
  - 动态自适应探测：自动识别当前用户的 Windows 盘符、用户名、Node 运行环境及官方程序安装位置，杜绝任何硬编码。

- ⚙️ **原生 Antigravity Skill 深度集成**  
  内置专属技能包，可在 Antigravity 对话输入框直接键入 `/antigravity-setup` 或 `/agy-setup`，随时随地一键自愈。

---

## 📁 项目结构

```text
antigravity-cn-toolkit/
├── skills/                          # Antigravity 技能集成包
│   └── antigravity-setup/           # 专属斜杠技能（单真实源相对转发）
├── src/
│   ├── index.js                     # 一键总控统一入口
│   ├── i18n/                        # 完全体汉化引擎与词典
│   │   ├── patch-i18n.js            # ASAR 注入 + CDP 即时热注入驱动
│   │   └── dict.json                # 500+ 项精准中英对照基准字典
│   ├── network/                     # 免 TUN 网络自动化配置
│   │   └── setup-network.js         # 端口探测与用户环境变量写入
│   └── system/                      # 系统环境与合规治理
│       └── ensure-shortcuts.js      # 官方原厂直连快捷方式维护与防注入
├── docs/
│   ├── ARCHITECTURE.md              # 底层机制与双轨制架构设计
│   └── CHANGELOG.md                 # 版本迭代履历
└── package.json
```

---

## 🛠️ 常见问题 (FAQ)

### Q: 官方更新后，汉化会丢失吗？
**A:** 如果 Antigravity 发布了大版本静默覆盖更新，只需在 Antigravity 聊天框里输入 `/antigravity-setup`（或者在终端执行 `node src/index.js`），工具箱会立即秒级重新注入并刷新，永久保持全中文。

### Q: 为什么界面显示“深度思考 / 平衡思考 / 轻量思考”而不是“额度充裕”？
**A:** 在 Antigravity 的模型下拉菜单中，Gemini 3.8 Flash 等思考模型的子选项是其 **Thinking/Reasoning Effort（推理深度与思考预算）**。将其直译为“额度充裕/紧张”会导致用户误以为可以在菜单里“挑选额度”。因此工具箱进行了专业术语订正，准确反映模型的思考能力挡位。

---

## 📄 开源许可证

本项目基于 [MIT License](LICENSE) 开源。
