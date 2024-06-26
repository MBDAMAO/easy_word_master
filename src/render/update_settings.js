export default function init() {
    window.resourceAPI.beforeUpdataSelectedBook((book) => {
        settings.selected_book = book;
        index = settings.history[book].last_location;
        window.commonAPI.saveSettings(settings);
        window.resourceAPI.loadDict(book);
    });
    window.commonAPI.onrequestconfig(() => {
        settings.history[dictname].last_location = index;
        window.commonAPI.saveSettings(settings);
    });
    window.commonAPI.setDefaultSettings(() => {
        window.commonAPI.setDefaultEvent();
    });
    window.commonAPI.setRandPlay((rand_play) => {
        settings.order_play = rand_play;
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
}
