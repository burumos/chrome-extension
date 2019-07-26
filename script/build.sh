#!/bin/bash

rm .cache public/*

ln manifest.json public/manifest.json

# imageディレクトリのシンボリックリンクをpublic以下に作成
(
    cd public
    ln -s ../image .
)

parcel build *.html javascript/* stylesheet/* -d public/
