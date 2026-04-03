const path = require("path");
const { app, BrowserWindow } = require("electron");

require("electron-reload")(path.join(__dirname, ".."));

function createWindow() {
  const win = new BrowserWindow({
    width: 520,
    height: 360,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.cjs'),
    }
  });

  win.loadFile(path.join(__dirname, "..", "src", "index.html"));
  win.setPosition(1350, 100);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
