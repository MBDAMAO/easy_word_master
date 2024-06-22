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
var sql_del = db.prepare(`delete from word where 1=1`);
sql_del.run();
