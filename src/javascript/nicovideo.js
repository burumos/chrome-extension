
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
  chrome.storage.local.get(nicodoAutoStartKey).then(
    ({[nicodoAutoStartKey]: v}) => nicodoAutoStart = v
  );

  window.setInterval(() => {
    if (nicodoAutoStart === true) {
      // 動画再生ボタン 自動クリック
      let startButton = document.querySelector('.VideoStartButton');
      if (startButton) startButton.click();

    }
  }, 500);

}
