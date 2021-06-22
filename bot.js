import {createJam} from 'jam-core';
import terminator from './terminator.json';

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
const {setProps, enterRoom, onState, sendReaction, updateInfo} = api;

console.log('myIdentity', JSON.stringify(state.myIdentity.info));

let roomId = 'bot-test';
setProps({roomId});
enterRoom(roomId);

// with a probability 30%, set your own name & avatar within 30 sec
if (Math.random() < 0.3) {
  setTimeout(async () => {
    updateInfo({
      name: 'Unit ' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[(Math.random() * 26) | 0],
      avatar: terminator,
    });
  }, 10000 + Math.random() * 20000);
}

// react with heart to someone speaking
let nSpeaking = 0;
onState('speaking', speaking => {
  if (speaking.size > nSpeaking) {
    sendReaction('❤️');
  }
  nSpeaking = speaking.size;
});

// random reaction storms
setInterval(async () => {
  if (Math.random() < 0.005) {
    for (let i = 0; i < 20; i++) {
      sendReaction('😅');
      await new Promise(r => setTimeout(r, 50));
    }
  }
}, 1000);
