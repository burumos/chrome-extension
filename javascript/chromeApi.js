const chromeApi = {
  set2Strage: (obj, callback) => {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set(obj, (res) => {
        // console.log('set to storage', obj, 'res:', res);
        if (typeof callback === 'function') callback(res);
        resolve(res);
      });
    })
  },
  getFromStorage: (keys, callback) => {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(keys, res => {
        // console.log('get from storage', keys, res);
        if (typeof callback === 'function') callback(res);
        resolve(res);
      });
    })
  },
  onChange: (callback, key) => {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== 'sync') return;

      if (key == null) callback(changes);
      if (changes.hasOwnProperty(key)) {
        const targetVal = changes[key];
        callback(targetVal.newValue, targetVal.oldValue)
      };

    });
  }
};

export default chromeApi;
