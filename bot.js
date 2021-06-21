import {createJam} from 'jam-core';

const [state, api] = createJam({
  jamConfig: {
    urls: {
      pantry: `http://localhost:3001`,
      stun: `stun:stun.jam.systems:3478`,
      turn: `turn:turn.jam.systems:3478`,
      turnCredentials: {username: 'test', credential: 'yieChoi0PeoKo8ni'},
    },
    development: true,
    sfu: true,
  },
  debug: true,
});
const {createRoom, setProps, enterRoom} = api;

console.log('myIdentity', JSON.stringify(state.myIdentity));

let roomId = 'bot-test';
createRoom(roomId);
setProps({roomId});
enterRoom(roomId);
