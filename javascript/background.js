import chromeApi from './chromeApi';
import "babel-polyfill";
console.log('load background.js', "chrome.commands", chrome.commands);

// コマンド
chrome.commands.onCommand.addListener(function(command) {
  console.log('Command:', command);
  switch(command) {
    case "open_options":
      chrome.runtime.openOptionsPage()
      break;

    case "execute_script":
      executeScript()
      break;
  }
});

const appId = chrome.app.getDetails().id;

// コンテキストメニュー(右クリックメニュー)
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

new Promise(resolve => chrome.contextMenus.removeAll(() => resolve()))
  .then(() => {
    contextMenuItems.forEach((item) => {
      chrome.contextMenus.create({
        id:  item.id,
        title: item.title,
      })
    })
  })


chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log(info, tab);

  contextMenuItems.forEach(item => {
    if (info.menuItemId === item.id) {
      item.callback(info, tab);
    }
  });
})


async function executeScript() {
  const tab = await new Promise((res, rej) => {
    chrome.tabs.query({
      active: true,
      currentWindow: true,
    }, (result) => res(result[0]))
  });
  const fetchedData = await chromeApi.getFromStorage("scripts");
  let promise = Promise.resolve();
  if (Array.isArray(fetchedData.scripts)) {
    fetchedData.scripts.forEach(scriptObj => {
      if (! tab.url.includes(scriptObj.url)
          || !scriptObj.onOff) return;
      promise = new Promise(async (res, rej) => {
        const result = await new Promise((res, rej) =>{
          chrome.tabs.executeScript(tab.id, {
            code: scriptObj.script,
          }, result => res(result))});
        scriptObj.execDate = (new Date).toString();
        scriptObj.result = JSON.stringify(result);
        res();
      })
    })
  }
  await promise;
  chromeApi.set2Strage({scripts: fetchedData.scripts});
}

