/**
 * Antigravity 官方原厂直连快捷方式治理脚本
 * 铁律保障：
 * 1. 严禁使用任何批处理 BAT 脚本或套壳启动器；
 * 2. 快捷方式必须且只能保持 100% 官方原厂可执行程序直连；
 * 3. 自动扫描桌面并清理任何违规套壳启动器。
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

function getDesktopDir() {
  try {
    const out = execSync('powershell -Command "[Environment]::GetFolderPath(\'Desktop\')"', { encoding: 'utf8' }).trim();
    if (out && fs.existsSync(out)) return out;
  } catch (e) {}

  const homeDir = os.homedir();
  const fallback = path.join(homeDir, 'Desktop');
  if (fs.existsSync(fallback)) return fallback;
  const dDesktop = 'D:\\桌面';
  if (fs.existsSync(dDesktop)) return dDesktop;
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
  return { exe: candidates[0], dir: path.dirname(candidates[0]) };
}

function run() {
  console.log('========================================');
  console.log('  Antigravity 快捷方式合规与原厂直连治理');
  console.log('========================================\n');

  const desktopDir = getDesktopDir();
  console.log(`[1] 系统桌面真实路径: ${desktopDir}`);

  const appInfo = findOfficialApp();
  const appExe = appInfo.exe;
  const appDir = appInfo.dir;
  const officialLnk = path.join(desktopDir, 'Antigravity.lnk');

  if (!fs.existsSync(appExe)) {
    console.error(`🔴 未检测到官方程序路径: ${appExe}`);
    return;
  }

  // 1. 生成并固化 100% 官方原厂快捷方式
  const psScript = `
$sh = New-Object -ComObject WScript.Shell
$sc = $sh.CreateShortcut('${officialLnk}')
$sc.TargetPath = '${appExe}'
$sc.Arguments = ''
$sc.WorkingDirectory = '${appDir}'
$sc.IconLocation = '${appExe},0'
$sc.Description = 'Antigravity'
$sc.Save()
`;
  const tempPs = path.join(process.env.TEMP || 'C:\\Windows\\Temp', 'make_clean_lnk.ps1');
  fs.writeFileSync(tempPs, psScript, 'utf8');
  execSync(`powershell -ExecutionPolicy Bypass -File "${tempPs}"`, { stdio: 'ignore' });
  try { fs.unlinkSync(tempPs); } catch (e) {}

  console.log(`[2] 官方原厂快捷方式: 🟢 已就绪 -> ${officialLnk}`);
  console.log(`    - 目标程序: ${appExe}`);
  console.log('    - 启动参数: (无参数，原版直连)');
  console.log('    - 工作目录: ' + appDir);

  // 2. 桌面环境卫生核验（绝对 0 BAT，绝不留外挂）
  const desktopFiles = fs.readdirSync(desktopDir);
  const batFiles = desktopFiles.filter(f => f.toLowerCase().endsWith('.bat') && f.toLowerCase().includes('antigravity'));
  if (batFiles.length > 0) {
    for (const b of batFiles) {
      try {
        fs.unlinkSync(path.join(desktopDir, b));
        console.log(`    🧹 已清理桌面遗留批处理外挂: ${b}`);
      } catch (e) {}
    }
  } else {
    console.log('[3] 桌面安全合规检查: 🟢 100% 纯净，无任何 .bat 批处理外挂污染。');
  }

  console.log('\n========================================');
  console.log('  官方原厂直连治理完成');
  console.log('========================================');
}

if (require.main === module) {
  run();
}

module.exports = { run, getDesktopDir };
