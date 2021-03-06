import chromeApi from './chromeApi';
console.debug('My extension for NicoVideo');
{
  // ginza版 動画上の広告を非表示
  let x = document.querySelector('#textMarquee .textMarqueeInner');
  if(x) x.remove();
  // (く)版 動画上の広告を非表示
  let y = document.querySelector('.MarqueeContainer');
  if(y) y.remove();

  const nicodoAutoStartKey = 'nicodoAutoStart';
  let nicodoAutoStart = null;
  chromeApi.getFromStorage(nicodoAutoStartKey)
    .then(result => nicodoAutoStart = result[nicodoAutoStartKey])

  window.setInterval(() => {
    if (nicodoAutoStart === true) {
      // 動画再生ボタン 自動クリック
      let startButton = document.querySelector('.VideoStartButton');
      if (startButton) startButton.click();

      // 広告スキップボタン 自動クリック
      // let addSkipButton = document.body.querySelector('.videoAdUiSkipButtonExperimentalText');
      // if (addSkipButton) addSkipButton.click()
    }
  }, 500);

}

