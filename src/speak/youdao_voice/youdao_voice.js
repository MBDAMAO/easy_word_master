const http = require("http");
const fs = require("fs");
const { ipcMain } = require("electron");

ipcMain.on("voice", (event, word) => {
  // 美式
  url1 = `http://dict.youdao.com/dictvoice?type=0&audio=${word}`;
  // 英式
  url2 = `http://dict.youdao.com/dictvoice?type=1&audio=${word}`;
  http.get(url1, ["test"], (resp) => {
    mp3data = [];
    resp.on("data", (chunk) => {
      mp3data.push(chunk);
    });
    resp.on("end", () => {
      const mp3 = Buffer.concat(mp3data);
      let code = generateUUID();
      fs.writeFileSync(`resource/temp/${code}.mp3`, mp3);
      event.reply("voice-reply", code);
    });
  });
});
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
