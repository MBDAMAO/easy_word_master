let url = "http://192.168.1.9:11451/saveWord";
function saveword(postData) {
  http.postJson(url, postData);
}
let arr = [];
let times = 10001;
while (times--) {
  let code = id("tv_learn_status").findOne().text();
  let word = id("tv_word").findOne().text();
  let voice = id("prononce_display").findOne().text();
  let shuxing = id("tv_interpretItem_property").find();
  let means = id("tv_interpretItem_meaning").find();
  let trans = "";
  for (let i = 0; i < means.length; i++) {
    trans = trans + shuxing[i].text() + means[i].text() + " ";
  }
  let sentenceObj = id("main_en_sentence").findOne(2000);
  let sentence = sentenceObj != null ? sentenceObj.text() : "";
  id("bottom_right_button_container").findOne().click();
  let block = {
    code: code,
    name: word,
    voice: voice,
    trans: trans,
    sentence: sentence,
  };
  saveword(block);
  // arr.push(block);
}
// let data = {
//   dictName: "红宝书",
//   creator: "damao",
//   create_time: "2024-06-19 20:43:55",
//   words: arr,
// };
// console.log(JSON.stringify(arr[0]));
