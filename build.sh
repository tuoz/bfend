#!/usr/bin/env bash

readonly currentDir=$(cd $(dirname $0); pwd)
cd ${currentDir}

rm -rf publish
rm -rf __gen_lib
rm -rf publish-es2015

cp -r lib __gen_lib
node ./scripts/inline-template.js

echo 'Compiling to es2015 via Angular compiler'
$(npm bin)/ngc -p tsconfig-build.json -t es2015 --outDir publish-es2015/src

mv publish-es2015/src publish

echo 'Cleaning up temporary files'
rm -rf __gen_lib

echo 'Copying assets'
cp -r assets publish/assets

echo 'Copying package.json'
cp package.json publish/package.json
cp README.md publish/README.md
