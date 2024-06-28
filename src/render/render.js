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
const isSaved = document.getElementById("isSaved")
window.commonAPI.loadSettings().then((data) => {
    settings = data;
    window.resourceAPI.loadDict(settings.selected_book);
});
window.resourceAPI.onLoadDict((data) => {
    dict = data;
    index = settings.history[dict.name].last_location;
    let theme = settings.theme;
    let themeDetail = settings.themes[theme];
    loadTheme(themeDetail);
    update();
});
window.resourceAPI.onGetWord(async (data) => {
    word = data.row;
    let status = data.status;
    if (status) {
        isSaved.setAttribute("fill", "rgb(242,197,92)")
    } else {
        isSaved.setAttribute("fill", "grey")
    }
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
    window.commonAPI.saveSettings(settings);
});
window.resourceAPI.beforeUpdataSelectedBook((data) => {
    settings.selected_book = data;
    index = settings.history[data].last_location;
    window.commonAPI.saveSettings(settings);
    window.resourceAPI.loadDict(data);
});
window.commonAPI.onrequestconfig(() => {
    settings.history[dict.name].last_location = index;
    window.commonAPI.saveSettings(settings);
});
window.commonAPI.setDefaultSettings(() => {
    window.commonAPI.setDefaultEvent();
});
window.commonAPI.setRandPlay((rand_play) => {
    settings.order_play = rand_play;
    window.commonAPI.saveSettings(settings);
});
window.commonAPI.setAutoVoice((auto_voice) => {
    settings.auto_voice = auto_voice;
    window.commonAPI.saveSettings(settings);
});
window.commonAPI.setAutoPlay((auto_play) => {
    settings.auto_play = auto_play;
    if (!auto_play) {
        clearInterval(intervalId);
    } else {
        setTimer(settings.delay_time);
    }
    window.commonAPI.saveSettings(settings);
});
window.commonAPI.updateDelayTime((delay_time) => {
    settings.delay_time = delay_time;
    if (settings.auto_play) {
        setTimer(settings.delay_time);
    }
    window.commonAPI.saveSettings(settings);
});
window.commonAPI.updateTheme((theme) => {
    settings.theme = theme;
    loadTheme(settings.themes[theme]);
    window.commonAPI.saveSettings(settings);
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
    } else if (event.key === "s") {
        save();
    } else if (event.key === "v") {
        voice();
    } else if (event.key === "p") {
        settings.auto_play = !settings.auto_play;
        if (!settings.auto_play) {
            clearInterval(intervalId);
        } else {
            setTimer(settings.delay_time);
        }
        window.commonAPI.saveSettings(settings);
    } else if (event.key === "r") {
        settings.order_play = !settings.order_play;
        window.commonAPI.saveSettings(settings);
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
    if (theme.other) {
        for (let key in theme.other) {
            document.getElementById("backg").setAttribute(key, theme.other[key]);
        }
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

function update(op) {
    let create_time = !word ? '2020/01/01' : (word.create_time ? word.create_time : '2020/01/01')
    console.log("creat",create_time)
    window.resourceAPI.getWord({dict: dict.code, word: word, id: index + 1, create_time: create_time,op:op});
}

window.commonAPI.onGetVoice(async (data) => {
    if (data.name !== word.name) return;
    if (audio.src !== `../resource/temp/${data.code}`) {
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
    if (dict.code === "saved_words") {
        update('prev');
        return;
    }
    if (index <= 0) {
        return;
    }
    index -= 1;
    update('prev');
}

function save() {
    if (isSaved.getAttribute("fill") === "rgb(242,197,92)") {
        isSaved.setAttribute("fill", "grey")
        window.commonAPI.likeWord({dict: dict, word: word, status: false});
    } else {
        window.commonAPI.likeWord({dict: dict, word: word, status: true});
        isSaved.setAttribute("fill", "rgb(242,197,92)")
    }
}

function randomNext() {
    let nindex = getRandomIntInclusive(0, dict.count - 1);
    let counter = 0;
    while (nindex === index && counter <= 10) {
        nindex = getRandomIntInclusive(0, dict.count - 1);
        counter += 1;
    }
    index = nindex;
    update('random');
}

function next() {
    if (dict.code === "saved_words") {
        update('next');
        return;
    }
    if (index >= dict.count - 1) {
        return;
    }
    index += 1;
    update('next');
}

function voice() {
    docItems.icon.setAttribute("fill", "orange");
    window.commonAPI.voice(word.name);
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function openMenu() {
    window.commonAPI.createMenu(settings);
}

window.addEventListener("contextmenu", (e) => {
    e.preventDefault(); // 阻止默认上下文菜单
    window.commonAPI.createMenu(settings);
});
