import chromeApi from './chromeApi';
import { createCopiedUrl } from './helper';
import { copyFormats, copyFormatKey } from './constants';
const appId = chrome.app.getDetails().id;

let copyFormat = copyFormats.markdown.key;
let copyFormatName = copyFormats.markdown.name;
// 初期値取得
chromeApi.getFromStorage(copyFormatKey)
  .then(result => {
    const initCopyFormat = result[copyFormatKey];
    if (initCopyFormat) {
      copyFormat = initCopyFormat;
    }
  })

// copyFormatの変更監視
chromeApi.onChange(newFormat => {
  copyFormat = newFormat;
}, copyFormatKey);



// コンテキストメニュー(右クリックメニュー)の設定
const contextMenuItems = [
  {
    id: appId + '1',
    title: `URLをclipboardコピー`,
    callback: (info, tab) => {
      const elem = document.createElement('input');
      elem.value = createCopiedUrl(tab.url, tab.title, copyFormat, false);
      document.body.appendChild(elem);
      elem.select();
      document.execCommand('copy');
    }
  },
];
// コンテキストメニュー(右クリックメニュー)を流し込み
new Promise(resolve => chrome.contextMenus.removeAll(() => resolve()))
  .then(() => {
    contextMenuItems.forEach((item) => {
      chrome.contextMenus.create({
        id:  item.id,
        title: item.title,
      })
    })
  });

// コンテキストメニュー押下時の処理
chrome.contextMenus.onClicked.addListener((info, tab) => {
  // console.log(info, tab);

  contextMenuItems.forEach(item => {
    if (info.menuItemId === item.id) {
      item.callback(info, tab);
    }
  });
});

