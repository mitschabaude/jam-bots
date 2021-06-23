import puppeteer from 'puppeteer';
import run from './run.js';

const nSpeakers = 1;
const nAudience = 2;
let env = {roomId: 'bot-test-4'};

(async () => {
  let browser = await puppeteer.launch({headless: true});

  run('bot-moderator.js', 1, {env, browser, noLogs: true});
  await new Promise(r => setTimeout(r, 3000));

  run('bot-speaker.js', nSpeakers, {env, browser, noLogs: false});
  run('bot-audience.js', nAudience, {env, browser, noLogs: true});
})();
