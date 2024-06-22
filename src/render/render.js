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
let index = 0;
let settings = null;
let dict = null;
let word = null;
window.versions.loadSettings().then((data) => {
  settings = data;
  window.resourceAPI.loadDict();
});
window.resourceAPI.onLoadDict((data) => {
  dict = data;
  index = settings.history[dict.name].last_location;
  theme = settings.theme;
  themeDetail = settings.themes[theme];
  loadTheme(themeDetail);
  update();
});
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
  window.resourceAPI.getWord({ dict: dict.code, id: index + 1 });
}
audio = document.getElementById("audio");
window.versions.onGetvoice(async (code) => {
  if (audio.src != `../resource/temp/${code}`) {
    audio.src = `../resource/temp/${code}`;
    audio.load();
  }
  audio.play();
});
audio.addEventListener("play", () => {
  document.getElementById("icon").setAttribute("fill", "green");
});
audio.addEventListener("ended", () => {
  document.getElementById("icon").setAttribute("fill", "red");
});
window.resourceAPI.onGetWord(async (data) => {
  word = data;
  document.getElementById("title").innerText = word.name;
  document.getElementById("translate").innerText = word.trans;
  document.getElementById("sentence").innerText = word.sentence;
  document.getElementById("foot").innerText = word.code.replace("/", " / ");
  document.getElementById("voice").innerText = word.voice;
  if (settings.auto_play) {
    setTimer(settings.delay_time);
  }
  settings.history[dict.name].last_location = index;
  window.versions.saveSettings(settings);
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
  document.getElementById("icon").setAttribute("fill", "orange");
  console.log("voice");
  window.versions.voice(word.name);
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
  window.versions.createMenu(settings);
});
