# chrome-extension

[chromeウェブストア](https://chrome.google.com/webstore/detail/something-extension/mjfblacpanbakejbdjegimihjkpgoljo?hl=ja)
で制限公開中のchromeブラウザ拡張機能

テストと自分用の便利機能と追加を目的とした拡張機能

## 機能
- オプション画面で設定したJavaScriptをAlt+Q(Mac:Ctrl+Q)で実行
- 右クリックメニューで`[サイトタイトル](URL)`の形式でクリップボートに
  コピーする項目を追加
- その他色々

## memo
### emacs用 ファイル保存後に自動的にbuildするscript

``` emacs-lisp
(defun build-extension ()
  (interactive)
  (if (string-match "/chrome-extension/" (buffer-file-name))
      (compile "yarn build")))
(add-hook 'after-save-hook 'build-extension)
;; hookを削除
;; (remove-hook 'after-save-hook 'build-extension)
```
