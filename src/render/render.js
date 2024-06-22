// import updateSettingsInit from "./update_settings.js";
let index = 0;
let settings = null;
let dict = null;
let word = null;
let intervalId = null;
let docItems = {
  audio: document.getElementById("audio"),
  icon: document.getElementById("icon"),
  title: document.getElementById("title"),
  translate: document.getElementById("translate"),
  sentence: document.getElementById("sentence"),
  foot: document.getElementById("foot"),
  voice: document.getElementById("voice"),
  switch: document.getElementById("switch"),
};
window.versions.loadSettings().then((data) => {
  // console.log("loadSettings:", JSON.stringify(data, null, 2));
  settings = data;
  console.log("loadDict:", settings.selected_book);
  window.resourceAPI.loadDict(settings.selected_book);
});
window.resourceAPI.onLoadDict((data) => {
  dict = data;
  console.log(dict);
  index = settings.history[dict.name].last_location;
  let theme = settings.theme;
  let themeDetail = settings.themes[theme];
  loadTheme(themeDetail);
  update();
});
window.resourceAPI.onGetWord(async (data) => {
  word = data;
  docItems.icon.setAttribute("fill", "red");
  docItems.title.innerText = word.name;
  docItems.translate.innerText = word.trans;
  docItems.sentence.innerText = word.sentence;
  docItems.foot.innerText = word.code.replace("/", " / ");
  docItems.voice.innerText = word.voice;
  if (settings.auto_play) {
    setTimer(settings.delay_time);
  }
  if (settings.auto_voice) {
    voice();
  }
  settings.history[dict.name].last_location = index;
  window.versions.saveSettings(settings);
});
window.resourceAPI.beforeUpdataSelectedBook((data) => {
  console.log("beforeUpdataSelectedBook:", data);
  settings.selected_book = data;
  index = settings.history[data].last_location;
  window.versions.saveSettings(settings);
  window.resourceAPI.loadDict(data);
});
window.versions.onrequestconfig(() => {
  settings.history[dict.name].last_location = index;
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
// 快捷键映射
document.addEventListener("keydown", function (event) {
  if (
    event.key === "PageUp" ||
    event.key === "ArrowLeft" ||
    event.key === "a"
  ) {
    prev();
  } else if (
    event.key === "PageDown" ||
    event.key === "ArrowRight" ||
    event.key === "d"
  ) {
    next();
  } else if (event.key === " ") {
    randomNext();
  } else if (event.key === "v") {
    voice();
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
function loadTheme(theme) {
  var div = document.getElementById("container");
  document.getElementById("backg").style.backgroundColor =
    theme.background_color;
  div.style.color = theme.font_color;
  document.getElementById("backg").style.opacity = theme.opacity
    ? theme.opacity
    : "100%";
  docItems.sentence.style.color = theme.sentence_color
    ? theme.sentence_color
    : theme.font_color;
  if (theme.control_color) {
    docItems.switch.style.color = theme.control_color;
  } else {
    docItems.switch.style.color = theme.font_color;
  }
  if (theme.trans_color) {
    docItems.translate.style.color = theme.trans_color;
  } else {
    docItems.translate.style.color = theme.font_color;
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
  window.resourceAPI.getWord({ dict: dict.code, id: index + 1 });
}
window.versions.onGetvoice(async (data) => {
  if (data.name != word.name) return;
  if (audio.src != `../resource/temp/${data.code}`) {
    audio.src = `../resource/temp/${data.code}`;
    audio.load();
  }
  audio.play();
});
audio.addEventListener("play", () => {
  docItems.icon.setAttribute("fill", "green");
});
audio.addEventListener("ended", () => {
  docItems.icon.setAttribute("fill", "red");
});
function prev() {
  if (index <= 0) {
    return;
  }
  index -= 1;
  update();
}
function randomNext() {
  let nindex = getRandomIntInclusive(0, dict.count - 1);
  let counter = 0;
  while (nindex === index && counter <= 10) {
    nindex = getRandomIntInclusive(0, dict.count - 1);
    counter += 1;
  }
  index = nindex;
  update();
}
function next() {
  if (index >= dict.count - 1) {
    return;
  }
  index += 1;
  update();
}
function voice() {
  docItems.icon.setAttribute("fill", "orange");
  console.log("voice");
  window.versions.voice(word.name);
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function openMenu() {
  window.versions.createMenu(settings);
}
window.addEventListener("contextmenu", (e) => {
  e.preventDefault(); // 阻止默认上下文菜单
  window.versions.createMenu(settings);
});
