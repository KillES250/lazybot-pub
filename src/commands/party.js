import { checkPerm } from '../utils/permission.js';
import { genMsgImage } from '../utils/genImage.js';
import { Structs } from 'node-napcat-ts';

const servers = [1, 2, 3, 4, 5];

export const name = 'party';
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
      this.botEvent.off('mud.party', onceFuc);
      message = `获取失败`;
      msg.quick_action(message);
    }
  }, 5e3);

  this.muds.get(Number(server)).send('jh fam 0 start');
  this.muds.get(Number(server)).send('go south');
  this.muds.get(Number(server)).send('go south');
  this.muds.get(Number(server)).send('go east');
  this.botEvent.once('mud.party', onceFuc);
};
