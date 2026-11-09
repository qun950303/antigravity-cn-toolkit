/**
 * Antigravity 终极一键配置套件（统一转发主工程唯一源）
 * 单真实源：D:\antigravity-cn-toolkit\src\index.js
 */
const { main } = require('D:/antigravity-cn-toolkit/src/index.js');

if (require.main === module) {
  main();
}

module.exports = { main };
