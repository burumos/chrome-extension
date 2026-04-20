import { extension } from "./extension";

export default defineContentScript({
    matches: ["https://www.nicovideo.jp/watch/*"],
    main: function () {
        console.log("Hello, NicoNico!");

        const nicodoAutoStartKey = 'nico-auto-start';
        let nicodoAutoStart: boolean = false;
        extension.getItemFromStorage(nicodoAutoStartKey).then((v: unknown) => nicodoAutoStart = Boolean(v));

        window.setInterval(() => {
            if (nicodoAutoStart === true) {
                // 動画再生ボタン 自動クリック
                const startButton = document.querySelector('.VideoStartButton');
                if (startButton) startButton.dispatchEvent(new MouseEvent('click', {bubbles: true}));
            }
        }, 500);

        const removeAdsInterval = window.setInterval(() => {
            const result =removeAds();
            if (result) {
                window.clearInterval(removeAdsInterval);
            }
        }, 1000);
    },
});

function removeAds() {
    const recommendationBox = document.querySelectorAll('div[aria-labelledby]');
    let removed = false;
    recommendationBox.forEach(box => {
        const links = box.querySelectorAll('a');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('/watch/')) {
                console.debug('Removing ad link:', href);
                link.remove();
            }
        });
        if (links.length > 0) {
            removed = true;
        }
    });
    return removed;
}