/**
 * 完全体汉化引擎模块（统一自适应相对转发）
 */
const path = require('path');
const { getProjectRoot } = require('./run-all');

const PROJECT_ROOT = getProjectRoot();
const i18nModule = require(path.join(PROJECT_ROOT, 'src', 'i18n', 'patch-i18n.js'));

if (require.main === module) {
  i18nModule.run().catch(console.error);
}

module.exports = i18nModule;
