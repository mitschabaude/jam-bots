import {mkdir, writeFile, readFile} from 'fs/promises';
import os from 'os';
import path from 'path';

export default async function deviceId(appName) {
  if (!appName || typeof appName !== 'string')
    throw Error('Must provide appName (string)');
  let dirPath = path.join(os.homedir(), '.cache', appName);
  let filePath = path.join(dirPath, 'device-id.txt');

  let deviceId;
  try {
    deviceId = await readFile(filePath, {encoding: 'utf8'});
  } catch {
    deviceId = Math.random().toString(36).slice(2);
    try {
      await writeFile(filePath, deviceId, {encoding: 'utf8'});
    } catch {
      await mkdir(dirPath, {recursive: true});
      await writeFile(filePath, deviceId, {encoding: 'utf8'});
    }
  }
  return deviceId;
}
