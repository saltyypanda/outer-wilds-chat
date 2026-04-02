const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('outerWildsAPI', {
  appName: 'Outer Wilds Chat Overlay'
});
