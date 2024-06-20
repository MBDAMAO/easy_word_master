const { app, BrowserWindow, ipcMain, MenuItem, Menu } = require("electron");
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
  //win.webContents.openDevTools();
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
function createContextMenu(event, settings) {
  console.log("createMenu");
  let bookmenu = [];
  let delaymenu = [];
  for (const item1 of settings.all_delay_time) {
    delaymenu.push({
      label: "" + item1,
      type: "radio",
      checked: settings.delay_time == item1,
    });
  }
  for (const item of settings.all_books) {
    bookmenu.push({
      label: item,
      type: "radio",
      checked: settings.selected_book == item,
    });
  }
  const template = [
    {
      label: "自动播放",
      type: "checkbox",
      checked: settings.auto_play,
      click: () => {
        event.sender.send("context-menu-command", "menu-item-1");
      },
    },
    {
      label: "延迟时间",
      submenu: delaymenu,
    },
    { label: "随机播放", type: "checkbox", checked: !settings.order_play },
    {
      label: "词书选择",
      submenu: bookmenu,
    },
    {
      label: "重置设置",
      click: () => {
        event.sender.send("context-menu-command", "menu-item-1");
      },
    },
  ];
  const menu = Menu.buildFromTemplate(template);
  menu.popup({ window: BrowserWindow.fromWebContents(event.sender) });
}
app.whenReady().then(() => {
  ipcMain.handle("ping", () => loadDict());
  ipcMain.handle("loadSettings", () => loadUserSettings());
  ipcMain.on("createMenu", (event, settings) =>
    createContextMenu(event, settings)
  );
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
