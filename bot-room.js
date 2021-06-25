import puppeteer from 'puppeteer';
import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import run from './run.js';
import deviceId from './device-id.js';

const cliOptions = [
  {
    name: 'room-id',
    type: String,
    defaultOption: true,
    defaultValue: 'bot-test',
    description: 'The room id.',
  },
  {
    name: 'jam-domain',
    type: String,
    defaultValue: 'beta.jam.systems',
    description: 'The Jam domain used by bots, default is `beta.jam.systems`',
  },
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    defaultValue: false,
    description: 'Print this information.',
  },
  {
    name: 'speakers',
    alias: 's',
    type: Number,
    defaultValue: 2,
    description: 'The number of speaker bots.',
  },
  {
    name: 'audience',
    alias: 'a',
    type: Number,
    defaultValue: 5,
    description: 'The number of audience bots.',
  },
  {
    name: 'local-pantry',
    alias: 'l',
    type: Boolean,
    defaultValue: false,
    description: 'Sets the pantry URL to `http://localhost:3001`.',
  },
  {
    name: 'sfu',
    type: Boolean,
    defaultValue: false,
    description: 'Use an SFU.',
  },
  {
    name: 'no-mod',
    type: Boolean,
    defaultValue: false,
    description: 'Do not invite moderator bot.',
  },
  {
    name: 'no-headless',
    type: Boolean,
    defaultValue: false,
    description: 'Open the Chrome browser UI that runs your scripts.',
  },
];

let {
  'room-id': roomId,
  'jam-domain': jamDomain,
  'local-pantry': localPantry,
  help,
  'no-mod': noModerator,
  speakers,
  audience,
  sfu,
  'no-headless': noHeadless,
} = commandLineArgs(cliOptions);
if (help) {
  console.log(
    commandLineUsage([
      {
        header: 'Jam Bot Room CLI',
        content: ['node bot-room.js [{underline room-id}] [options]'],
      },
      {
        header: 'Options',
        optionList: cliOptions,
      },
    ])
  );
  process.exit(1);
}

(async () => {
  let jamConfig = {
    urls: {
      pantry: localPantry
        ? 'http://localhost:3001'
        : `https://${jamDomain}/_/pantry`,
      stun: `stun:stun.${jamDomain}:3478`,
      turn: `turn:turn.${jamDomain}:3478`,
      turnCredentials: {username: 'test', credential: 'yieChoi0PeoKo8ni'},
    },
    development: true,
    sfu,
  };
  let env = {
    roomId,
    instanceId: await deviceId('jam'),
    jamConfig,
  };
  console.log(`/${roomId}`, jamConfig.urls);

  console.log('starting puppeteer...');
  let browser = await puppeteer.launch({headless: !noHeadless});
  if (!noModerator) {
    console.log('starting moderator and trying to create room...');
    run('bot-moderator.js', 1, {env, browser, noLogs: true});
    await new Promise(r => setTimeout(r, 3000));
  }
  console.log(`starting ${speakers} speaker and ${audience} audience bots`);
  if (speakers > 0)
    run('bot-speaker.js', speakers, {env, browser, noLogs: true});
  if (audience > 0)
    run('bot-audience.js', audience, {env, browser, noLogs: true});
})();
