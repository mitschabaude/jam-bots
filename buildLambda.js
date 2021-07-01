const esbuild = require('esbuild');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

let bundleDir = './aws-lambda/build';
if (!fs.existsSync(bundleDir)) fs.mkdirSync(bundleDir);

let scripts = ['bot-moderator.js', 'bot-speaker.js', 'bot-audience.js'];
for (let scriptPath of scripts) {
  const bundlePath = path.join(bundleDir, path.basename(scriptPath));
  esbuild.buildSync({
    bundle: true,
    entryPoints: [scriptPath],
    outfile: bundlePath,
    target: 'es2020',
    format: 'esm',
  });
}

fse.copySync('./assets', './aws-lambda/assets');
