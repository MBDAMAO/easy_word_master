const { app, BrowserWindow } = require("electron");
const path = require("node:path");
const createWindow = () => {
  const win = new BrowserWindow({
    width: 300,
    height: 60,
    maxHeight: 60,
    maxWidth: 300,
    minWidth: 300,
    minHeight: 60,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
  //隐藏顶部菜单
  win.setMenu(null);
  // loadUserSettings();
  // loadDict();
};
app.whenReady().then(() => {
  createWindow();
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
