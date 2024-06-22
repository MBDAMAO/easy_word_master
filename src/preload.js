const {contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld("commonAPI", {
    loadSettings: () => ipcRenderer.invoke("loadSettings"),

    voice: (value) => ipcRenderer.send("voice", value),
    onGetVoice: (callback) =>
        ipcRenderer.on("voice-reply", (_event, value) => callback(value)),

    saveSettings: (value) => ipcRenderer.send("saveSettings", value),
    createMenu: (value) => ipcRenderer.send("createMenu", value),

    onrequestconfig: (callback) =>
        ipcRenderer.on("request-config", (_event, value) => callback(value)),
    updateTheme: (callback) =>
        ipcRenderer.on("update_theme", (_event, value) => callback(value)),
    updateDelayTime: (callback) =>
        ipcRenderer.on("update_delay_time", (_event, value) => callback(value)),
    setAutoPlay: (callback) =>
        ipcRenderer.on("setAutoPlay", (_event, value) => callback(value)),
    setRandPlay: (callback) =>
        ipcRenderer.on("setRandPlay", (_event, value) => callback(value)),
    setAutoVoice: (callback) =>
        ipcRenderer.on("setAutoVoice", (_event, value) => callback(value)),

    setDefaultSettings: (callback) =>
        ipcRenderer.on("setDefaultSettings", (_event, value) => callback(value)),
    setDefaultEvent: () => ipcRenderer.send("setDefaultEvent"),
});

contextBridge.exposeInMainWorld("resourceAPI", {
    loadDict: (dict) => ipcRenderer.send("loadDict", dict),
    onLoadDict: (callback) =>
        ipcRenderer.on("loadDict-reply", (_event, value) => callback(value)),

    getWord: (word) => ipcRenderer.send("getWord", word),
    onGetWord: (callback) =>
        ipcRenderer.on("getWord-reply", (_event, value) => callback(value)),

    beforeUpdataSelectedBook: (callback) =>
        ipcRenderer.on("update_selected_book", (_event, value) => callback(value)),

    saveWord: (word) => ipcRenderer.send("saveWord", word),
    onSaveWord: (callback) =>
        ipcRenderer.on("saveWord-reply", (_event, value) => callback(value)),
});
