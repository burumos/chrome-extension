import { copyFormats, copyFormatStorageKey } from '../constants.js';
import { createCopiedUrl } from '../helper.js';
import chromeApi from '../chromeApi.js';

export default async function controlTabList() {
  // [ {title, url} ...]
  const tabs = await chromeApi.getTabs();
  let selectedFormat = null;

  // タブのリストを表示
  const listFrame = document.querySelector('#tab-list');
  tabs.forEach(({ title, url }) => {
    const row = cloneTabRow(url, title);
    listFrame.appendChild(row);
  });

  // セレクトボックス: 作成とイベントハンドリング
  chromeApi.getFromStorage(copyFormatStorageKey)
    .then(({ [copyFormatStorageKey]: formatKey }) => {
      selectedFormat = copyFormats[formatKey] ? formatKey : Object.values(copyFormats)[0].key;
      const selectBox = document.querySelector('#select-format');
      selectBox.addEventListener('change', async () => {
        await chromeApi.set2Strage(copyFormatStorageKey, selectBox.value);
      })
      Object.values(copyFormats).forEach(({ key, name }) => {
        const option = document.createElement('option');
        option.value = key;
        option.innerText = name;
        selectBox.appendChild(option);
      });
      selectBox.value = selectedFormat;
    });

  // 全チェック
  document.querySelector('.all-check')
    .addEventListener('change', ({ target: { checked } }) => {
      document.querySelectorAll('.tab-row .checkbox')
        .forEach(element => element.checked = checked);
    });

  // copyボタン
  document.querySelector('#copy-button').addEventListener('click', () => {
    const text = Object.values(document.querySelectorAll('.tab-row .checkbox'))
          .filter(tab => tab.checked)
          .map(element => createCopiedUrl(
            element.value, element.dataset.title, selectedFormat, true
          ))
          .join("\n");
    const textarea = document.querySelector('#copy-url-text');
    textarea.value = text;
    textarea.select();
    document.execCommand('copy');
    const messageArea = document.querySelector('#url-copy-message');
    messageArea.innerText = 'copied to clipboard!!';
    window.setTimeout(() => messageArea.innerText = '', 1500);
  })
}

const cloneTabRow = (url, title) => {
  const row = document.getElementById('row-clone').cloneNode(true);
  row.id = '';
  row.querySelector('.checkbox').value = url;
  row.querySelector('.checkbox').dataset.title = title;
  row.querySelector('.title').innerText = title;
  return row;
}
