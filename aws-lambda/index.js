const {readFile} = require('fs/promises');
const chromium = require('chrome-aws-lambda');
const run = require('./runPrebuilt.js');
const path = require('path');
const absPath = p => path.resolve(__dirname, p);

exports.handler = async event => {
  console.log(event);

  let [audienceBot, speakerBot, moderatorBot] = await Promise.all([
    readFile(absPath('./build/bot-audience.js'), {encoding: 'utf8'}),
    readFile(absPath('./build/bot-speaker.js'), {encoding: 'utf8'}),
    readFile(absPath('./build/bot-moderator.js'), {encoding: 'utf8'}),
  ]);

  let {
    roomId = 'bot-test',
    speakers = 0,
    audience = 0,
    moderator = false,
    timeout = 20,
    id = 'aws',
    jamDomain = 'beta.jam.systems',
    pantryUrl,
    sfu = false,
  } = event;

  let jamConfig = {
    urls: {
      pantry: pantryUrl ?? `https://${jamDomain}/_/pantry`,
      stun: `stun:stun.${jamDomain}:3478`,
      turn: `turn:turn.${jamDomain}:3478`,
      turnCredentials: {username: 'test', credential: 'yieChoi0PeoKo8ni'},
    },
    development: true,
    sfu,
  };
  let env = {roomId, instanceId: id, jamConfig};

  console.log(`/${roomId}`, jamConfig.urls);

  console.log('starting puppeteer...');
  let timeoutPromise = new Promise(r => setTimeout(r, timeout * 1000));
  let browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: true,
    ignoreHTTPSErrors: true,
  });

  if (moderator) {
    console.log('starting moderator and trying to create room...');
    run(moderatorBot, 1, {env, browser, noLogs: true});
    await new Promise(r => setTimeout(r, 3000));
  }
  console.log(`starting ${speakers} speaker and ${audience} audience bots`);
  if (speakers > 0) run(speakerBot, speakers, {env, browser, noLogs: true});
  if (audience > 0) run(audienceBot, audience, {env, browser, noLogs: true});

  await timeoutPromise;
  console.log('timeout reached, closing browser...');
  await new Promise(resolve => {
    let timeout = setTimeout(() => {
      resolve();
      if (browser && browser.process() != null)
        browser.process().kill('SIGINT');
    }, 5000);
    browser
      .close()
      .catch(err => {
        console.log('error closing browser');
        console.error(err);
      })
      .then(() => {
        clearTimeout(timeout);
        resolve();
      });
  });
  console.log('returning...');
  return {finished: true};
};
