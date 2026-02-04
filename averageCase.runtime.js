const params = new URLSearchParams(window.location.search);
    const disableLazy = params.get('lazy') === '0';

    const eagerImports = [
      'dads-button',
      'dads-input-text',
      'dads-select',
      'dads-textarea',
      'dads-checkbox',
      'dads-radio',
      'dads-fieldset',
      'dads-card',
    ];

    await Promise.all(eagerImports.map((specifier) => import(specifier)));

    const lazySpecifiers = {
      datePicker: ['dads-date-picker', 'dads-calendar'],
      calendar: ['dads-calendar'],
      table: ['dads-table'],
      pageNav: ['dads-page-navigation'],
    };

    const lazyLoaded = new Set();

    const loadLazy = async (key) => {
      if (lazyLoaded.has(key)) return;
      lazyLoaded.add(key);
      await Promise.all(lazySpecifiers[key].map((specifier) => import(specifier)));
    };

    const datePicker = document.querySelector('dads-date-picker');
    if (!disableLazy && datePicker) {
      const trigger = () => loadLazy('datePicker');
      datePicker.addEventListener('pointerdown', trigger, { once: true });
      datePicker.addEventListener('focusin', trigger, { once: true });
    }

    const lazySections = [
      { selector: 'dads-date-picker', key: 'datePicker' },
      { selector: 'dads-calendar', key: 'calendar' },
      { selector: '.avg-table', key: 'table' },
      { selector: '.avg-footer', key: 'pageNav' },
    ];

    if (!disableLazy && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const key = entry.target.getAttribute('data-lazy-key');
          if (key) loadLazy(key);
          observer.unobserve(entry.target);
        }
      }, { rootMargin: '200px 0px' });

      for (const section of lazySections) {
        const element = document.querySelector(section.selector);
        if (!element) continue;
        element.setAttribute('data-lazy-key', section.key);
        observer.observe(element);
      }
    } else if (!disableLazy) {
      for (const section of lazySections) {
        loadLazy(section.key);
      }
    } else {
      await Promise.all(Object.values(lazySpecifiers).flat().map((specifier) => import(specifier)));
    }
