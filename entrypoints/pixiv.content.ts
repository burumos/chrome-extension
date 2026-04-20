
export default defineContentScript({
    matches: ["https://www.pixiv.net/*"],
    main: function () {
        console.debug('Something extension for pixiv');
        const pixivKey = 'pixiv';

        const pixivInterval = window.setInterval(async () => {
            try {
                const v = await browser.runtime.sendMessage({
                    type: 'GET_STORAGE',
                    key: pixivKey
                });
                if (Boolean(v)) {
                    autoScale();
                }
            } catch (error) {
                console.error('Error occurred while fetching pixiv setting:', error);
                window.clearInterval(pixivInterval);
            }
        }, 100);
    }
});

function autoScale() {
    const windowWidth = window.innerWidth;
    Object.values(document.querySelectorAll<HTMLImageElement>('[role="presentation"] img'))
      .forEach(elem => {
        if (elem.clientWidth > windowWidth) {
          elem.style.width = '100%';
          elem.style.height = '100%';
        }
      });
}
