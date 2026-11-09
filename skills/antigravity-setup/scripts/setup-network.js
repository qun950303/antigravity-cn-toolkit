/**
 * Antigravity 免 TUN 模式网络环境自动化配置与体检工具
 * 适用场景：用户要求不开启 TUN 虚拟网卡，通过 10808 本地代理端口实现 Antigravity 全模块出海
 */
const net = require('net');
const http = require('http');
const https = require('https');
const { execSync } = require('child_process');

async function checkPort(port, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const sock = new net.Socket();
    sock.setTimeout(1200);
    sock.on('connect', () => {
      sock.destroy();
      resolve(true);
    });
    sock.on('error', () => resolve(false));
    sock.on('timeout', () => {
      sock.destroy();
      resolve(false);
    });
    sock.connect(port, host);
  });
}

function ensureEnv(name, value) {
  try {
    const cur = execSync(`reg query HKCU\\Environment /v ${name}`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    if (cur && cur.includes(value)) {
      return { name, status: '已配置', value };
    }
  } catch (e) {}

  // 写入注册表
  execSync(`setx ${name} "${value}"`, { stdio: 'ignore' });
  return { name, status: '已更新', value };
}

async function testHttpThroughProxy(proxyHost, proxyPort) {
  return new Promise((resolve) => {
    const req = http.request({
      host: proxyHost,
      port: proxyPort,
      path: 'http://www.google.com/generate_204',
      method: 'GET',
      timeout: 3000,
      headers: { Host: 'www.google.com' }
    }, (res) => {
      resolve({ ok: res.statusCode === 204 || (res.statusCode >= 200 && res.statusCode < 400), code: res.statusCode });
    });
    req.on('error', (err) => resolve({ ok: false, error: err.message }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ ok: false, error: '连接超时' });
    });
    req.end();
  });
}

async function run() {
  console.log('========================================');
  console.log('  Antigravity 免 TUN 网络环境体检与配置');
  console.log('========================================\n');

  const proxyPort = 10808;
  const proxyHost = '127.0.0.1';

  // 1. 检测本地代理端口
  const isPortOpen = await checkPort(proxyPort, proxyHost);
  console.log(`[1] 本地出海代理端口 (${proxyHost}:${proxyPort}): ${isPortOpen ? '🟢 正在监听，畅通无阻' : '🔴 未监听到服务，请确保 Xray/V2Ray 核心已启动'}`);

  // 2. 检查并固化用户级环境变量
  const envResults = [
    ensureEnv('HTTP_PROXY', `http://${proxyHost}:${proxyPort}`),
    ensureEnv('HTTPS_PROXY', `http://${proxyHost}:${proxyPort}`),
    ensureEnv('ALL_PROXY', `socks5://${proxyHost}:${proxyPort}`)
  ];

  console.log('\n[2] 用户级环境变量代理通道配置:');
  for (const r of envResults) {
    console.log(`    - ${r.name}: ${r.value} [${r.status}]`);
  }

  // 3. 连通性测试
  console.log('\n[3] 代理节点出海连通性验证:');
  if (isPortOpen) {
    const testRes = await testHttpThroughProxy(proxyHost, proxyPort);
    if (testRes.ok) {
      console.log(`    🟢 测试通过！状态码: ${testRes.code}，免 TUN 代理完全正常，无需虚拟网卡。`);
    } else {
      console.log(`    🟡 代理端口已连接，但目标请求返回: ${testRes.error || testRes.code}（请检查节点网络状态）。`);
    }
  } else {
    console.log('    ⚠️ 端口未开放，跳过外网探测。');
  }

  console.log('\n========================================');
  console.log('  免 TUN 网络配置检查完成');
  console.log('========================================');
}

if (require.main === module) {
  run().catch(console.error);
}

module.exports = { run, checkPort, ensureEnv };
