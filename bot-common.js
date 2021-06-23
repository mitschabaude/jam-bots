const jamOptions = {
  jamConfig: window.jamConfig ?? {
    urls: {
      pantry: `http://localhost:3001`,
      stun: `stun:stun.beta.jam.systems:3478`,
      turn: `turn:turn.beta.jam.systems:3478`,
      turnCredentials: {username: 'test', credential: 'yieChoi0PeoKo8ni'},
    },
    development: false,
    sfu: false,
  },
  debug: false,
};

let roomId = window.roomId ?? 'bot-test';
console.log('roomId', roomId);

export {jamOptions, roomId, getAvatar};

async function getAvatar() {
  let blob = await fetch('./terminator.jpg').then(r => r.blob());
  return new Promise(resolve => {
    let reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.addEventListener('load', () => resolve(reader.result));
  });
}
