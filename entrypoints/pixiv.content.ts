import { extension } from "./extension";


export default defineContentScript({
    matches: ["https://www.pixiv.net/*"],
    main: function () {
        console.debug('Something extension for pixiv');
        const pixivKey = 'pixiv';

        window.setInterval(async () => {
            const v = await extension.getItemFromStorage(pixivKey);
            if (Boolean(v)) {
                autoScale();
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
