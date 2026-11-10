/**
 * 完全体汉化引擎模块（统一相对转发）
 * 自适应相对定位，杜绝盘符硬编码
 */
const path = require('path');
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const i18nModule = require(path.join(PROJECT_ROOT, 'src', 'i18n', 'patch-i18n.js'));

if (require.main === module) {
  i18nModule.run().catch(console.error);
}

module.exports = i18nModule;
