import Alpine from "@alpinejs/csp";
import { extension } from "../extension";

const features = {
    'nico-auto-start': {
        title: 'ニコ動自動再生',
        urlSubstring: 'nicovideo.jp/watch',
    },
    'pixiv': {
        title: 'pixiv',
        urlSubstring: 'pixiv.net',
    },
}
class ControlPageFeatures {
    checked: string[] = [];
    features = features;
    shown: Record<string, boolean> = {};

    init() {
        Object.keys(features).forEach(async key => {
            if (await extension.getItemFromStorage(key)) {
                this.checked.push(key);
            }
        });

        extension.getCurrentTab().then(tab => {
            Object.entries(this.features).forEach(([key, {urlSubstring}]) => {
                if (tab.url?.includes(urlSubstring)) {
                    this.shown[key] = true;
                }
            });
        });
    }

    handleChange(key: string) {
        return async () => {
            extension.setItemToStorage(key, this.checked.includes(key));
        }
    }
}
Alpine.data('controlPageFeatures', () => new ControlPageFeatures());

type Tab = Browser.tabs.Tab;

class TabList {
    tabs: Tab[] = [];
    message: string = '';
    allSelectCheckbox: boolean = false;
    selected: number[] = [];

    async init() {
        // this.tabs = await browser.tabs.query({ currentWindow: true });
        this.tabs = await extension.getCurrentWindowTabs();
    };

    handleAllSelect() {
        // console.log('set', this.allSelectCheckbox, this.selected)
        this.selected = this.allSelectCheckbox ? this.tabs.map(tab => tab.id ?? 0) : []
    }

    handleCopy() {
        const text = this.tabs
            .filter(tab => tab.id !== undefined && this.selected.map(Number).includes(tab.id))
            .map(tab => `- [${tab.title}](${tab.url})`)
            .join("\n")
       navigator.clipboard.writeText(text);

       this.message = 'コピーしました';
       window.setInterval(() => this.message = '', 2000)
    }

    handleSelect() {
        if (this.selected.length === this.tabs.length) {
            this.allSelectCheckbox = true;
        } else {
            this.allSelectCheckbox = false;
        }
    }
}
Alpine.data('tabList', () => new TabList())


Alpine.start()
