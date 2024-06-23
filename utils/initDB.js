const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(
  "./resource/word.db",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("数据库连接成功");
  }
);

db.run(
  "CREATE TABLE IF NOT EXISTS gre1 (id INTEGER PRIMARY KEY,code TEXT, name TEXT, voice TEXT, trans TEXT, sentence TEXT);",
  [],
  (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("表创建成功");
  }
);

function queryAllWords() {
  db.all(`select * from word where id = 6`, function (err, row) {
    if (err) throw err;
    else {
      console.log("all查询结果", row);
    }
  });
}
// queryAllWords();
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("数据库连接已关闭");
});
