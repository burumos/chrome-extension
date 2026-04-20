import {extension} from './extension';

const CLIPBOARD_COPY_MENU_ID = 'my-menu';
const IMAGES_MENU_ID = 'my-images-menu';

export default defineBackground(() => {
  // メニューに初期登録
  browser.runtime.onInstalled.addListener(async () => {
    browser.contextMenus.create({
      type: "normal",
      contexts: ['page', 'selection'],
      id: CLIPBOARD_COPY_MENU_ID,
      title: `クリップボードにmarkdown形式でURLをコピー`,
    });

    browser.contextMenus.create({
      type: "normal",
      contexts: ['image'],
      id: IMAGES_MENU_ID,
      title: `画像を拡大`,
    });
  });

  // メニュー押下時にクリップボードにコピー
  browser.contextMenus.onClicked.addListener(
    async (info: Browser.contextMenus.OnClickData, tab: Browser.tabs.Tab|undefined) => {
      if (!tab?.id) return;

      if (info.menuItemId === IMAGES_MENU_ID) {
        // console.log('image menu clicked', info, tab);
        browser.tabs.sendMessage(tab.id, {
          type: "ADD_CLASS_TO_IMAGE",
          srcUrl: info.srcUrl // クリックされた画像のURL
        });
      } else if (info.menuItemId === CLIPBOARD_COPY_MENU_ID) {
        const text = `[${tab.title}](${tab.url})`;
        copyToClipboard(tab, text);
      }
    }
  );

  // コマンド実行時の処理
  browser.commands.onCommand.addListener(async (command) => {
      console.log('Command:', command);
      if (command === "image-zoom") {
        const tab = await extension.getCurrentTab();
        browser.tabs.sendMessage(tab.id!, {
          type: "ADD_CLASS_TO_IMAGE",
          srcUrl: null // クリックされた画像のURL
        });
      }
  });

});

const copyToClipboard = (tab: Browser.tabs.Tab, text: string) => {
  function injectedFunction(text: string) {
    try {
      navigator.clipboard.writeText(text);
    } catch (e) {
      console.log('failed to copy to clipboard');
    }
  }
  browser.scripting.executeScript({
    target: { tabId: tab.id! },
    func: injectedFunction,
    args: [text]
  });
};
