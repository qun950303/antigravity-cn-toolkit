#!/usr/bin/env node
/**
 * Antigravity CN Toolkit - Unified CLI Entrypoint
 */
const { run: runNetwork } = require('./network/setup-network');
const { run: runI18n } = require('./i18n/patch-i18n');
const { run: runShortcuts } = require('./system/ensure-shortcuts');

async function main() {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║               Antigravity CN Toolkit (一键总控)                ║');
  console.log('║       Google Antigravity 中文本地化与免 TUN 出海全能工具箱     ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  try {
    // 步骤一：网络环境检测与配置
    await runNetwork();
    console.log('\n');

    // 步骤二：双轨制汉化注入与 ASAR 持久化打包
    runI18n();
    console.log('\n');

    // 步骤三：官方原厂快捷方式合规治理
    runShortcuts();
    console.log('\n');

    console.log('🎉 [Antigravity CN Toolkit] 全套配置已成功完成！');
    console.log('💡 随时在 Antigravity 中输入 /antigravity-setup 调用专属 Skill 进行健康自检。');
  } catch (err) {
    console.error('❌ 执行失败:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
