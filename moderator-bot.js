import {createJam, on} from 'jam-core';

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
const {
  createRoom,
  addSpeaker,
  setProps,
  enterRoom,
  onState,
  sendReaction,
  updateInfo,
} = api;

console.log('myIdentity', JSON.stringify(state.myIdentity.info));

let roomId = 'bot-test';
createRoom(roomId, {
  name: 'Bot Room',
  description: 'A room for load testing',
  color: '#000000',
});
setProps({roomId});
enterRoom(roomId);

const raisedHands = new Set();
on(state.swarm.peerState, (peerId, state) => {
  if (state.handRaised && !raisedHands.has(peerId)) {
    raisedHands.add(peerId);
    setTimeout(() => addSpeaker(roomId, peerId), Math.random() * 10000);
  }
});

// set your own name & avatar
setTimeout(async () => {
  let blob = await fetch('./terminator.jpg').then(r => r.blob());
  let avatar = await new Promise(resolve => {
    let reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.addEventListener('load', () => resolve(reader.result));
  });
  updateInfo({
    name: 'Arnold 0',
    avatar,
  });
}, 1000);

// react to moderators speaking
let nSpeaking = 0;
onState('speaking', speaking => {
  let nSpeaking_ = speaking.size;
  if (nSpeaking_ > nSpeaking && Math.random() < 0.2) {
    sendReaction('🤔');
  }
  nSpeaking = nSpeaking_;
});
