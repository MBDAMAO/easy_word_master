const { app, BrowserWindow } = require("electron");
const path = require("node:path");
const createWindow = () => {
  const win = new BrowserWindow({
    width: 200,
    height: 50,
    minWidth: 200,
    minHeight: 50,
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
};
app.whenReady().then(() => {
  createWindow();
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
