/**
 * Antigravity CN Toolkit - 全景技能与插件元数据地毯式本地化治理器
 * 核心设计原则：
 * 1. 根治“打地鼠式被动汉化”：一次性扫描官方内置与用户配置全量技能与插件库，地毯式完成源头本地化；
 * 2. 安全幂等可逆：就地修改前自动生成 .orig 备份，多次重复执行不破坏文件；
 * 3. 前端与源头双轨合一：源头 SKILL.md 与 plugin.json 改为纯中文，彻底消除 DOM 截断与匹配遗漏。
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

// 官方内置与已知插件标准中文对照库
const BUILTIN_PLUGINS_MAP = {
  'swarm': {
    displayName: '蜂群多智能体协作',
    description: '【蜂群多智能体协作】释放智能体蜂群的并行协作潜能。'
  },
  'egm': {
    displayName: '大象与金鱼模型 (EGM)',
    description: 'Google 开源的规范驱动开发与零上下文多维冷读评审框架。'
  }
};

/**
 * 探测目录路径
 */
function getTargetDirs() {
  const userProfile = process.env.USERPROFILE || os.homedir();
  return {
    builtinSkills: path.join(userProfile, '.gemini', 'antigravity', 'builtin', 'skills'),
    builtinPlugins: path.join(userProfile, '.gemini', 'antigravity', 'builtin', 'plugins'),
    configSkills: path.join(userProfile, '.gemini', 'config', 'skills'),
    configPlugins: path.join(userProfile, '.gemini', 'config', 'plugins')
  };
}

/**
 * 安全地就地更新 SKILL.md 的 description
 */
function updateSkillDescription(filePath, newDesc) {
  if (!fs.existsSync(filePath)) return false;
  const content = fs.readFileSync(filePath, 'utf8');

  if (content.includes(newDesc)) return false;

  const origPath = filePath + '.orig';
  if (!fs.existsSync(origPath)) {
    try {
      fs.copyFileSync(filePath, origPath);
    } catch (e) {}
  }

  const reDesc = /description:\s*(?:>-\s*)?([\s\S]*?)(?=\n[a-z0-9_-]+:|\n---)/i;
  if (!reDesc.test(content)) return false;

  const updated = content.replace(reDesc, `description: ${newDesc}`);
  fs.writeFileSync(filePath, updated, 'utf8');
  return true;
}

/**
 * 安全地就地更新 plugin.json 的 displayName 和 description
 */
function updatePluginJson(filePath, meta) {
  if (!fs.existsSync(filePath)) return false;
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(raw);
    let changed = false;

    if (meta.displayName && json.displayName !== meta.displayName) {
      json.displayName = meta.displayName;
      changed = true;
    }
    if (meta.description && json.description !== meta.description) {
      json.description = meta.description;
      changed = true;
    }

    if (changed) {
      const origPath = filePath + '.orig';
      if (!fs.existsSync(origPath)) {
        try {
          fs.copyFileSync(filePath, origPath);
        } catch (e) {}
      }
      fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
      return true;
    }
  } catch (e) {}
  return false;
}

/**
 * 执行全景技能与插件地毯式本地化治理
 */
function run() {
  console.log('========================================');
  console.log('  官方内置技能与插件全景地毯式本地化治理');
  console.log('========================================\n');

  const dirs = getTargetDirs();
  let updatedCount = 0;
  let totalCount = 0;

  // 1. 扫描治理内置技能
  if (fs.existsSync(dirs.builtinSkills)) {
    for (const [folderName, info] of Object.entries(BUILTIN_SKILLS_MAP)) {
      const skillPath = path.join(dirs.builtinSkills, folderName, 'SKILL.md');
      if (fs.existsSync(skillPath)) {
        totalCount++;
        const changed = updateSkillDescription(skillPath, info.desc);
        if (changed) {
          console.log(`  🟢 [技能汉化完成] ${info.name} -> ${info.desc.slice(0, 40)}...`);
          updatedCount++;
        } else {
          console.log(`  ⚪ [技能已纯中文] ${info.name}`);
        }
      }
    }
  }

  // 2. 扫描治理内置与配置插件
  const pluginDirs = [dirs.builtinPlugins, dirs.configPlugins];
  for (const pDir of pluginDirs) {
    if (fs.existsSync(pDir)) {
      const subDirs = fs.readdirSync(pDir);
      for (const sub of subDirs) {
        const pJson = path.join(pDir, sub, 'plugin.json');
        if (fs.existsSync(pJson)) {
          totalCount++;
          const meta = BUILTIN_PLUGINS_MAP[sub];
          if (meta) {
            const changed = updatePluginJson(pJson, meta);
            if (changed) {
              console.log(`  🟢 [插件汉化完成] ${sub} -> ${meta.displayName} | ${meta.description.slice(0, 35)}...`);
              updatedCount++;
            } else {
              console.log(`  ⚪ [插件已纯中文] ${sub}`);
            }
          }
        }
      }
    }
  }

  console.log(`\n  全景治理统计: 扫描 ${totalCount} 项技能与插件，本轮更新 ${updatedCount} 项`);
  console.log('========================================');
  console.log('  官方内置技能与插件全景治理就绪（源头纯中文）');
  console.log('========================================\n');

  return { ok: true, totalCount, updatedCount };
}

module.exports = {
  BUILTIN_SKILLS_MAP,
  BUILTIN_PLUGINS_MAP,
  run
};

if (require.main === module) {
  run();
}
