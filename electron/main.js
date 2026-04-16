const { app, BrowserWindow } = require('electron');
const path = require('path');
const express = require('express');
const http = require('http');

let server;

function startLocalServer() {
  return new Promise((resolve, reject) => {
    const ex = express();
    const distPath = path.join(__dirname, '..', 'dist');
    const indexPath = path.join(distPath, 'index.html');

    ex.use(express.static(distPath));

    // Fallback para SPA, sin usar "*"
    ex.use((req, res) => {
      const hasExtension = path.extname(req.path) !== '';

      if (hasExtension) {
        return res.status(404).send('Asset not found');
      }

      return res.sendFile(indexPath);
    });

    server = http.createServer(ex);

    server.on('error', (err) => reject(err));

    server.listen(4123, () => {
      console.log('Servidor local en http://localhost:4123');
      resolve('http://localhost:4123');
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
    },
  });

  await win.loadURL(startUrl);
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
  if (server) server.close();

  if (process.platform !== 'darwin') {
    app.quit();
  }
});