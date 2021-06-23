const jamOptions = {
  jamConfig: window.jamConfig,
  debug: true,
};

const roomId = window.roomId ?? 'bot-test';
const deviceId = window.deviceId ?? '';
const botIndex = window.SCRIPT_INDEX;

export {jamOptions, roomId, deviceId, botIndex, getAvatar};

async function getAvatar() {
  let blob = await fetch('./terminator.jpg').then(r => r.blob());
  return new Promise(resolve => {
    let reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.addEventListener('load', () => resolve(reader.result));
  });
}
