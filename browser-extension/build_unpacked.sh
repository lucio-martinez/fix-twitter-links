#!/usr/bin/env bash

PATH_TO_UNPACKED_DIRECTORY='./unpacked'

PATH_TO_ICONS_SOURCE='../icons'

PATH_TO_SCRIPT_SOURCE='../user-script/tweet-pure-links.user.js'
PATH_TO_SCRIPT_TARGET='./unpacked/main.js'

PATH_TO_MANIFEST_SOURCE='./manifest.json'

echo "Building browser extension in an unpacked version..."

mkdir $PATH_TO_UNPACKED_DIRECTORY

cp -r $PATH_TO_ICONS_SOURCE $PATH_TO_UNPACKED_DIRECTORY
cp $PATH_TO_SCRIPT_SOURCE $PATH_TO_SCRIPT_TARGET
cp $PATH_TO_MANIFEST_SOURCE $PATH_TO_UNPACKED_DIRECTORY

echo "Successfully built an unpacked version!"
