import {createJam, importDefaultIdentity, until} from 'jam-core';
import {botIndex, deviceId, getAvatar, jamOptions, roomId} from './bot-common';

(async () => {
  console.log('SPEAKER', botIndex);
  importDefaultIdentity({
    info: {
      name: `Arnold ${1 + botIndex}`,
      avatar: await getAvatar(),
    },
    seed: `bot-speaker-${deviceId}-${botIndex}`,
  });

  let [state, api] = createJam(jamOptions);
  const {setProps, setState, enterRoom, onState, sendReaction} = api;

  console.log('SPEAKER myId', JSON.stringify(state.myId), botIndex);

  setProps({roomId});
  enterRoom(roomId);
  setState('handRaised', true);

  // set up custom stream
  let ctx = new AudioContext();
  let streamDestination = ctx.createMediaStreamDestination();
  let customStream = streamDestination.stream;
  setProps({customStream});

  // once speaker, periodically play random audio
  until(state, 'iAmSpeaker').then(() => {
    setTimeout(() => {
      playRandomSnippet();
      setInterval(() => playRandomSnippet(), 10000);
    }, 1000 + 3000 * botIndex);
  });
  async function playRandomSnippet() {
    let i = (Math.random() * audioSnippets.length) | 0;
    let snippet = audioSnippets[i];
    let audioBuffer = audioBuffers[snippet];
    if (audioBuffer === undefined) {
      let response = await fetch(`./audio-snippets/${snippet}`);
      let audioData = await response.arrayBuffer();
      audioBuffer = await ctx.decodeAudioData(audioData);
      audioBuffers[snippet] = audioBuffer;
    }
    let sourceNode = ctx.createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.connect(streamDestination);
    sourceNode.start();
  }
  const audioBuffers = {};
  const audioSnippets = [
    'terminator_hasta_la_vista.mp3',
    'terminator_ill_be_back.mp3',
    'terminator_no_problemo.mp3',
    'terminator_talk_to_the_hand.mp3',
    'terminator_you_are_terminated.mp3',
  ];

  // react with +100 to others speaking
  let nSpeaking = 0;
  onState('speaking', speaking => {
    let nSpeaking_ = [...speaking].filter(id => id !== state.myId).length;
    if (nSpeaking_ > nSpeaking && Math.random() < 0.2) {
      sendReaction('💯');
    }
    nSpeaking = nSpeaking_;
  });
})();
