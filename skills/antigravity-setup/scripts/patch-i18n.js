/**
 * 完全体汉化引擎模块（统一转发主工程唯一源）
 * 单真实源：D:\antigravity-cn-toolkit\src\i18n\patch-i18n.js
 */
const i18nModule = require('D:/antigravity-cn-toolkit/src/i18n/patch-i18n.js');

if (require.main === module) {
  i18nModule.run().catch(console.error);
}

module.exports = i18nModule;
