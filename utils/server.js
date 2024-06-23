// 宿主机服务器
const http = require("http");
const sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database(
  "./resource/word.db",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("数据库连接成功");
  }
);
let stmt = db.prepare(
  "INSERT INTO gre1 (code, name, voice, trans, sentence) VALUES (?, ?, ?, ?, ?)"
);
function INSERT_WORD(code, name, voice, trans, sentence) {
  stmt.run([code, name, voice, trans, sentence], [], (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("数据插入成功");
  });
}
const server = http.createServer((req, res) => {
  if (req.url === "/saveWord") {
    console.log("接收到请求：", req.url);
    let body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    req.on("end", () => {
      const postData = Buffer.concat(body).toString("utf-8");
      let word = JSON.parse(postData);
      INSERT_WORD(word.code, word.name, word.voice, word.trans, word.sentence);
      db.run("SELECT * FROM word;");
      console.log("POST请求的body数据：", word);
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("POST请求body已接收");
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});

const port = 11451;
server.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}/`);
});
// 关闭数据库连接
// db.close((err) => {
//   if (err) {
//     return console.error(err.message);
//   }
//   console.log("数据库连接已关闭");
// });
