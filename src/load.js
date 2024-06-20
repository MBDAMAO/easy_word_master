const fs = require("fs");
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
function loadDict() {
  // 同步读取JSON文件
  try {
    const data = fs.readFileSync("resource\\test.json", "utf-8");
    const jsonData = JSON.parse(data);
    return jsonData;
  } catch (error) {
    console.error("Error reading the file:", error);
  }
}
module.exports = { setDefault, loadDict, saveUserSettings, loadUserSettings };
