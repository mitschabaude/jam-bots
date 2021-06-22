import {createJam, until} from 'jam-core';

const [state, api] = createJam({
  jamConfig: {
    urls: {
      pantry: `http://localhost:3001`,
      stun: `stun:stun.jam.systems:3478`,
      turn: `turn:turn.jam.systems:3478`,
      turnCredentials: {username: 'test', credential: 'yieChoi0PeoKo8ni'},
    },
    development: false,
    sfu: true,
  },
  debug: false,
});
const {setProps, setState, enterRoom, onState, sendReaction, updateInfo} = api;

console.log('myIdentity', JSON.stringify(state.myIdentity.info));

let roomId = 'bot-test';
setProps({roomId});
enterRoom(roomId);
setState('handRaised', true);

// once speaker, periodically play random audio
until(state, 'iAmSpeaker').then(() => {
  setTimeout(() => playRandomSnippet(), 1000);
  setInterval(() => playRandomSnippet(), 15000 - 7500 * Math.random());
});
async function playRandomSnippet() {
  let i = (Math.random() * audioSnippets.length) | 0;
  let snippet = audioSnippets[i];
  if (!(snippet in blobs)) {
    blobs[snippet] = await fetch(`./audio-snippets/${snippet}`).then(r =>
      r.blob()
    );
  }
  setState('audioFile', {file: blobs[snippet]});
}
const blobs = {};
const audioSnippets = [
  'terminator_hasta_la_vista.mp3',
  'terminator_ill_be_back.mp3',
  'terminator_no_problemo.mp3',
  'terminator_talk_to_the_hand.mp3',
  'terminator_you_are_terminated.mp3',
];

// set your own name & avatar
setTimeout(async () => {
  let blob = await fetch('./terminator.jpg').then(r => r.blob());
  let avatar = await new Promise(resolve => {
    let reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.addEventListener('load', () => resolve(reader.result));
  });
  updateInfo({
    name: 'Arnold ' + ((Math.random() * 100) | 0),
    avatar,
  });
}, 1000);

// react with +100 to moderators speaking
let nSpeaking = 0;
onState('speaking', speaking => {
  let nSpeaking_ = [...speaking].filter(speaker =>
    state.room.moderators.includes(speaker)
  ).length;
  if (nSpeaking_ > nSpeaking && Math.random() < 0.2) {
    sendReaction('💯');
  }
  nSpeaking = nSpeaking_;
});
