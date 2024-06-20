const fs = require("fs");
function setDefault() {
  try {
    console.log("loading settings...");
    const data = fs.readFileSync("config\\default.json", "utf-8");
    const jsonData = JSON.parse(data);
    saveUserSettings(jsonData);
  } catch (error) {
    console.error("Error reading the file:", error);
  }
}
function loadUserSettings() {
  try {
    console.log("loading settings...");
    const data = fs.readFileSync("config\\my_settings.json", "utf-8");
    const jsonData = JSON.parse(data);
    console.log(jsonData);
    return jsonData;
  } catch (error) {
    console.error("Error reading the file:", error);
  }
}
function saveUserSettings(settings) {
  try {
    console.log("save settings...");
    let writeIn = JSON.stringify(settings, null, 2);
    console.log(writeIn);
    fs.writeFileSync("config\\my_settings.json", writeIn, "utf-8");
  } catch (error) {
    console.error("Error write the file:", error);
  }
}
function loadDict() {
  // 同步读取JSON文件
  try {
    console.log("loading dict...");
    const data = fs.readFileSync("resource\\test.json", "utf-8");
    const jsonData = JSON.parse(data);
    console.log(jsonData);
    return jsonData;
  } catch (error) {
    console.error("Error reading the file:", error);
  }
}
module.exports = { setDefault, loadDict, saveUserSettings, loadUserSettings };
