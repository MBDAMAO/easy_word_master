const fs = require("fs");
const path = require("node:path");
const { ipcMain, ipcRenderer } = require("electron");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(
  "resource/word.db",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("数据库连接成功\n");
  }
);
function getWord(dict, id) {
  db.each(`select * from ${dict} where id = ${id}`, function (err, row) {
    if (err) {
      console.error(err.message);
      throw err;
    } else {
      return row;
    }
  });
}
function closeDB() {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("数据库连接已关闭\n");
  });
}
function setDefault() {
  try {
    const data = fs.readFileSync("config\\default.json", "utf-8");
    const jsonData = JSON.parse(data);
    saveUserSettings(jsonData);
  } catch (error) {
    console.error("Error reading the file:", error);
  }
}
function loadUserSettings() {
  try {
    const data = fs.readFileSync("config\\my_settings.json", "utf-8");
    const jsonData = JSON.parse(data);
    return jsonData;
  } catch (error) {
    console.error("Error reading the file:", error);
  }
}
function saveUserSettings(settings) {
  try {
    let writeIn = JSON.stringify(settings, null, 2);
    fs.writeFileSync("config\\my_settings.json", writeIn, "utf-8");
  } catch (error) {
    console.error("Error write the file:", error);
  }
}
function cleanTemp() {
  console.log("手动清除缓存音频！\n");
  dirPath = "resource\\temp";
  fs.readdir(dirPath, (err, files) => {
    if (err) return;
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      fs.unlinkSync(fullPath);
    }
    fs.rmdirSync(dirPath);
  });
}
module.exports = {
  closeDB,
  getWord,
  setDefault,
  saveUserSettings,
  cleanTemp,
  loadUserSettings,
};

ipcMain.on("loadDict", (event, data) => {
  console.log("loadDict");
  db.each(`select * from dict_info where id = 1`, function (err, row) {
    if (err) {
      console.error(err.message);
      throw err;
    } else {
      console.log(row);
      event.reply("loadDict-reply", row);
    }
  });
});
ipcMain.on("getWord", (event, data) => {
  // console.log(data);
  db.each(
    `select * from ${data.dict} where id = ${data.id}`,
    function (err, row) {
      if (err) {
        console.error(err.message);
        throw err;
      } else {
        event.reply("getWord-reply", row);
      }
    }
  );
});
