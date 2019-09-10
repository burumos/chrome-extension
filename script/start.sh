#!/bin/bash

# manifest.jsonのハードリンクをpublic以下に作成
if [[ -a "public/manifest.json" ]]; then
    rm public/manifest.json
fi
ln manifest.json public/manifest.json

# imageディレクトリのシンボリックリンクをpublic以下に作成
if ! [[ -d "public/image" ]]; then
    (
        cd public
        ln -s ../image .
    )
fi

# 変更を監視して、変更のたびにコンパイル
parcel watch *.html javascript/* stylesheet/* -d public/ --no-hmr --no-source-maps
