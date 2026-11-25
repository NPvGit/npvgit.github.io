(() => {
  'use strict';
  const labels = {
    en: {
      mainNav: 'Main navigation', productNav: 'Product navigation',
      products: 'Products', support: 'Support', overview: 'Overview', privacy: 'Privacy Policy',
      language: 'Language', theme: 'Theme', system: 'System', light: 'Light', dark: 'Dark',
      auto: 'Auto', systemLanguage: 'System language', switchTheme: 'Switch to',
      skip: 'Skip to content',
      local: 'This website stores language and theme locally in your browser, separately from the extension. It uses no cookies, analytics or telemetry.',
      comingSoon: 'Coming soon',
      knipserIntro: 'A Windows app for importing, organizing and viewing your local photo and video collection.',
      extension: 'Browser extension',
      productIntro: 'Route selected domains through your own proxy servers. Other domains connect directly while routing is enabled.',
      viewProduct: 'Explore', publisher: 'Publisher',
      supportIntro: 'For questions about NPv products or privacy, email the publisher.'
    },
    de: {
      mainNav: 'Hauptnavigation', productNav: 'Produktnavigation',
      products: 'Produkte', support: 'Support', overview: 'Übersicht', privacy: 'Datenschutzerklärung',
      language: 'Sprache', theme: 'Design', system: 'System', light: 'Hell', dark: 'Dunkel',
      auto: 'Auto', systemLanguage: 'Systemsprache', switchTheme: 'Wechsel zu',
      skip: 'Zum Inhalt',
      local: 'Diese Website speichert Sprache und Design lokal im Browser, getrennt von der Erweiterung. Sie verwendet keine Cookies, Analyse oder Telemetrie.',
      comingSoon: 'Demnächst',
      knipserIntro: 'Eine Windows-App zum Importieren, Organisieren und Ansehen Ihrer lokalen Foto- und Videosammlung.',
      extension: 'Browsererweiterung',
      productIntro: 'Leiten Sie ausgewählte Domains über eigene Proxy-Server. Andere Domains verbinden sich bei aktiviertem Routing direkt.',
      viewProduct: 'Zu', publisher: 'Herausgeber',
      supportIntro: 'Schreiben Sie dem Herausgeber bei Fragen zu NPv-Produkten oder zum Datenschutz.'
    },
    ru: {
      mainNav: 'Основная навигация', productNav: 'Навигация по продукту',
      products: 'Продукты', support: 'Поддержка', overview: 'Обзор', privacy: 'Политика конфиденциальности',
      language: 'Язык', theme: 'Тема', system: 'Системная', light: 'Светлая', dark: 'Тёмная',
      auto: 'Авто', systemLanguage: 'Системный язык', switchTheme: 'Следующая тема',
      skip: 'К содержимому',
      local: 'Сайт хранит язык и тему локально в браузере, отдельно от расширения. Сайт не использует cookies, аналитику или телеметрию.',
      comingSoon: 'Скоро',
      knipserIntro: 'Приложение для Windows, в котором можно импортировать, упорядочивать и просматривать локальную коллекцию фото и видео.',
      extension: 'Расширение для браузера',
      productIntro: 'Направляйте запросы к выбранным доменам через собственные прокси-серверы. Пока маршрутизация включена, остальные домены подключаются напрямую.',
      viewProduct: 'Открыть', publisher: 'Издатель',
      supportIntro: 'По вопросам о продуктах NPv и конфиденциальности пишите издателю.'
    }
  };
  const choices = { language: ['system', 'en', 'de', 'ru'], theme: ['system', 'light', 'dark'] };
  const key = name => 'npv-site-' + name;
  const languageButtons = document.querySelectorAll('button[data-locale]');
  const themeButton = document.querySelector('.theme-toggle');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  const state = { language: read('language'), theme: read('theme') };

  function read(name) {
    try { const value = localStorage.getItem(key(name)); return choices[name].includes(value) ? value : 'system'; }
    catch { return 'system'; }
  }

  function setPreference(name, value) {
    state[name] = value;
    try { localStorage.setItem(key(name), value); } catch { /* Selection still works when storage is unavailable. */ }
    render();
  }

  function nextTheme() {
    const systemTheme = systemDark.matches ? 'dark' : 'light';
    const oppositeTheme = systemDark.matches ? 'light' : 'dark';
    if (state.theme === 'system') return oppositeTheme;
    return state.theme === oppositeTheme ? systemTheme : 'system';
  }

  function render() {
    const system = (navigator.language || 'en').toLowerCase().split(/[-_]/)[0];
    const language = state.language === 'system' ? (labels[system] ? system : 'en') : state.language;
    document.documentElement.lang = language;
    document.documentElement.dataset.theme = state.theme;
    document.querySelectorAll('[data-language]').forEach(el => { el.hidden = el.dataset.language !== language; });
    document.querySelectorAll('[data-label]').forEach(el => { el.textContent = labels[language][el.dataset.label]; });
    document.querySelectorAll('[data-aria-label]').forEach(el => {
      el.setAttribute('aria-label', labels[language][el.dataset.ariaLabel]);
    });
    const title = document.querySelector('main .hero h1[data-label], main article:not([hidden]) .policy h1');
    if (title) document.title = title.textContent + ' · NPv';
    for (const button of languageButtons) {
      button.setAttribute('aria-pressed', String(button.dataset.locale === state.language));
    }
    const copy = labels[language];
    const themeLabel = `${copy.theme}: ${copy[state.theme]}. ${copy.switchTheme}: ${copy[nextTheme()]}.`;
    themeButton.setAttribute('aria-label', themeLabel);
    themeButton.title = themeLabel;
  }
  for (const button of languageButtons) {
    button.addEventListener('click', () => setPreference('language', button.dataset.locale));
  }
  themeButton.addEventListener('click', () => setPreference('theme', nextTheme()));
  systemDark.addEventListener('change', render);
  window.addEventListener('storage', event => {
    for (const name of Object.keys(choices)) if (event.key === null || event.key === key(name)) state[name] = read(name);
    render();
  });
  window.addEventListener('languagechange', render);
  render(); // System theme follows prefers-color-scheme in CSS, including live OS changes.
})();
