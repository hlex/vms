const ipc = require('electron').ipcRenderer;

window.closeApp = function (args) {
  ipc.send('close-app', args);
  window.close();
};
