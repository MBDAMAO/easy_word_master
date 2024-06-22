const { app, BrowserWindow, ipcMain, Menu } = require("electron");
require("./speak/youdao_voice/youdao_voice");
const path = require("node:path");
const {
  setDefault,
  saveUserSettings,
  loadUserSettings,
  closeDB,
  cleanTemp,
} = require("./resource/load");
const createWindow = () => {
  const win = new BrowserWindow({
    width: 300,
    height: 76,
    minHeight: 76,
    minWidth: 300,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    webPreferences: {
      // nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  // win.webContents.openDevTools();
  win.on("close", () => {
    console.log("close!");
    win.webContents.send("request-config");
  });
  win.loadFile("src/index.html");
  win.setAspectRatio(300 / 76);
  //隐藏顶部菜单
  // win.setMenu(null);
  // loadUserSettings();
  // loadDict();
  win.webContents.on("console-message", (level, message, line, sourceId) => {
    console.log(
      `Render Process Console: ${level}, ${message}, ${line}, ${sourceId}`
    );
  });
};
function createContextMenu(event, settings) {
  let bookmenu = [];
  let delaymenu = [];
  let thememenu = [];
  for (const item of settings.all_themes) {
    thememenu.push({
      label: "" + item,
      type: "radio",
      checked: settings.theme == item,
      click: () => {
        event.sender.send("update_theme", item);
      },
    });
  }
  for (const item of settings.all_delay_time) {
    delaymenu.push({
      label: "" + item,
      type: "radio",
      checked: settings.delay_time == item,
      click: () => {
        event.sender.send("update_delay_time", item);
      },
    });
  }
  for (const item of settings.all_books) {
    bookmenu.push({
      label: item,
      type: "radio",
      checked: settings.selected_book == item,
      click: () => {
        event.sender.send("update_selected_book", item);
      },
    });
  }
  const template = [
    {
      label: "自动播放",
      type: "checkbox",
      checked: settings.auto_play,
      click: () => {
        event.sender.send("setAutoPlay", !settings.auto_play);
      },
    },
    {
      label: "延迟时间",
      submenu: delaymenu,
    },
    {
      label: "随机播放",
      type: "checkbox",
      checked: !settings.order_play,
      click: () => {
        event.sender.send("setRandPlay", !settings.order_play);
      },
    },
    {
      label: "词书选择",
      submenu: bookmenu,
    },
    {
      label: "主题样式",
      submenu: thememenu,
    },
    {
      label: "重置设置",
      click: () => {
        event.sender.send("setDefaultSettings", true);
      },
    },
  ];
  const menu = Menu.buildFromTemplate(template);
  menu.popup({ window: BrowserWindow.fromWebContents(event.sender) });
}
app.whenReady().then(() => {
  ipcMain.handle("loadSettings", () => loadUserSettings());
  ipcMain.on("createMenu", (event, settings) =>
    createContextMenu(event, settings)
  );
  ipcMain.on("saveSettings", (event, settings) => {
    saveUserSettings(settings);
  });
  ipcMain.on("setDefaultEvent", () => {
    setDefault();
  });
  createWindow();
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
app.on("before-quit", () => {
  closeDB();
  cleanTemp();
});
// const isDevelopment = !app.isPackaged;
// if (isDevelopment) {
//   try {
//     require("electron-reloader")(module);
//   } catch (err) {}
// }
