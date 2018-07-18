import { exec } from 'child_process';
import { readFile, writeFile, readdir, write } from 'fs';
import { toPromise } from './utils';
import * as packageJson from '../package.json';

async function replaceLessImportPath() {
  const [ files ] = await toPromise(cbk => readdir('dist/bfend/styles', cbk));
  for (const f of files) {
    if (f.endsWith('.less')) {
      const filename = `dist/bfend/styles/${f}`;
      const [ buf ] = await toPromise(cbk => readFile(filename, cbk));
      let content = buf.toString();
      content = content.replace(/\.\.\/\.\.\/\.\.\/node_modules\//g, '../../');
      await toPromise(cbk => writeFile(filename, content, cbk));
    }
  }
}

async function replacePackageJson() {
  const [ buf ] = await toPromise(cbk => readFile('dist/bfend/package.json', cbk));
  let content = buf.toString();
  content = content.replace(/VERSION/, (packageJson as any).version);
  await toPromise(cbk => writeFile('dist/bfend/package.json', content, cbk));
}

async function main() {
  await replaceLessImportPath();
  await replacePackageJson();
}

main();
