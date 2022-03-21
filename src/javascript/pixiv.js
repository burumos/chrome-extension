console.debug('My extension for pixiv');

function startAutoScale() {
  window.setInterval(() => {
    const windowWidth = window.innerWidth;
    Object.values(document.querySelectorAll('[role="presentation"] img'))
      .map(elem => {
        if (elem.width > windowWidth) {
          elem.style.width = '100%';
          elem.style.height = '100%';
        }
      });
  }, 100);
}

const pixivKey = 'pixiv';
chrome.storage.local.get(pixivKey)
  .then(result => {
    if (result[pixivKey])
      startAutoScale();
  });
