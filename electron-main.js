import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function create() {
  const win = new BrowserWindow({
    width: 1280, height: 800,
    title: 'SEMIDEUS: Ecos do Olimpo',
    backgroundColor: '#070d1f',
    autoHideMenuBar: true,
  });
  win.maximize();
  // Roda o build local (npm run build primeiro)
  win.loadFile(path.join(__dirname, 'dist', 'index.html'));
}
app.whenReady().then(create);
app.on('window-all-closed', () => app.quit());
