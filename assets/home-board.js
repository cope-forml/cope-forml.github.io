(() => {
  const frame = document.querySelector('[data-board-frame]');
  const template = document.querySelector('#home-board-options');
  if (!frame || !template) return;

  const photos = Array.from(template.content.querySelectorAll('img'));
  if (!photos.length) return;

  const storageKey = 'forml-last-board';
  let previous;
  try {
    previous = sessionStorage.getItem(storageKey);
  } catch (_) { /* Photo selection also works when storage is unavailable. */ }

  const alternatives = photos.filter(photo => photo.getAttribute('src') !== previous);
  const choices = alternatives.length ? alternatives : photos;
  const selected = choices[Math.floor(Math.random() * choices.length)].cloneNode(true);

  selected.addEventListener('load', () => {
    try {
      sessionStorage.setItem(storageKey, selected.getAttribute('src'));
    } catch (_) { /* Storage is optional. */ }
  });
  selected.addEventListener('error', () => {
    const fallback = photos[0].cloneNode(true);
    selected.replaceWith(fallback);
  }, { once: true });

  frame.append(selected);
})();
