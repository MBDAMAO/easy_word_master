const fs = require("fs");
const path = require("node:path");
const {ipcMain, ipcRenderer} = require("electron");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(
    path.join(__dirname, '..', '..', "resource/word.db"),
    sqlite3.OPEN_READWRITE,
    (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log("数据库连接成功\n");
    }
);

// function getWord(dict, id, prev) {
//     if (dict !== "saved_words") {
//         db.each(`select * from ${dict} where id = ${id}`, function (err, row) {
//             if (err) {
//                 console.error(err.message);
//                 throw err;
//             } else {
//                 return row;
//             }
//         });
//     } else {
//
//     }
// }

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
        const data = fs.readFileSync(path.join(__dirname, '..', '..', "config\\default.json"), "utf-8");
        const jsonData = JSON.parse(data);
        saveUserSettings(jsonData);
    } catch (error) {
        console.error("Error reading the file:", error);
    }
}

function loadUserSettings() {
    try {
        const data = fs.readFileSync(path.join(__dirname, '..', '..', "config/my_settings.json"), "utf-8");
        const jsonData = JSON.parse(data);
        return jsonData;
    } catch (error) {
        console.error("Error reading the file:", error);
    }
}

function saveUserSettings(settings) {
    try {
        let writeIn = JSON.stringify(settings, null, 2);
        fs.writeFileSync(path.join(__dirname, '..', '..', "config\\my_settings.json"), writeIn, "utf-8");
    } catch (error) {
        console.error("Error write the file:", error);
    }
}

function cleanTemp() {
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

function likeWord(data) {
    let dict = data.dict;
    let word = data.word;
    let status = data.status;
    if (status === true) {
        db.each(
            `insert into saved_words(name,code,sentence,trans,voice,create_time,dict_name,dict_code,foreignId) values('${word.name}','${word.code}',
                '${word.sentence.replace("'","''")}','${word.trans}','${word.voice.replace("'",'\'\'')}',
                strftime('%Y-%m-%d %H:%M:%f','now','localtime'),'${dict.name}','${dict.code}','${word.id}')`,
            function (err, row) {
                if (err) {
                    console.error(err.message);
                } else {

                }
            }
        );
    } else {
        db.each(
            `delete from saved_words where name = '${word.name}'`,
            function (err, row) {
                if (err) {
                    console.error(err.message);
                    throw err;
                } else {

                }
            }
        );
    }
}

module.exports = {
    closeDB,
    // getWord,
    cleanTemp,
};
// 获取词书信息
ipcMain.on("loadDict", (event, dictName) => {
    db.each(
        `select * from dict_info where name = '${dictName}'`,
        function (err, row) {
            if (err) {
                console.error(err.message);
                throw err;
            } else {
                event.reply("loadDict-reply", row);
            }
        }
    );
});
// 根据词书和id获取单个单词
ipcMain.on("getWord", (event, data) => {
    if (data.dict !== "saved_words") {
        db.each(
            `select * from ${data.dict} where id = ${data.id}`,
            function (err1, row1) {
                if (err1) {
                    console.error(err1.message);
                    throw err1;
                } else {
                    db.get(
                        `select * from saved_words where name = '${row1.name}'`, function (err2, row2) {
                            if (err2) {
                                console.error(err2.message);
                                throw err2;
                            } else if (row2) {
                                event.reply("getWord-reply", {row: row1, status: true});
                            } else {
                                event.reply("getWord-reply", {row: row1, status: false});
                            }
                        }
                    )
                }
            }
        );
    } else {
        let sql = data.op !== "prev" ? `select * from saved_words where create_time > '${data.create_time}' order by create_time asc limit 1` :
            `select * from saved_words where create_time < '${data.create_time}' order by create_time desc limit 1`;
        db.get(
            sql, function (err2, row2) {
                if (err2) {
                    console.log(err2.message);
                    throw err2;
                } else {
                    if (!row2) {
                        event.reply("getWord-reply", {row: data.word, status: true});
                        return;
                    }
                    db.get(
                        `SELECT
                              (SELECT COUNT(*) FROM saved_words WHERE create_time < '${row2.create_time}') AS i,
                              COUNT(*) AS count FROM saved_words`, function (err23, row23) {
                            if (err23) {
                                console.log(err23.message);
                                throw err23;
                            } else if (row2) {
                                row2.code = `${row23.i + 1}/${row23.count}`
                                event.reply("getWord-reply", {row: row2, status: true});
                            } else {
                                event.reply("getWord-reply", {row: data.word, status: true});
                            }
                        }
                    )
                }
            }
        )
    }
});
ipcMain.handle("loadSettings", () => loadUserSettings());
ipcMain.on("saveSettings", (event, settings) => {
    saveUserSettings(settings);
});
ipcMain.on("likeWord", (event, word) => {
    likeWord(word);
});
ipcMain.on("setDefaultEvent", () => {
    setDefault();
});
