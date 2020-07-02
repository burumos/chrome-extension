import chromeApi from './chromeApi';
const appId = chrome.app.getDetails().id;

// コンテキストメニュー(右クリックメニュー)の設定
const contextMenuItems = [
  {
    id: appId + '1',
    title: 'マークダウン形式でURLをコピー',
    callback: (info, tab) => {
      const elem = document.createElement('input');
      elem.value = `[${tab.title}](${tab.url})`;
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

