window.versions.onrequestconfig(() => {
  console.log(111);
  settings.history[dictname].last_location = index;
  window.versions.saveSettings(settings);
});
window.versions.setDefaultSettings(() => {
  window.versions.setDefault();
});
window.versions.setRandPlay((rand_play) => {
  settings.order_play = rand_play;
  window.versions.saveSettings(settings);
});
window.versions.setAutoPlay((auto_play) => {
  settings.auto_play = auto_play;
  if (!auto_play) {
    clearInterval(intervalId);
  } else {
    setTimer(settings.delay_time);
  }
  window.versions.saveSettings(settings);
});
window.versions.updateDelayTime((delay_time) => {
  settings.delay_time = delay_time;
  if (settings.auto_play) {
    setTimer(settings.delay_time);
  }
  window.versions.saveSettings(settings);
});
window.versions.updateTheme((theme) => {
  console.log("更换主题" + theme);
  settings.theme = theme;
  loadTheme(settings.themes[theme]);
  window.versions.saveSettings(settings);
});
const func = async () => {
  settings = await window.versions.loadSettings();
  console.log(settings);
  const response = await window.versions.ping();
  return response;
};
let settings = null;
let words = null;
let index = 0;
func().then((datas) => {
  words = datas.words;
  dictname = datas.dictName;
  console.log(settings);
  index = settings.history[dictname].last_location;
  theme = settings.theme;
  themeDetail = settings.themes[theme];
  loadTheme(themeDetail);
  //console.log(datas);
  update();
});
let intervalId = null;
function loadTheme(theme) {
  var div = document.getElementById("container");
  div.style.backgroundColor = theme.background_color;
  div.style.color = theme.font_color;
}
function setTimer(delay_time) {
  clearInterval(intervalId);
  intervalId = setInterval(() => {
    if (settings.order_play) {
      next();
    } else {
      randomNext();
    }
    console.log("" + delay_time / 1000 + "秒进行一次翻页");
  }, delay_time);
}
function update() {
  document.getElementById("title").innerText = words[index].name;
  document.getElementById("translate").innerText = words[index].trans;
  document.getElementById("sentence").innerText = words[index].eg;
  document.getElementById("foot").innerText =
    "" + (index + 1) + "/" + words.length;
  if (settings.auto_play) {
    setTimer(settings.delay_time);
  }
  settings.history[dictname].last_location = index;
  window.versions.saveSettings(settings);
}
function prev() {
  if (index <= 0) {
    console.log("到顶了！");
    return;
  }
  //console.log(words[index]);
  index -= 1;
  update();
}
function randomNext() {
  index = getRandomIntInclusive(0, words.length - 1);
  update();
}
function next() {
  if (index >= words.length - 1) {
    console.log("到尾了！");
    return;
  }
  //console.log(words[index]);
  index += 1;
  update();
}
function openMenu() {
  window.versions.createMenu(settings);
}
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}
window.addEventListener("contextmenu", (e) => {
  e.preventDefault(); // 阻止默认上下文菜单
  console.log(11);
  window.versions.createMenu(settings);
});
