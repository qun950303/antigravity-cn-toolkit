/**
 * 快捷方式原厂治理模块（统一自适应相对转发）
 */
const path = require('path');
const { getProjectRoot } = require('./run-all');

const PROJECT_ROOT = getProjectRoot();
const shortcutsModule = require(path.join(PROJECT_ROOT, 'src', 'system', 'ensure-shortcuts.js'));

if (require.main === module) {
  shortcutsModule.run();
}

module.exports = shortcutsModule;
