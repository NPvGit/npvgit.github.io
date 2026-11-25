(() => {
  'use strict';
  const labels = {
    en: {
      mainNav: 'Main navigation', productNav: 'Product navigation',
      products: 'Products', support: 'Support', overview: 'Overview', privacy: 'Privacy Policy',
      language: 'Language', theme: 'Theme', system: 'System', light: 'Light', dark: 'Dark',
      skip: 'Skip to content',
      local: 'This website stores language and theme locally in your browser, separately from the extension. It uses no cookies, analytics or telemetry.',
      homeIntro: 'Product information, documentation and support for NPv software.',
      extension: 'Browser extension',
      productIntro: 'Route selected domains through your own proxy servers. Other domains connect directly while routing is enabled.',
      viewProduct: 'Explore', publisher: 'Publisher',
      supportIntro: 'For questions about NPv products or privacy, email the publisher.'
    },
    de: {
      mainNav: 'Hauptnavigation', productNav: 'Produktnavigation',
      products: 'Produkte', support: 'Support', overview: 'Übersicht', privacy: 'Datenschutzerklärung',
      language: 'Sprache', theme: 'Design', system: 'System', light: 'Hell', dark: 'Dunkel',
      skip: 'Zum Inhalt',
      local: 'Diese Website speichert Sprache und Design lokal im Browser, getrennt von der Erweiterung. Sie verwendet keine Cookies, Analyse oder Telemetrie.',
      homeIntro: 'Produktinformationen, Dokumentation und Support für NPv-Software.',
      extension: 'Browsererweiterung',
      productIntro: 'Leiten Sie ausgewählte Domains über eigene Proxy-Server. Andere Domains verbinden sich bei aktiviertem Routing direkt.',
      viewProduct: 'Zu', publisher: 'Herausgeber',
      supportIntro: 'Schreiben Sie dem Herausgeber bei Fragen zu NPv-Produkten oder zum Datenschutz.'
    },
    ru: {
      mainNav: 'Основная навигация', productNav: 'Навигация по продукту',
      products: 'Продукты', support: 'Поддержка', overview: 'Обзор', privacy: 'Политика конфиденциальности',
      language: 'Язык', theme: 'Тема', system: 'Системная', light: 'Светлая', dark: 'Тёмная',
      skip: 'К содержимому',
      local: 'Сайт хранит язык и тему локально в браузере, отдельно от расширения. Сайт не использует cookies, аналитику или телеметрию.',
      homeIntro: 'Информация о продуктах NPv, документация и поддержка.',
      extension: 'Расширение для браузера',
      productIntro: 'Направляйте запросы к выбранным доменам через собственные прокси-серверы. Пока маршрутизация включена, остальные домены подключаются напрямую.',
      viewProduct: 'Открыть', publisher: 'Издатель',
      supportIntro: 'По вопросам о продуктах NPv и конфиденциальности пишите издателю.'
    }
  };
  const choices = {language:['system','en','de','ru'], theme:['system','light','dark']};
  const key = name => 'npv-site-' + name;
  const controls = Object.fromEntries(Object.keys(choices).map(name => [name, document.getElementById(name)]));
  const state = {};
  function read(name) {
    try { const value = localStorage.getItem(key(name)); return choices[name].includes(value) ? value : 'system'; }
    catch { return 'system'; }
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
    const title = document.querySelector('main h1[data-label], main article:not([hidden]) .policy h1');
    if (title) document.title = title.textContent + ' · NPv Products';
    for (const name of Object.keys(choices)) controls[name].value = state[name];
  }
  for (const name of Object.keys(choices)) {
    state[name] = read(name);
    controls[name].addEventListener('change', () => {
      state[name] = choices[name].includes(controls[name].value) ? controls[name].value : 'system';
      try { localStorage.setItem(key(name), state[name]); } catch { /* Selection still works when storage is unavailable. */ }
      render();
    });
  }
  window.addEventListener('storage', event => {
    for (const name of Object.keys(choices)) if (event.key === null || event.key === key(name)) state[name] = read(name);
    render();
  });
  window.addEventListener('languagechange', render);
  render(); // System theme follows prefers-color-scheme in CSS, including live OS changes.
})();
