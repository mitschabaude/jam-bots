import {createJam, importDefaultIdentity, on} from 'jam-core';
import {getAvatar, jamOptions, roomId} from './bot-common';

(async () => {
  importDefaultIdentity({
    info: {
      name: 'Arnold',
      avatar: await getAvatar(),
    },
    seed: 'bot-moderator-' + window.SCRIPT_INDEX,
  });

  let [state, api] = createJam(jamOptions);
  const {createRoom, addSpeaker, setProps, enterRoom, onState, sendReaction} =
    api;

  createRoom(roomId, {
    name: 'Bot Room',
    description: 'A room for load testing',
    color: '#000000',
  });
  setProps({roomId});
  enterRoom(roomId);

  const raisedHands = new Set();
  on(state.swarm.peerState, (peerId, {handRaised}) => {
    if (handRaised && !raisedHands.has(peerId)) {
      raisedHands.add(peerId);
      setTimeout(() => addSpeaker(roomId, peerId), Math.random() * 2000);
    }
    if (!handRaised && raisedHands.has(peerId)) {
      raisedHands.delete(peerId);
    }
  });

  // react to moderators speaking
  let nSpeaking = 0;
  onState('speaking', speaking => {
    let nSpeaking_ = speaking.size;
    if (nSpeaking_ > nSpeaking && Math.random() < 0.2) {
      sendReaction('🤔');
    }
    nSpeaking = nSpeaking_;
  });
})();
