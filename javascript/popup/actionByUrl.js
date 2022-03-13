import chromeApi from '../chromeApi.js';

export default async function actionByUrl() {
  const nicodoAutoStartKey = 'nicodoAutoStart';
  const nicoLabelElement = document.querySelector('.nicodo-auto-start');
  const pixivKey = 'pixiv';
  const pixivLabelElement = document.querySelector('.pixiv');

  const { url } = await chromeApi.getCurrentTab();
  // ニコ動 チェックボックスを表示・制御するか
  if (!url.includes('nicovideo.jp')) {
    nicoLabelElement.remove();
  } else {
    handleCheckbox(nicodoAutoStartKey, nicoLabelElement);
  }
  // pixiv チェックボックスを表示・制御するか
  if (!url.includes('pixiv.net')) {
    pixivLabelElement.remove();
  } else {
    handleCheckbox(pixivKey, pixivLabelElement);
  }
}

const handleCheckbox = async (key, labelElement) => {
  const { [key]: isChecked } = await chromeApi.getFromStorage(key);
  const input = labelElement.querySelector('input');
  input.checked = !!isChecked;
  input.addEventListener('change', async () => {
    chromeApi.set2Strage(key, input.checked);
  });
}
