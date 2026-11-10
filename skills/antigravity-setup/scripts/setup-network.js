/**
 * 免 TUN 网络模块（统一相对转发）
 * 自适应相对定位，杜绝盘符硬编码
 */
const path = require('path');
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const networkModule = require(path.join(PROJECT_ROOT, 'src', 'network', 'setup-network.js'));

if (require.main === module) {
  networkModule.run().catch(console.error);
}

module.exports = networkModule;
