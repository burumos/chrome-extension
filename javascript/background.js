import chromeApi from './chromeApi';

chrome.commands.onCommand.addListener(function(command) {
  console.log('Command:', command);
  if (command === 'open_options') {
    chrome.runtime.openOptionsPage();
  }
});

const contextMenuItems = [
  {
    id: '1',
    title: 'マークダウン形式でURLをコピー',
    callback: (info, tab) => {
      const elem = document.createElement('input');
      elem.value = `[${tab.title}](${tab.url})`;
      document.body.appendChild(elem);
      elem.select();
      document.execCommand('copy');
    }
  },
  {
    id: '2',
    title: 'close',
    callback: (info, tab) => {
      if (window.screen.width > window.screen.height) return;
      chrome.tabs.remove(tab.id);
    },
  }
];

contextMenuItems.forEach((item) => {
  chrome.contextMenus.create({
    id: item.id,
    title: item.title,
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
