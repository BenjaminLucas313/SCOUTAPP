const { app, BrowserWindow } = require('electron');
const path = require('path');
const express = require('express');
const http = require('http');

let server = null;
let serverUrl = null;

function startLocalServer() {
  if (serverUrl) return Promise.resolve(serverUrl);

  return new Promise((resolve, reject) => {
    const ex = express();
    const distPath = path.join(__dirname, '..', 'dist');
    const indexPath = path.join(distPath, 'index.html');

    ex.use(express.static(distPath));

    ex.use((req, res) => {
      if (path.extname(req.path) !== '') {
        return res.status(404).send('Asset not found');
      }
      return res.sendFile(indexPath);
    });

    server = http.createServer(ex);
    server.on('error', reject);

    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      serverUrl = `http://127.0.0.1:${port}`;
      console.log(`Servidor local en ${serverUrl}`);
      resolve(serverUrl);
    });
  });
}

async function createWindow() {
  const startUrl = await startLocalServer();

  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    autoHideMenuBar: true,
    backgroundColor: '#0b1220',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  await win.loadURL(startUrl);
}

app.whenReady().then(createWindow);

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (server) server.close();
    app.quit();
  }
});
