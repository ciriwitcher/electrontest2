const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let serverProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 1080,
    height: 600,
    resizable: false,
    minimizable: false,
    maximizable: false,
    center: true,
    frame: false, // włącz własną ramkę
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.setMenu(null);
  win.loadFile('index.html');
}

app.whenReady().then(() => {
  serverProcess = spawn(process.execPath, [path.join(__dirname, 'server.js')], {
    stdio: 'ignore',
    detached: true,
  });

  serverProcess.unref();

  createWindow();
});

app.on('window-all-closed', () => {
  if (serverProcess && !serverProcess.killed) {
    serverProcess.kill();
  }

  if (process.platform !== 'darwin') {
    app.quit();
  }
});
