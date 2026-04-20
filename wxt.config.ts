import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    permissions: ['storage', 'contextMenus', 'activeTab', 'scripting', 'tabs', "commands"],
    name: 'Something Extension',
    version: '3.0.0',
    description: '自分用の色々やる個人的なExtension',
    commands: {
      "image-zoom": {
        suggested_key: {
          default: "Ctrl+B",
          mac: "Command+B"
        },
        description: "画像を拡大"
      }
    }
  },
});
