import chromeApi from './chromeApi';

console.debug('My extension for pixiv');

function startAutoScale() {
  window.setInterval(() => {
    const windowWidth = window.innerWidth;
    Object.values(document.querySelectorAll('[role="presentation"] img'))
      .map(elem => {
        if (elem.width > windowWidth) {
          elem.style.width = '100%';
        }
      });
  }, 100);
}

const pixivKey = 'pixiv';
chromeApi.getFromStorage(pixivKey)
  .then(result => {
    if (result[pixivKey])
      startAutoScale();
  })
