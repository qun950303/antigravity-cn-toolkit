/**
 * Antigravity 免 TUN 模式网络环境自动化配置与体检工具
 * 适用场景：通过本地代理端口（默认 10808）实现全模块出海，杜绝端口未开盲目配置导致断网
 */
const net = require('net');
const http = require('http');
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
      return { name, status: '已配置', value, changed: false };
    }
  } catch (e) {}

  // 写入注册表用户环境变量
  try {
    execSync(`setx ${name} "${value}"`, { stdio: 'ignore' });
    return { name, status: '已更新', value, changed: true };
  } catch (e) {
    return { name, status: '写入失败: ' + e.message, value, changed: false };
  }
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

async function run(options = {}) {
  console.log('========================================');
  console.log('  Antigravity 免 TUN 网络环境体检与配置');
  console.log('========================================\n');

  const proxyPort = options.port || 10808;
  const proxyHost = options.host || '127.0.0.1';

  // 1. 严格优先检测本地代理端口
  const isPortOpen = await checkPort(proxyPort, proxyHost);
  console.log(`[1] 本地出海代理端口 (${proxyHost}:${proxyPort}): ${isPortOpen ? '🟢 正在监听，畅通无阻' : '🔴 未监听到服务，请确保 Xray/V2Ray 代理客户端已启动'}`);

  let testRes = { ok: false };
  if (isPortOpen) {
    testRes = await testHttpThroughProxy(proxyHost, proxyPort);
    if (testRes.ok) {
      console.log(`[2] 代理节点出海验证: 🟢 测试通过！状态码: ${testRes.code}，免 TUN 代理完全正常。`);
    } else {
      console.log(`[2] 代理节点出海验证: 🟡 端口已连通，但外网探测返回: ${testRes.error || testRes.code}（请检查节点节点订阅）。`);
    }
  } else {
    console.log('[2] 代理节点出海验证: ⚠️ 端口未开放，跳过外网探测。');
  }

  // 2. 只有在代理端口开放时才固化环境变量，严禁盲目配置导致用户断网
  if (isPortOpen) {
    const envResults = [
      ensureEnv('HTTP_PROXY', `http://${proxyHost}:${proxyPort}`),
      ensureEnv('HTTPS_PROXY', `http://${proxyHost}:${proxyPort}`),
      ensureEnv('ALL_PROXY', `socks5://${proxyHost}:${proxyPort}`)
    ];

    console.log('\n[3] 用户级环境变量代理通道配置:');
    for (const r of envResults) {
      console.log(`    - ${r.name}: ${r.value} [${r.status}]`);
    }
  } else {
    console.log('\n[3] 用户环境变量安全保护: 🛡️ 因代理端口未开启，已跳过写入代理环境变量，避免导致整机断网。');
  }

  console.log('\n========================================');
  console.log('  免 TUN 网络配置检查完成');
  console.log('========================================');

  return {
    ok: isPortOpen && testRes.ok,
    portOpen: isPortOpen,
    connected: testRes.ok
  };
}

if (require.main === module) {
  run().catch(console.error);
}

module.exports = { run, checkPort, testHttpThroughProxy, ensureEnv };
