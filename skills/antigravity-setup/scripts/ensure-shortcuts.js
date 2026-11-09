/**
 * 快捷方式原厂治理模块（统一转发主工程唯一源）
 * 单真实源：D:\antigravity-cn-toolkit\src\system\ensure-shortcuts.js
 */
const shortcutsModule = require('D:/antigravity-cn-toolkit/src/system/ensure-shortcuts.js');

if (require.main === module) {
  shortcutsModule.run();
}

module.exports = shortcutsModule;
