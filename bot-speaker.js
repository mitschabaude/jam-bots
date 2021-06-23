import {createJam, importDefaultIdentity, until} from 'jam-core';
import {getAvatar, jamOptions, roomId} from './bot-common';

(async () => {
  console.log('SPEAKER', window.SCRIPT_INDEX);
  importDefaultIdentity({
    info: {
      name: `Arnold ${1 + window.SCRIPT_INDEX}`,
      avatar: await getAvatar(),
    },
    seed: 'bot-speaker-' + window.SCRIPT_INDEX,
  });

  let [state, api] = createJam(jamOptions);
  const {setProps, setState, enterRoom, onState, sendReaction} = api;

  console.log('SPEAKER myId', JSON.stringify(state.myId), window.SCRIPT_INDEX);

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

  // react with +100 to moderators speaking
  let nSpeaking = 0;
  onState('speaking', speaking => {
    let nSpeaking_ = speaking.size;
    if (nSpeaking_ > nSpeaking && Math.random() < 0.2) {
      sendReaction('💯');
    }
    nSpeaking = nSpeaking_;
  });
})();
