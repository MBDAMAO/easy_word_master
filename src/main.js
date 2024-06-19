const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const { loadDict, saveUserSettings, loadUserSettings } = require("./load");
const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 500,
    minWidth: 300,
    minHeight: 70,
    maxHeight: 70,
    maxWidth: 300,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  // win.webContents.openDevTools();
  win.on("close", () => {
    console.log("close!");
    win.webContents.send("request-config");
  });
  win.loadFile("index.html");
  //隐藏顶部菜单
  // win.setMenu(null);
  // loadUserSettings();
  // loadDict();
};
app.whenReady().then(() => {
  ipcMain.handle("ping", () => loadDict());
  ipcMain.handle("loadSettings", () => loadUserSettings());
  ipcMain.on("saveSettings", (event, settings) => {
    console.log("save");
    saveUserSettings(settings);
  });
  createWindow();
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
// app.on("before-quit", () => {
//   const focusedWindow = BrowserWindow.getFocusedWindow();
//   console.log(focusedWindow);
//   if (focusedWindow) {
//     console.log(11);
//     focusedWindow.webContents.send("request-config");
//   }
// });
