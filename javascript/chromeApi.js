const chromeApi = {
  set2Strage: async (key, value) => {
    return chrome.storage.local.set({ [key]: value });
  },
  getFromStorage: async (keys) => {
    return chrome.storage.local.get(keys);
  },
  onChange: (callback, key) => {
    chrome.storage.onChanged.addListener((changes) => {
      if (key == null) callback(changes);
      if (changes.hasOwnProperty(key)) {
        const targetVal = changes[key];
        callback(targetVal.newValue, targetVal.oldValue)
      };

    });
  },
  getCurrentTab: async () => {
    const queryOptions = { active: true, currentWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  },
  getTabs: async () => {
    return chrome.tabs.query({currentWindow: true});
  },
};

export default chromeApi;
