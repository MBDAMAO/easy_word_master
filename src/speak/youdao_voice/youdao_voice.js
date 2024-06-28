const http = require("http");
const fs = require("fs");
const { ipcMain } = require("electron");
const path = require("node:path");

ipcMain.on("voice", (event, word) => {
  // 美式
  let url1 = `http://dict.youdao.com/dictvoice?type=0&audio=${word}`;
  // 英式
  let url2 = `http://dict.youdao.com/dictvoice?type=1&audio=${word}`;

  const resource = path.join(__dirname,'..','..','..',`resource/temp/youdao_US_${word}.mp3`);
  if (fs.existsSync(resource)) {
    event.reply("voice-reply", {
      code: `youdao_US_${word}.mp3`,
      name: word,
    });
  } else {
    http.get(url1, [], (resp) => {
      let mp3data = [];
      resp.on("data", (chunk) => {
        mp3data.push(chunk);
      });
      resp.on("end", () => {
        const mp3 = Buffer.concat(mp3data);
        if (!fs.existsSync(path.join(__dirname,'..','..','..',"resource/temp"))) {
          fs.mkdirSync(path.join(__dirname,'..','..','..',"resource/temp"));
        }
        fs.writeFileSync(resource, mp3);
        event.reply("voice-reply", {
          code: `youdao_US_${word}.mp3`,
          name: word,
        });
      });
    });
  }
});
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
