---
name: antigravity-setup
description: 【Antigravity 永久免TUN网络与全界面汉化修复套件】一键执行免TUN端口代理配置、动态+静态永久ASAR中文汉化注入、补全遗漏词条并恢复官方原厂直连快捷方式。当用户遇到更新后界面变回英文、汉化不够彻底、需要配置免TUN出海网络、或在对话框中输入 /antigravity-setup 时调用。
---

# Antigravity 全模块一键配置与健康治理套件

本套件严格遵循**唯一真实源（Single Source of Truth）**架构，所有底层执行逻辑均直连由本工程统一驱动：  
**主工程路径**：[D:\antigravity-cn-toolkit](file:///D:/antigravity-cn-toolkit)

---

## 快速调用与常用操作

智能体可在用户触发此技能时，直接在后台执行对应的脚本工具：

### 1. 一键全自动治理（推荐）
一次性执行网络体检、全界面即时与持久化汉化、快捷方式原厂直连核验：
```powershell
node "D:\antigravity-cn-toolkit\src\index.js"
```

### 2. 单独执行免 TUN 网络体检与配置
检测 10808 端口，固化 `HTTP_PROXY`、`HTTPS_PROXY`、`ALL_PROXY` 用户环境变量并测试真实连通性：
```powershell
node "D:\antigravity-cn-toolkit\src\network\setup-network.js"
```

### 3. 单独执行全界面彻底汉化（热注入 + ASAR 持久化）
动态热注入当前运行窗口，重新构建底层 `preload.js` 并打包 `app.asar.patched` 注册内核重启替换队列：
```powershell
node "D:\antigravity-cn-toolkit\src\i18n\patch-i18n.js"
```

### 4. 单独核验快捷方式与清理外挂
确保桌面只有纯官方原版直连的 `Antigravity.lnk`，扫描并清理任何残留的 `.bat` 或套壳启动器：
```powershell
node "D:\antigravity-cn-toolkit\src\system\ensure-shortcuts.js"
```

---

## 核心设计规范与原则

- **绝对零维护**：底层双轨制设计（热注入立即生效 + 静态 ASAR 重启生效），后台 0 常驻守护脚本，用户再也不用操心。
- **纯官方直连**：桌面快捷方式直接指向官方原厂 `Antigravity.exe`，严禁任何脚本套壳。
- **免 TUN 安全隔离**：仅在应用及运行时层面精准走代理，整机网络、内网与其他程序完全不受影响。
- **单真实源原则**：全局 Skill 配置全部指向 `D:\antigravity-cn-toolkit`，杜绝代码版本脱节与双重副本。
