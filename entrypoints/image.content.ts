export default defineContentScript({
    matches: ["<all_urls>"],
    main: function (ctx) {
        // ホバー中の要素を記録
        let lastHoveredImage: HTMLImageElement | null = null;
        document.addEventListener("mouseover", (e) => {
            if (e.target instanceof HTMLImageElement) {
                lastHoveredImage = e.target;
            } else {
                lastHoveredImage = null; // 画像以外に移動したらクリア
            }
        }, true);

        // backgroundからのメッセージ受信
        browser.runtime.onMessage.addListener((message) => {
            // ページのコンソールログに出力
            if (message.type === "ADD_CLASS_TO_IMAGE") {
                let srcUrl: string|null = message.srcUrl;
                if (!srcUrl) {
                    if (lastHoveredImage) {
                        srcUrl = lastHoveredImage.src;
                    } else {
                        console.log('No image URL provided and no hovered image found.');
                        return;
                    }
                }
                zoomImage(srcUrl);
            }
        });
    }
});

function zoomImage(imageSrc: string) {
    const box = document.createElement('div');
    box.style.position = 'fixed';
    box.style.top = '0';
    box.style.left = '0';
    box.style.width = '100vw';
    box.style.height = '100vh';
    box.style.zIndex = '9998';
    box.style.overflowY = 'auto';
    box.style.borderTop = '4px solid #ff0000';
    document.body.appendChild(box);
    box.addEventListener('click', () => {
        box.remove();
    });

    const image = document.createElement('img');
    image.src = imageSrc;
    image.style.width = '100%';
    image.style.overflowY = 'scroll';
    box.appendChild(image);
}