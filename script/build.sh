#!/bin/bash

rm .cache public/*.html public/javascript/* public/stylesheet/*

# manifest.jsonのハードリンクをpublic以下に作成
if ! [[ -a "public/manifest.json" ]]; then
    ln manifest.json public/manifest.json
fi

# imageディレクトリのシンボリックリンクをpublic以下に作成
if ! [[ -d "public/image" ]]; then
    (
        cd public
        ln -s ../image .
    )
fi

parcel build *.html javascript/* stylesheet/* -d public/ --no-source-maps
