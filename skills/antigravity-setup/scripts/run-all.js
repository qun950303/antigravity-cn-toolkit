/**
 * Antigravity 终极一键配置套件（统一转发主工程入口）
 * 自适应相对定位，杜绝盘符硬编码
 */
const path = require('path');
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const { main } = require(path.join(PROJECT_ROOT, 'src', 'index.js'));

if (require.main === module) {
  main();
}

module.exports = { main };
