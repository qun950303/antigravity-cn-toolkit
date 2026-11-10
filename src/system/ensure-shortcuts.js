/**
 * Antigravity 官方原厂直连快捷方式治理脚本
 * 铁律保障：
 * 1. 快捷方式必须且只能保持 100% 官方原厂可执行程序直连；
 * 2. 严禁任何脚本套壳；
 * 3. 尊重用户个人数据，绝不静默删除用户的自定义批处理脚本。
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

function getDesktopDir() {
  try {
    const out = execSync('powershell -Command "[Environment]::GetFolderPath(\'Desktop\')"', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    if (out && fs.existsSync(out)) return out;
  } catch (e) {}

  const homeDir = os.homedir();
  const dDesktop = 'D:\\桌面';
  if (fs.existsSync(dDesktop)) return dDesktop;
  const fallback = path.join(homeDir, 'Desktop');
  if (fs.existsSync(fallback)) return fallback;
  return path.join(process.env.USERPROFILE || homeDir, 'Desktop');
}

function findOfficialApp() {
  const homeDir = os.homedir();
  const localAppData = process.env.LOCALAPPDATA || path.join(homeDir, 'AppData', 'Local');
  const candidates = [
    path.join(localAppData, 'Programs', 'antigravity', 'Antigravity.exe'),
    path.join(localAppData, 'Programs', 'Antigravity', 'Antigravity.exe'),
    path.join(process.env.PROGRAMFILES || 'C:\\Program Files', 'antigravity', 'Antigravity.exe'),
    path.join(process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)', 'antigravity', 'Antigravity.exe'),
    'D:\\antigravity\\Antigravity.exe'
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      return { exe: c, dir: path.dirname(c) };
    }
  }
  return null;
}

function run() {
  console.log('========================================');
  console.log('  Antigravity 快捷方式合规与原厂直连治理');
  console.log('========================================\n');

  const desktopDir = getDesktopDir();
  console.log(`[1] 系统桌面真实路径: ${desktopDir}`);

  const appInfo = findOfficialApp();
  if (!appInfo) {
    console.error('🔴 未在常见路径检测到官方 Antigravity 程序，已跳过生成快捷方式。');
    return { ok: false, error: '程序未安装' };
  }

  const appExe = appInfo.exe;
  const appDir = appInfo.dir;
  const officialLnk = path.join(desktopDir, 'Antigravity.lnk');

  // 1. 生成并固化 100% 官方原厂快捷方式（使用安全的 JSON 转义传递参数）
  const tempPs = path.join(os.tmpdir(), `make_clean_lnk_${Date.now()}.ps1`);
  try {
    const psScript = `
$sh = New-Object -ComObject WScript.Shell
$sc = $sh.CreateShortcut([System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('${Buffer.from(officialLnk, 'utf8').toString('base64')}')))
$sc.TargetPath = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('${Buffer.from(appExe, 'utf8').toString('base64')}'))
$sc.Arguments = ''
$sc.WorkingDirectory = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('${Buffer.from(appDir, 'utf8').toString('base64')}'))
$sc.IconLocation = "$($sc.TargetPath),0"
$sc.Description = 'Antigravity (官方原厂直连)'
$sc.Save()
`;
    fs.writeFileSync(tempPs, psScript, 'utf8');
    execSync(`powershell -ExecutionPolicy Bypass -File "${tempPs}"`, { stdio: 'ignore' });
    console.log(`[2] 官方原厂快捷方式: 🟢 已就绪 -> ${officialLnk}`);
    console.log(`    - 目标程序: ${appExe}`);
    console.log('    - 启动参数: (无参数，原版直连)');
    console.log('    - 工作目录: ' + appDir);
  } catch (e) {
    console.error('🔴 快捷方式生成异常: ' + e.message);
  } finally {
    try { if (fs.existsSync(tempPs)) fs.unlinkSync(tempPs); } catch (e) {}
  }

  // 2. 桌面环境卫生核验（安全提示，绝不静默删除用户脚本）
  try {
    const desktopFiles = fs.readdirSync(desktopDir);
    const batFiles = desktopFiles.filter(f => f.toLowerCase().endsWith('.bat') && f.toLowerCase().includes('antigravity'));
    if (batFiles.length > 0) {
      console.log(`[3] 桌面脚本安全提示: 🟡 发现存在批处理脚本: ${batFiles.join(', ')}（建议优先使用原版直连快捷方式）。`);
    } else {
      console.log('[3] 桌面安全合规检查: 🟢 100% 纯净，无外挂批处理启动器。');
    }
  } catch (e) {
    console.log('[3] 桌面目录扫描提示: ' + e.message);
  }

  console.log('\n========================================');
  console.log('  官方原厂直连治理完成');
  console.log('========================================');

  return { ok: true, lnk: officialLnk };
}

if (require.main === module) {
  run();
}

module.exports = { run, getDesktopDir, findOfficialApp };
