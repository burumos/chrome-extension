import chromeApi from './javascript/chromeApi.js';
import { createCopiedUrl } from './javascript/helper.js';
import { copyFormats, copyFormatStorageKey } from './javascript/constants.js';


function getMenuId () {
  return 'my-menu';
}

// クリップボードに保存する形式を取得
async function getCopyFormat() {
  const { [copyFormatStorageKey]: copyFormat } = await chromeApi.getFromStorage(copyFormatStorageKey);
  return copyFormat;
}

// メニューに初期登録
chrome.runtime.onInstalled.addListener(async () => {
  const copyFormat = await getCopyFormat();
  const name = copyFormats[copyFormat]?.name ?? '';
  chrome.contextMenus.create({
    type: "normal",
    contexts: ['page', 'selection'],
    id: getMenuId(),
    title: `クリップボードに${name}形式でURLをコピー`
  });
});

// copyFormatの変更監視
chromeApi.onChange(newFormatKey => {
  const name = copyFormats[newFormatKey]?.name ?? '';
  chrome.contextMenus.update(
    getMenuId(),
    { title: `クリップボードに${name}形式でURLをコピー` }
  )
}, copyFormatStorageKey);

// メニュー押下時にクリップボードにコピー
chrome.contextMenus.onClicked.addListener(async (_, tab) => {
  await new Promise(r => setTimeout(() => r(), 10));
  const copyFormat = await getCopyFormat();
  copyToClipboard(tab, createCopiedUrl(tab.url, tab.title, copyFormat, false));
});

const copyToClipboard = (tab, text) => {
  function injectedFunction(text) {
    try {
      navigator.clipboard.writeText(text);
    } catch (e) {
      console.log('failed');
    }
  }
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    func: injectedFunction,
    args: [text]
  });
};
