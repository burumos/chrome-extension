
console.log('load popup.js');

const optionButton = document.querySelector('#options');
const barButton = document.getElementById('bar');

optionButton.addEventListener('click', () => {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
});

barButton.addEventListener('click', () => {
  window.open(chrome.runtime.getURL('bar.html'));
});
