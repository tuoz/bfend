#!/usr/bin/env bash

readonly currentDir=$(cd $(dirname $0); pwd)
cd ${currentDir}
rm -rf publish

echo 'Copying lib'
cp -r lib publish

echo 'Copying package.json'
cp package.json publish/package.json
cp README.md publish/README.md
