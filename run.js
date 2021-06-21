import puppeteer from 'puppeteer';
import esbuild from 'esbuild';
import fs from 'fs';
import http from 'http';

run('bot.js', 20, {incognito: true});

async function run(
  path,
  n,
  {headless = true, incognito = false, loadParallel = true}
) {
  const port = 8374;

  // build JS
  if (!fs.existsSync('.build')) fs.mkdirSync('.build');
  esbuild.buildSync({
    bundle: true,
    entryPoints: [path],
    outfile: '.build/index.js',
    target: 'es2020',
    format: 'esm',
  });

  // run dummy server
  let server = http
    .createServer((req, res) => {
      res.writeHead(200);
      res.end(dummyHtml);
    })
    .listen(port);

  async function handleContext(context, i) {
    let page = await context.newPage();
    page.on(
      'console',
      n > 1 ? msg => console.log(i, msg.text()) : msg => console.log(msg.text())
    );

    await page.goto(`http://localhost:${port}`);
    await page.addScriptTag({
      type: 'module',
      path: './.build/index.js',
    });
  }

  let browser = await puppeteer.launch({headless});
  let newContext = incognito
    ? () => browser.createIncognitoBrowserContext()
    : () => browser.defaultBrowserContext();
  let contexts = await Promise.all(Array(n).fill(0).map(newContext));
  let promises = [];
  for (let i = 0; i < n; i++) {
    let promise = handleContext(contexts[i], i);
    promises.push(promise);
    if (!loadParallel) await promise;
  }
  await Promise.all(promises);

  // stop dummy server
  server.close();
}

const dummyHtml = `<html>
  <head><link rel="icon" href="data:," /></head>
  <body></body>
</html>`;
