import { checkPerm } from '../utils/permission.js';
import { genMsgImage } from '../utils/genImage.js';
import { Structs } from 'node-napcat-ts';

export const name = 'skill';
export const perm = 'user';
export const fuc = async function (msg, name) {
  const canRun = checkPerm(msg.user_id, perm);
  if (!canRun) return;
  let message = ``;
  let timeoutHandle;
  const userInfo = await this.userDb.col
    .find({ $or: [{ name }, { id: name }] })
    .sort({ time: -1 })
    .limit(1)
    .toArray();
  const user = userInfo.shift();
  if (!user && !/^[a-z0-9]+$/.test(name)) {
    msg.quick_action(`未找到该用户`);
    return;
  }
  const onceFuc = async (data) => {
    if (data === 1) message = `该用户自创技能未公开`;
    else if (data === 2) message = `没有这个技能`;
    else {
      const img = await genMsgImage(data);
      message = img ? Structs.image(img) : null;
    }
    clearTimeout(timeoutHandle);
    message && msg.quick_action(message);
  };

  timeoutHandle = setTimeout(() => {
    if (!message) {
      this.botEvent.off('mud.skill', onceFuc);
      message = `获取失败`;
      msg.quick_action(message);
    }
  }, 5e3);

  this.muds.get(user ? Number(user.server) : 1).send(`checkskill ${user ? user.id : name} help`);
  this.botEvent.once('mud.skill', onceFuc);
};
