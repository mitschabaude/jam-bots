import puppeteer from 'puppeteer';
import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import http from 'http';
import nodeStatic from 'node-static';

export default async function run(
  scriptPath,
  n,
  {
    env,
    browser,
    noLogs = false,
    noHeadless = false,
    noIncognito = false,
    noParallel = false,
  }
) {
  const port = 8100 + Math.floor(900 * Math.random());

  // build JS
  if (!fs.existsSync('/tmp/esbuild'))
    fs.mkdirSync('/tmp/esbuild', {recursive: true});
  const bundlePath = '/tmp/esbuild/' + path.basename(scriptPath);
  esbuild.buildSync({
    bundle: true,
    entryPoints: [scriptPath],
    outfile: bundlePath,
    target: 'es2020',
    format: 'esm',
  });

  // run dummy/file server
  const fileServer = new nodeStatic.Server('.');
  http
    .createServer((req, res) => {
      if (req.url === '/') {
        res.writeHead(200);
        res.end(dummyHtml);
      } else {
        fileServer.serve(req, res);
      }
    })
    .listen(port);

  async function handleContext(context, i) {
    let page = await context.newPage();
    if (!noLogs) {
      page.on(
        'console',
        n > 1
          ? msg => console.log(i, msg.text())
          : msg => console.log(msg.text())
      );
    }

    await page.goto(`http://localhost:${port}`);
    await page.evaluate(
      (env, i) => {
        window.SCRIPT_INDEX = i;
        if (env !== undefined)
          for (let key in env) {
            window[key] = env[key];
          }
      },
      env,
      i
    );

    await page.addScriptTag({type: 'module', path: bundlePath});
  }

  browser = browser ?? (await puppeteer.launch({headless: !noHeadless}));
  let newContext = !noIncognito
    ? () => browser.createIncognitoBrowserContext()
    : () => browser.defaultBrowserContext();
  let contexts = await Promise.all(Array(n).fill(0).map(newContext));
  let promises = [];
  for (let i = 0; i < n; i++) {
    let promise = handleContext(contexts[i], i);
    promises.push(promise);
    if (!noParallel) await promise;
  }
  await Promise.all(promises);
}

const dummyHtml = `<html>
  <head><link rel="icon" href="data:," /></head>
  <body></body>
</html>`;
