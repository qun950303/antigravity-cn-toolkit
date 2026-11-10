/**
 * 免 TUN 网络模块（统一自适应相对转发）
 */
const path = require('path');
const { getProjectRoot } = require('./run-all');

const PROJECT_ROOT = getProjectRoot();
const networkModule = require(path.join(PROJECT_ROOT, 'src', 'network', 'setup-network.js'));

if (require.main === module) {
  networkModule.run().catch(console.error);
}

module.exports = networkModule;
