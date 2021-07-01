const {InvokeCommand, LambdaClient} = require('@aws-sdk/client-lambda');
const {handler} = require('./aws-lambda');

const local = false;
let speakers = 5;
let audience = 40;
let timeout = 90;

let commonArgs = {
  jamDomain: 'jam.dev.plusepsilon.com',
  sfu: true,
};
let speakersPerCall = 3;
let audiencePerCall = 10;
const lambda = new LambdaClient({});

(async () => {
  let firstSpeakers = Math.min(speakers, speakersPerCall - 1);
  speakers -= firstSpeakers;
  let lastSpeakers = speakers % speakersPerCall;
  speakers -= lastSpeakers;
  let speakerCalls = speakers / speakersPerCall;

  let lastAudience = audience % audiencePerCall;
  audience -= lastAudience;
  let audienceCalls = audience / audiencePerCall;

  console.log(
    `${firstSpeakers} + ${speakerCalls} * ${speakersPerCall} + ${lastSpeakers}`
  );
  console.log(`${audienceCalls} * ${audiencePerCall} + ${lastAudience}`);
  let j = 0;

  await call('aws', {moderator: true, speakers: firstSpeakers, timeout});
  await sleep(3);
  timeout -= 3;

  for (let i = 0; i < speakerCalls; i++, j++) {
    await call(`${j}`, {speakers: speakersPerCall, timeout});
    await sleep(3);
    timeout -= 3;
  }
  if (lastSpeakers > 0) {
    await call(`${j}`, {speakers: lastSpeakers, timeout});
    await sleep(3);
    timeout -= 3;
    j++;
  }

  for (let i = 0; i < audienceCalls; i++, j++) {
    await call(`${j}`, {audience: audiencePerCall, timeout});
    await sleep(3);
    timeout -= 3;
  }
  if (lastAudience > 0) {
    await call(`${j}`, {audience: lastAudience, timeout});
    await sleep(3);
    timeout -= 3;
  }
})();

function call(id, args) {
  console.log(id);
  if (args.timeout <= 5) return;
  args = {...commonArgs, ...args, id};
  if (local) {
    handler(args);
  } else {
    let command = new InvokeCommand({
      FunctionName: 'jam-bot',
      Payload: encode(args),
      InvocationType: 'Event',
    });
    return lambda.send(command);
  }
}

function sleep(sec) {
  return new Promise(r => setTimeout(r, sec * 1000));
}

function encode(obj) {
  return new TextEncoder().encode(JSON.stringify(obj));
}

// type BotArguments = Partial<{
//   id: string;
//   roomId: string;
//   speakers: number;
//   audience: number;
//   moderator: boolean;
//   timeout: number;
//   jamDomain: string;
//   pantryUrl: string;
//   sfu: boolean;
// }>;
