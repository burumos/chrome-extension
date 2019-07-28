const chromeApi = {
  set2Strage: (obj, callback) => {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set(obj, (res) => {
        console.log('set to storage', obj, 'res:', res);
        if (typeof callback === 'function') callback(res);
        resolve(res);
      });
    })
  },
  getFromStorage: (keys, callback) => {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(keys, res => {
        console.log('get from storage', keys, res);
        if (typeof callback === 'function') callback(res);
        resolve(res);
      });
    })
  }
};

export default chromeApi;
