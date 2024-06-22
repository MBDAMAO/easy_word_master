export default function init() {
  window.resourceAPI.beforeUpdataSelectedBook((book) => {
    settings.selected_book = book;
    index = settings.history[book].last_location;
    window.versions.saveSettings(settings);
    window.resourceAPI.loadDict(book);
  });
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
}
