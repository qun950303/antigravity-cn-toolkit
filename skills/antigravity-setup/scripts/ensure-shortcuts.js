/**
 * 快捷方式原厂治理模块（统一相对转发）
 * 自适应相对定位，杜绝盘符硬编码
 */
const path = require('path');
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const shortcutsModule = require(path.join(PROJECT_ROOT, 'src', 'system', 'ensure-shortcuts.js'));

if (require.main === module) {
  shortcutsModule.run();
}

module.exports = shortcutsModule;
