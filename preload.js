// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

const { contextBridge, ipcRenderer } = require("electron");
const ipc = {
  openDevTools: function () { ipcRenderer.send('open-dev-tools'); },
};
for (let method of ['on', 'once', 'removeListener', 'removeAllListeners', 'send', 'invoke']) {
  ipc[method] = function(...args) {
    return ipcRenderer[method](...args);
  };
}
contextBridge.exposeInMainWorld("ipc", ipc);
