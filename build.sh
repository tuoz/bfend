#!/usr/bin/env bash

readonly currentDir=$(cd $(dirname $0); pwd)
cd ${currentDir}

rm -rf publish
rm -rf __gen_lib

cp -r lib __gen_lib

echo 'Compiling via Angular compiler'
$(npm bin)/ngc -p tsconfig-build.json --outDir publish

echo 'Copying package.json'
cp package.json publish/package.json
cp README.md publish/README.md

echo 'Copying resources'
cp lib/styles.less publish
cp -r __gen_lib/src/styles publish/src/styles
cp __gen_lib/src/components/layout/*.less publish/src/components/layout
cp -r __gen_lib/src/preloader publish/src/preloader

echo 'Cleaning up temporary files'
rm -rf __gen_lib
