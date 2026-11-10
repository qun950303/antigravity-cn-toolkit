/**
 * Antigravity 终极一键配置套件（统一转发主工程入口）
 * 智能双模寻根：自动逐级向上探测主工程目录，杜绝层级写死
 */
const fs = require('fs');
const path = require('path');

function getProjectRoot() {
  let cur = __dirname;
  for (let i = 0; i < 5; i++) {
    if (fs.existsSync(path.join(cur, 'src', 'index.js')) && fs.existsSync(path.join(cur, 'package.json'))) {
      return cur;
    }
    const parent = path.dirname(cur);
    if (parent === cur) break;
    cur = parent;
  }
  return path.resolve(__dirname, '..', '..', '..');
}

const PROJECT_ROOT = getProjectRoot();
const { main } = require(path.join(PROJECT_ROOT, 'src', 'index.js'));

if (require.main === module) {
  main();
}

module.exports = { main, getProjectRoot };
