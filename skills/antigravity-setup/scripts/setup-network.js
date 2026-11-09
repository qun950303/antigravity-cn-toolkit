/**
 * 免 TUN 网络模块（统一转发主工程唯一源）
 * 单真实源：D:\antigravity-cn-toolkit\src\network\setup-network.js
 */
const networkModule = require('D:/antigravity-cn-toolkit/src/network/setup-network.js');

if (require.main === module) {
  networkModule.run().catch(console.error);
}

module.exports = networkModule;
