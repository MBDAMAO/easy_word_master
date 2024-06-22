const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  loadSettings: () => ipcRenderer.invoke("loadSettings"),
  voice: (value) => ipcRenderer.send("voice", value),
  onGetvoice: (callback) =>
    ipcRenderer.on("voice-reply", (_event, value) => callback(value)),
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

  setDefaultEvent: () => ipcRenderer.send("setDefaultEvent"),
});

contextBridge.exposeInMainWorld("resourceAPI", {
  loadDict: (dict) => ipcRenderer.send("loadDict", dict),
  onLoadDict: (callback) =>
    ipcRenderer.on("loadDict-reply", (_event, value) => callback(value)),
  getWord: (dict) => ipcRenderer.send("getWord", dict),
  onGetWord: (callback) =>
    ipcRenderer.on("getWord-reply", (_event, value) => callback(value)),
});
