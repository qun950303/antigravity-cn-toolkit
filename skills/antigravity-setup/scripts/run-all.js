/**
 * Antigravity 终极一键配置套件（免 TUN 网络 + 全中文汉化 + 快捷方式治理）
 */
const { run: runNetwork } = require('./setup-network');
const { run: runI18n } = require('./patch-i18n');
const { run: runShortcuts } = require('./ensure-shortcuts');

async function main() {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║       Google Antigravity 全模块一键配置与健康体检总控          ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  try {
    // 步骤一：网络环境治理
    await runNetwork();
    console.log('\n');

    // 步骤二：全中文汉化与静态持久化
    runI18n();
    console.log('\n');

    // 步骤三：快捷方式原厂直连与桌面合规
    runShortcuts();
    console.log('\n');

    console.log('🎉 全部配置已 100% 成功执行！系统已处于完全零维护、纯中文、免 TUN 出海最佳状态。');
  } catch (err) {
    console.error('❌ 执行过程中遇到异常:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
