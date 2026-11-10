#!/usr/bin/env node
/**
 * Antigravity CN Toolkit - Unified CLI Entrypoint
 * 一键集成控制：出海网络环境治理、全界面完全体纯净汉化、官方原厂直连快捷方式维护
 */
const { run: runNetwork } = require('./network/setup-network');
const { run: runI18n } = require('./i18n/patch-i18n');
const { run: runShortcuts } = require('./system/ensure-shortcuts');
const { run: runLocalizeSkills } = require('./system/localize-skills');

async function main() {
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║               Antigravity CN Toolkit (一键总控)                ║');
  console.log('║      Google Antigravity 中文本地化与免 TUN 出海全能工具箱     ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');

  const summary = {
    network: null,
    i18n: null,
    shortcuts: null,
    skills: null
  };

  // 步骤一：网络环境检测与配置
  try {
    const netRes = await runNetwork();
    summary.network = { ok: true, data: netRes };
  } catch (err) {
    summary.network = { ok: false, error: err.message };
    console.error('❌ 网络环境步骤异常:', err.message);
  }
  console.log('\n');

  // 步骤二：双轨制汉化注入与 ASAR 持久化打包
  try {
    const i18nRes = await runI18n();
    summary.i18n = { ok: true, data: i18nRes };
  } catch (err) {
    summary.i18n = { ok: false, error: err.message };
    console.error('❌ 汉化注入步骤异常:', err.message);
  }
  console.log('\n');

  // 步骤三：官方原厂快捷方式合规治理
  try {
    const scRes = runShortcuts();
    summary.shortcuts = { ok: true, data: scRes };
  } catch (err) {
    summary.shortcuts = { ok: false, error: err.message };
    console.error('❌ 快捷方式步骤异常:', err.message);
  }
  console.log('\n');

  // 步骤四：官方内置技能全景地毯式本地化治理
  try {
    const skRes = runLocalizeSkills();
    summary.skills = { ok: true, data: skRes };
  } catch (err) {
    summary.skills = { ok: false, error: err.message };
    console.error('❌ 技能全景本地化步骤异常:', err.message);
  }
  console.log('\n');

  console.log('========================================');
  console.log('            全局执行结果汇总            ');
  console.log('========================================');
  console.log(`[1] 网络环境配置: ${summary.network?.ok ? '🟢 成功' : '🔴 失败 (' + summary.network?.error + ')'}`);
  console.log(`[2] 完全体汉化引擎: ${summary.i18n?.ok ? '🟢 成功' : '🔴 失败 (' + summary.i18n?.error + ')'}`);
  console.log(`[3] 原厂快捷方式: ${summary.shortcuts?.ok ? '🟢 成功' : '🔴 失败 (' + summary.shortcuts?.error + ')'}`);
  console.log(`[4] 内置技能全景汉化: ${summary.skills?.ok ? '🟢 成功' : '🔴 失败 (' + summary.skills?.error + ')'}`);

  const allSuccess = summary.network?.ok && summary.i18n?.ok && summary.shortcuts?.ok && summary.skills?.ok;
  if (allSuccess) {
    console.log('\n🎉 [Antigravity CN Toolkit] 全套配置已成功完成！');
    console.log('💡 随时在 Antigravity 中输入 /antigravity-setup 调用专属 Skill 进行健康自检。');
  } else {
    console.log('\n⚠️ 部分步骤未达标，请查看上方详细输出并根据提示修复。');
  }

  return summary;
}

if (require.main === module) {
  main().then((summary) => {
    const allOk = summary.network?.ok && summary.i18n?.ok && summary.shortcuts?.ok;
    if (!allOk) process.exitCode = 1;
  });
}

module.exports = { main };
