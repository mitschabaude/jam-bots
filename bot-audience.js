import {createJam, importDefaultIdentity} from 'jam-core';
import {botIndex, deviceId, getAvatar, jamOptions, roomId} from './bot-common';

(async () => {
  importDefaultIdentity({
    seed: `bot-audience-${deviceId}-${botIndex}`,
  });
  let [state, api] = createJam(jamOptions);
  const {setProps, enterRoom, onState, sendReaction, updateInfo} = api;

  console.log('AUDIENCE myId', JSON.stringify(state.myId), botIndex);

  setProps({roomId});
  enterRoom(roomId);

  // with a probability 10%, set your own name & avatar within 60 sec
  if (Math.random() < 0.1) {
    setTimeout(async () => {
      updateInfo({
        name: `Arnold ${100 + botIndex}`,
        avatar: await getAvatar(),
      });
    }, 10000 + Math.random() * 50000);
  }

  // sometimes react with heart to someone speaking
  let nSpeaking = 0;
  onState('speaking', speaking => {
    if (speaking.size > nSpeaking && Math.random() < 0.2) {
      sendReaction('❤️');
    }
    nSpeaking = speaking.size;
  });

  // random reaction storms
  setInterval(async () => {
    if (Math.random() < 0.0025) {
      for (let i = 0; i < 20; i++) {
        sendReaction('😅');
        await new Promise(r => setTimeout(r, 50));
      }
    }
  }, 1000);
})();
