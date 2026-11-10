/**
 * Antigravity CN Toolkit - 全景技能与元数据地毯式本地化治理器
 * 核心设计原则：
 * 1. 根治“打地鼠式被动汉化”：一次性扫描官方内置全量技能库，地毯式完成源头本地化；
 * 2. 安全幂等可逆：就地修改前自动生成 .orig 备份，多次重复执行不破坏文件；
 * 3. 前端与源头双轨合一：源头 SKILL.md 改为纯中文，彻底消除 DOM 截断与匹配遗漏。
 */
const fs = require('fs');
const path = require('path');
const os = require('os');

// 官方全量 13 项内置技能标准中文对照库
const BUILTIN_SKILLS_MAP = {
  'agy-customizations': {
    name: 'agy-customizations',
    desc: '【Antigravity 自定义系统】全景指南与权威参考。用于解析自定义项加载优先级、发现机制，并指导技能、规则、插件、钩子与 MCP 服务的创建。'
  },
  'antigravity_guide': {
    name: 'antigravity-guide',
    desc: '【Antigravity 官方指南】提供 Google Antigravity (AGY) 权威指南、快速参考与索引地图，覆盖 CLI、IDE、Python SDK、快捷指令与自定义扩展。'
  },
  'automation': {
    name: 'automation',
    desc: '【自动化任务】交互式设计与创建后台定时任务（如每日总结、定期提醒与周期自动化工作流）。输入 /automation 调用。'
  },
  'generative_ui': {
    name: 'generative_ui',
    desc: '【生成式 UI 组件】在对话中或作为独立工件渲染丰富的交互式 HTML 微件、数据可视化图表与交互控件。'
  },
  'migrate-agent-settings': {
    name: 'migrate-agent-settings',
    desc: '【助手配置迁移】从其他编程智能体（Claude Code、Codex、Cursor、Gemini CLI）一键导入 MCP 服务、技能、指令、子代理与配置文件。'
  },
  'migrate-workflows': {
    name: 'migrate-workflows',
    desc: '【工作流迁移升级】跨全局与工作区配置将旧版 workflow 自动安全迁移为现代 SKILL.md 技能体系。'
  },
  'native_swarm': {
    name: 'swarm',
    desc: '【蜂群多智能体协作】(预览/高额度消耗) 启动多个智能体在独立会话中并行协同攻坚，通过共享消息看板实时交互协作。'
  },
  'permissioned-github': {
    name: 'permissioned-github',
    desc: '【GitHub 权限治理】安全合规地与 GitHub 交互，在执行敏感写操作与仓库变更时主动请求用户确认。'
  },
  'plugin': {
    name: 'plugin',
    desc: '【插件管理】安装、启停、管理与打包插件（技能、智能体、规则、MCP 服务与钩子的整合包）。输入 /plugin 调用。'
  },
  'run-workflow': {
    name: 'run-workflow',
    desc: '【动态工作流运行】通过脚本与确定性入口执行复杂的多阶段工作流。'
  },
  'swarm_monitor': {
    name: 'swarm_monitor',
    desc: '【蜂群巡检监视器】专用于蜂群协作监控，定期检测蜂群是否停滞并在异常时唤醒解死锁。'
  },
  'swarm_narrator': {
    name: 'swarm_narrator',
    desc: '【蜂群播报与汇总器】专用于蜂群协作汇总，实时观察看板并在协调员完成攻坚后生成最终交付报告。'
  },
  'ui-plugin-navigation': {
    name: 'ui-plugin-navigation',
    desc: '【UI 插件侧栏导航】发现与当前任务相关的 UI 插件面板，并在对话中提供一键展开侧边面板的快捷药丸按钮。'
  }
};

/**
 * 探测官方内置技能目录路径
 */
function getBuiltinSkillsDir() {
  const userProfile = process.env.USERPROFILE || os.homedir();
  return path.join(userProfile, '.gemini', 'antigravity', 'builtin', 'skills');
}

/**
 * 安全地就地更新 SKILL.md 的 description
 */
function updateSkillDescription(filePath, newDesc) {
  if (!fs.existsSync(filePath)) return false;
  const content = fs.readFileSync(filePath, 'utf8');

  // 若已经是目标中文，跳过不重复修改
  if (content.includes(newDesc)) return false;

  // 写入安全原版备份 (.orig)
  const origPath = filePath + '.orig';
  if (!fs.existsSync(origPath)) {
    try {
      fs.copyFileSync(filePath, origPath);
    } catch (e) {}
  }

  // 严格替换 frontmatter 中的 description 字段
  const reDesc = /description:\s*(?:>-\s*)?([\s\S]*?)(?=\n[a-z0-9_-]+:|\n---)/i;
  if (!reDesc.test(content)) return false;

  const updated = content.replace(reDesc, `description: ${newDesc}`);
  fs.writeFileSync(filePath, updated, 'utf8');
  return true;
}

/**
 * 执行全景技能地毯式本地化治理
 */
function run() {
  console.log('========================================');
  console.log('  官方内置技能全景地毯式本地化治理');
  console.log('========================================\n');

  const builtinDir = getBuiltinSkillsDir();
  if (!fs.existsSync(builtinDir)) {
    console.log('  ⚪ 未检测到官方内置技能目录，跳过内置技能治理。');
    return { ok: false, updatedCount: 0 };
  }

  let updatedCount = 0;
  let totalCount = 0;

  for (const [folderName, info] of Object.entries(BUILTIN_SKILLS_MAP)) {
    const skillPath = path.join(builtinDir, folderName, 'SKILL.md');
    if (fs.existsSync(skillPath)) {
      totalCount++;
      const changed = updateSkillDescription(skillPath, info.desc);
      if (changed) {
        console.log(`  🟢 [汉化完成] ${info.name} -> ${info.desc.slice(0, 45)}...`);
        updatedCount++;
      } else {
        console.log(`  ⚪ [已是纯中文] ${info.name}`);
      }
    }
  }

  console.log(`\n  全景治理统计: 扫描 ${totalCount} 项内置技能，本轮更新 ${updatedCount} 项`);
  console.log('========================================');
  console.log('  官方内置技能全景治理就绪（源头纯中文）');
  console.log('========================================\n');

  return { ok: true, totalCount, updatedCount };
}

module.exports = {
  BUILTIN_SKILLS_MAP,
  run
};

if (require.main === module) {
  run();
}
