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
  createMenu: (value) => ipcRenderer.send("createMenu", value),
  updateTheme: (callback) =>
    ipcRenderer.on("update_theme", (_event, value) => callback(value)),
  updateDelayTime: (callback) =>
    ipcRenderer.on("update_delay_time", (_event, value) => callback(value)),
  setAutoPlay: (callback) =>
    ipcRenderer.on("setAutoPlay", (_event, value) => callback(value)),
  setRandPlay: (callback) =>
    ipcRenderer.on("setRandPlay", (_event, value) => callback(value)),
  setDefaultSettings: (callback) =>
    ipcRenderer.on("setDefaultSettings", (_event, value) => callback(value)),
  setDefault: (value) => ipcRenderer.send("setDefault", value),
});
