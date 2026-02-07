/**
 * wcf vendor runtime autoloader.
 *
 * importmap should map tagName (e.g. "myui-search-box")
 * to stable files under ./components/*.js.
 */

function collectCustomElementTagNames(root) {
  const out = new Set();
  const all = root.querySelectorAll('*');
  for (const el of all) {
    const name = String(el.localName || '').toLowerCase();
    if (!name.includes('-')) continue;
    out.add(name);
  }
  return [...out];
}

async function importTagNames(tagNames) {
  for (const tagName of tagNames) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await import(tagName);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[wcf-autoloader] Failed to import:', tagName, e);
    }
  }
}

async function runOnce() {
  const tagNames = collectCustomElementTagNames(document);
  await importTagNames(tagNames);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    runOnce();
  });
} else {
  runOnce();
}
