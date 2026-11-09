/**
 * Antigravity 彻底全中文汉化套件（即时热注入 + ASAR 底层永久持久化）
 * 特性：
 * 1. 包含 487+ 项核心词典，覆盖系统顶部菜单、项目右键、设置面板、斜杠指令、内置技能、动态版本号；
 * 2. CDP 动态热注入：当前运行窗口毫秒级无感转为中文，无需退出；
 * 3. ASAR 静态底层注入：解包构建并打包 app.asar.patched，写入系统重启替换队列，彻底零维护。
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const LOCAL_DICT = path.join(__dirname, 'dict.json');
const EXTERNAL_DICT = 'C:\\Users\\Administrator\\.gemini\\antigravity\\theme-patch\\core\\i18n.json';
const DICT_PATH = fs.existsSync(LOCAL_DICT) ? LOCAL_DICT : EXTERNAL_DICT;

const EXTRACTED_DIR = 'C:\\Users\\Administrator\\.gemini\\antigravity\\scratch\\asar_extracted';
const PATCHED_ASAR = 'C:\\Users\\Administrator\\.gemini\\antigravity\\scratch\\app.asar.patched';
const OFFICIAL_ASAR = 'C:\\Users\\Administrator\\AppData\\Local\\Programs\\antigravity\\resources\\app.asar';
const NODE_EXE = 'C:\\Users\\Administrator\\.gemini\\antigravity\\bin\\node\\node.exe';
const NPX_CLI = 'C:\\Users\\Administrator\\.gemini\\antigravity\\bin\\node\\node_modules\\npm\\bin\\npx-cli.js';

function buildPreloadInjector() {
  const dict = JSON.parse(fs.readFileSync(DICT_PATH, 'utf8'));
  const preloadPath = path.join(EXTRACTED_DIR, 'dist', 'preload.js');
  if (!fs.existsSync(preloadPath)) {
    throw new Error(`未找到待注入的 preload.js: ${preloadPath}`);
  }

  const origPreload = fs.readFileSync(preloadPath, 'utf8');
  let cleanPreload = origPreload;
  const marker = '// === Native Clean I18n Translator for Antigravity ===';
  const markerIdx = cleanPreload.indexOf(marker);
  if (markerIdx !== -1) {
    cleanPreload = cleanPreload.slice(0, markerIdx).trimEnd();
  }

  const injectorCode = `
// === Native Clean I18n Translator for Antigravity ===
(function() {
  const DICT = ${JSON.stringify(dict)};
  const EXCLUDE_SELECTOR = 'code, pre, kbd, samp, textarea, input, style, script, noscript, [contenteditable="true"], .prose, .markdown, [class*="chat-message"], [class*="group/file-title"], [data-testid="conversation-row-sidebar"] a[href^="/c/"], [data-testid="conversation-row-sidebar"] span.truncate';
  
  const RE_HAS_ALPHA = /[a-zA-Z]/;
  const RE_VERSION = /^Version\\\\s+([0-9\\\\.\\\\-a-zA-Z]+)$/i;
  const RE_FILES_CHANGED = /^(\\\\d+)\\\\s+files?\\\\s+changed$/i;
  const RE_TOOLS = /^(\\\\d+)\\\\s+tools?$/i;
  const RE_DEMOTED = /^(\\\\d+)\\\\s+demoted$/i;
  const RE_EXCLUDED = /^(\\\\d+)\\\\s+excluded$/i;
  const RE_TOOLS_EXCLUDED = /^(\\\\d+)\\\\s+tools?\\\\s+excluded$/i;
  const RE_ACTIVE_CONVS = /^(\\\\d+)\\\\s+active\\\\s+conversations$/i;
  const RE_SEE_ALL = /^See all\\\\s*\\\\((\\\\d+)\\\\)$/i;
  const RE_SHOW_BREAKDOWNS = /^Show\\\\s+(\\\\d+)\\\\s+breakdowns?$/i;
  const RE_PERM_DELETE = /^Permanently delete\\\\s+(.*)\\\\s+including\\\\s+(\\\\d+)\\\\s+active\\\\s+conversations\\\\.?$/i;
  const RE_WORKED_FOR = /^Worked for\\\\s+(\\\\d+[smhd])$/i;
  const RE_THOUGHT_FOR = /^Thought for\\\\s+(\\\\d+[smhd])$/i;

  function isExcluded(el) {
    if (!el || el.nodeType !== 1) return true;
    return !!el.closest(EXCLUDE_SELECTOR);
  }

  function translateText(raw) {
    if (!raw) return null;
    const trimmed = raw.trim();
    if (!trimmed) return null;

    let repl = DICT[trimmed];
    if (typeof repl !== 'string' && trimmed.endsWith('.')) {
      const withoutDot = DICT[trimmed.slice(0, -1)];
      if (typeof withoutDot === 'string') {
        repl = withoutDot.endsWith('。') ? withoutDot : withoutDot + '。';
      }
    }
    if (typeof repl === 'string') {
      return raw.replace(trimmed, repl);
    }

    if (!RE_HAS_ALPHA.test(trimmed)) return null;

    if (RE_VERSION.test(trimmed)) return raw.replace(RE_VERSION, '版本 $1');

    if (trimmed.startsWith('Comprehensive guide and reference for the Antigravity')) {
      return 'Antigravity 自定义系统的完整指南与参考。用于说明自定义项的工作原理...';
    }
    if (trimmed.startsWith('Provides a comprehensive guide, quick reference, and sitemap')) {
      return '提供 Google Antigravity (AGY) 权威指南、快速参考与地图索引...';
    }
    if (trimmed.startsWith('Interactive guide to design and create a scheduled background')) {
      return '设计并创建后台定时自动化任务的交互式指南...';
    }
    if (trimmed.startsWith('How to render rich interactive HTML widgets inline')) {
      return '在对话中或作为独立工件渲染丰富的交互式 HTML 组件...';
    }
    if (trimmed.startsWith("Migrates the user's MCP servers, skills, slash commands")) {
      return '从其他编程助手迁移 MCP 服务、技能、斜杠指令、子代理与配置文件...';
    }
    if (trimmed.startsWith('Automatically migrate legacy workflows to modern skills')) {
      return '跨全局与工作区配置将旧版工作流自动迁移为现代技能...';
    }
    if (trimmed.startsWith('How to manage and create plugins')) {
      return '如何管理与创建插件（技能、智能体、规则、MCP 服务与钩子的整合包）...';
    }
    if (trimmed.startsWith('Discover UI plugin panels relevant to the current task')) {
      return '发现与当前任务相关的 UI 插件面板，并在对话中提供一键展开药丸按钮。';
    }

    if (RE_WORKED_FOR.test(trimmed)) return raw.replace(RE_WORKED_FOR, '已工作 $1');
    if (RE_THOUGHT_FOR.test(trimmed)) return raw.replace(RE_THOUGHT_FOR, '已思考 $1');
    if (RE_FILES_CHANGED.test(trimmed)) return raw.replace(RE_FILES_CHANGED, '$1 个文件变更');
    if (RE_TOOLS.test(trimmed)) return raw.replace(RE_TOOLS, '$1 个工具');
    if (RE_DEMOTED.test(trimmed)) return raw.replace(RE_DEMOTED, '$1 项已降级');
    if (RE_EXCLUDED.test(trimmed)) return raw.replace(RE_EXCLUDED, '$1 项已排除');
    if (RE_TOOLS_EXCLUDED.test(trimmed)) return raw.replace(RE_TOOLS_EXCLUDED, '$1 个工具已排除');
    if (RE_ACTIVE_CONVS.test(trimmed)) return raw.replace(RE_ACTIVE_CONVS, '$1 个进行中的会话');
    if (RE_SEE_ALL.test(trimmed)) return raw.replace(RE_SEE_ALL, '查看全部 ($1)');
    if (RE_SHOW_BREAKDOWNS.test(trimmed)) return raw.replace(RE_SHOW_BREAKDOWNS, '展开明细 ($1 项)');
    if (RE_PERM_DELETE.test(trimmed)) return raw.replace(RE_PERM_DELETE, '永久删除 $1 及 $2 个进行中的会话。');

    return null;
  }

  function translateNode(node) {
    if (!node) return;
    if (node.nodeType === 3) {
      if (node.parentElement && isExcluded(node.parentElement)) return;
      const t = translateText(node.nodeValue);
      if (t && t !== node.nodeValue) {
        node.nodeValue = t;
      }
      return;
    }
    if (node.nodeType === 1) {
      if (isExcluded(node)) return;
      if (node.hasAttribute('title')) {
        const t = translateText(node.getAttribute('title'));
        if (t) node.setAttribute('title', t);
      }
      if (node.hasAttribute('placeholder')) {
        const t = translateText(node.getAttribute('placeholder'));
        if (t) node.setAttribute('placeholder', t);
      }
      if (node.hasAttribute('aria-label')) {
        const t = translateText(node.getAttribute('aria-label'));
        if (t) node.setAttribute('aria-label', t);
      }
    }
  }

  function walk(el) {
    if (!el || isExcluded(el)) return;
    translateNode(el);
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.parentElement && isExcluded(n.parentElement)) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
    });
    while (walker.nextNode()) {
      translateNode(walker.currentNode);
    }
  }

  let scheduled = false;
  const pendingNodes = new Set();
  function queueWalk(node) {
    pendingNodes.add(node);
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        const list = Array.from(pendingNodes);
        pendingNodes.clear();
        for (const n of list) {
          try {
            walk(n);
          } catch(e) {}
        }
      });
    }
  }

  function startObserver() {
    if (!document.documentElement) return;
    walk(document.documentElement);
    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'childList') {
          for (let i = 0; i < m.addedNodes.length; i++) {
            queueWalk(m.addedNodes[i]);
          }
        } else if (m.type === 'characterData') {
          translateNode(m.target);
        } else if (m.type === 'attributes') {
          translateNode(m.target);
        }
      }
    });
    obs.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['title', 'placeholder', 'aria-label']
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserver);
  } else {
    startObserver();
  }
})();
`;

  const newPreload = cleanPreload + '\n' + injectorCode;
  fs.writeFileSync(preloadPath, newPreload, 'utf8');
  return newPreload.length;
}

function packAsar() {
  execSync(`"${NODE_EXE}" "${NPX_CLI}" asar pack "${EXTRACTED_DIR}" "${PATCHED_ASAR}" --unpack-dir "node_modules/chrome-devtools-mcp"`, {
    stdio: 'ignore'
  });
  if (fs.existsSync(PATCHED_ASAR)) {
    const sizeMb = (fs.statSync(PATCHED_ASAR).size / (1024 * 1024)).toFixed(2);
    return sizeMb;
  }
  throw new Error('生成 app.asar.patched 失败');
}

function setPendingRename() {
  const psCmd = `
$key = 'HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Session Manager'
$source = '\\??\\${PATCHED_ASAR}'
$target = '\\??\\${OFFICIAL_ASAR}'
Set-ItemProperty -Path $key -Name 'PendingFileRenameOperations' -Value @($source, $target) -Type MultiString
`;
  execSync(`powershell -ExecutionPolicy Bypass -Command "${psCmd.replace(/\n/g, '; ')}"`, { stdio: 'ignore' });
}

function triggerLiveHotPatch() {
  const installCli = 'C:\\Users\\Administrator\\.gemini\\antigravity\\theme-patch\\install.mjs';
  try {
    execSync(`node "${installCli}" build-manifest`, { stdio: 'ignore' });
    const out = execSync(`node "${installCli}" verify`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    return out.includes('"ok": true');
  } catch (e) {
    return false;
  }
}

function run() {
  console.log('========================================');
  console.log('  Antigravity 全中文汉化套件执行引擎');
  console.log('========================================\n');

  // 1. 词典词条检查
  const dict = JSON.parse(fs.readFileSync(DICT_PATH, 'utf8'));
  const count = Object.keys(dict).length;
  console.log(`[1] 汉化词典容量: 🟢 ${count} 条核心对照（全覆盖菜单、指令、技能与弹窗）`);

  // 2. 界面即时热注入
  const hotOk = triggerLiveHotPatch();
  console.log(`[2] 当前界面即时热注入: ${hotOk ? '🟢 注入成功！当前屏幕已实时转换为纯中文' : '🟡 当前未检测到调试端口，已跳过动态注入'}`);

  // 3. 构建底层注入 preload.js
  const preloadSize = buildPreloadInjector();
  console.log(`[3] 底层 preload.js 构建: 🟢 注入完成（大小: ${preloadSize} 字节）`);

  // 4. 打包原生 app.asar.patched
  const asarMb = packAsar();
  console.log(`[4] 核心资源包打包: 🟢 生成完成 -> app.asar.patched (${asarMb} MB)`);

  // 5. 登记 Windows 重启替换队列
  setPendingRename();
  console.log('[5] 系统内核重启替换队列: 🟢 已登记 PendingFileRenameOperations（关机/重启永久保留）');

  console.log('\n========================================');
  console.log('  全中文汉化套件注入完成');
  console.log('========================================');
}

if (require.main === module) {
  run();
}

module.exports = { run, buildPreloadInjector, packAsar, setPendingRename, triggerLiveHotPatch };
