import { checkPerm } from '../utils/permission.js';
import { genMsgImage } from '../utils/genImage.js';
import { Structs } from 'node-napcat-ts';

const servers = [1, 2, 3, 4, 5];

export const name = 'money';
export const perm = 'user';
export const fuc = async function (msg, server) {
  const canRun = checkPerm(msg.user_id, perm);
  if (!canRun || !servers.includes(Number(server))) return;
  let message = ``;
  let timeoutHandle;
  const onceFuc = async (data) => {
    const img = await genMsgImage(data);
    message = img ? Structs.image(img) : null;
    message && msg.quick_action(message);
    clearTimeout(timeoutHandle);
  };

  timeoutHandle = setTimeout(() => {
    if (!message) {
      this.botEvent.off('mud.money', onceFuc);
      message = `获取失败`;
      msg.quick_action(message);
    }
  }, 5e3);

  this.muds.get(Number(server)).send('stats money');
  this.botEvent.once('mud.money', onceFuc);
};
