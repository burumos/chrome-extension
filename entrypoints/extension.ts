export const extension = {
    getCurrentTab: async () => {
        const tabs = await browser.tabs.query({ currentWindow: true, active: true });
        return tabs[0];
    },

    getCurrentWindowTabs: async () => {
        return browser.tabs.query({ currentWindow: true });
    },

    getItemFromStorage: async <T>(key: string): Promise<T | null> => {
        return storage.getItem<T>(`local:${key}`);
    },

    setItemToStorage: async (key: string, value: any) => {
        return storage.setItem(`local:${key}`, value);
    },
}

export default { extension};