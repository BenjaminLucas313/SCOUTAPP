const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  appName: 'Scout App',
})