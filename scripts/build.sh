$(npm bin)/ng build bfend --prod

echo 'Copying resources'
cp bfend/src/styles.less dist/bfend/
cp -r bfend/src/styles dist/bfend/styles
cp bfend/src/lib/components/layout/*.less dist/bfend/lib/components/layout

$(npm bin)/ts-node scripts/post-build.ts
