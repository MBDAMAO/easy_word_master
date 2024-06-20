window.versions.onrequestconfig(() => {
  settings.history[dictname].last_location = index;
  window.versions.saveSettings(settings);
});
window.versions.setDefaultSettings(() => {
  window.versions.setDefaultEvent();
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
  settings.theme = theme;
  loadTheme(settings.themes[theme]);
  window.versions.saveSettings(settings);
});
const func = async () => {
  settings = await window.versions.loadSettings();
  const response = await window.versions.ping();
  return response;
};
let settings = null;
let words = null;
let index = 0;
func().then((datas) => {
  words = datas.words;
  dictname = datas.dictName;
  index = settings.history[dictname].last_location;
  theme = settings.theme;
  themeDetail = settings.themes[theme];
  loadTheme(themeDetail);
  update();
});
document.addEventListener("keydown", function (event) {
  if (event.key === "PageUp" || event.key === "ArrowLeft") {
    prev();
  } else if (event.key === "PageDown" || event.key === "ArrowRight") {
    next();
  } else if (event.key === " ") {
    randomNext();
  } else if (event.key === "p") {
    settings.auto_play = !settings.auto_play;
    if (!settings.auto_play) {
      clearInterval(intervalId);
    } else {
      setTimer(settings.delay_time);
    }
    window.versions.saveSettings(settings);
  } else if (event.key === "r") {
    settings.order_play = !settings.order_play;
    window.versions.saveSettings(settings);
  }
});
let intervalId = null;
function loadTheme(theme) {
  var div = document.getElementById("container");
  document.getElementById("backg").style.backgroundColor =
    theme.background_color;
  div.style.color = theme.font_color;
  document.getElementById("backg").style.opacity = theme.opacity
    ? theme.opacity
    : "100%";
  document.getElementById("sentence").style.color = theme.sentence_color
    ? theme.sentence_color
    : theme.font_color;
  if (theme.control_color) {
    document.getElementById("switch").style.color = theme.control_color;
  } else {
    document.getElementById("switch").style.color = theme.font_color;
  }
  if (theme.trans_color) {
    document.getElementById("translate").style.color = theme.trans_color;
  } else {
    document.getElementById("translate").style.color = theme.font_color;
  }
}
function setTimer(delay_time) {
  clearInterval(intervalId);
  intervalId = setInterval(() => {
    if (settings.order_play) {
      next();
    } else {
      randomNext();
    }
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
    return;
  }
  index -= 1;
  update();
}
function randomNext() {
  let nindex = getRandomIntInclusive(0, words.length - 1);
  let counter = 0;
  while (nindex === index && counter <= 10) {
    nindex = getRandomIntInclusive(0, words.length - 1);
    counter += 1;
  }
  index = nindex;
  update();
}
function next() {
  if (index >= words.length - 1) {
    return;
  }
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
