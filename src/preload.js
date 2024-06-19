const { contextBridge, ipcRenderer } = require("electron");
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };
});

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke("ping"),
  loadSettings: () => ipcRenderer.invoke("loadSettings"),
  saveSettings: (value) => ipcRenderer.send("saveSettings", value),
  onrequestconfig: (callback) =>
    ipcRenderer.on("request-config", (_event, value) => callback(value)),
});
