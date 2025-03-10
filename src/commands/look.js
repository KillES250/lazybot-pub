import { checkPerm } from '../utils/permission.js';
import { genMsgImage } from '../utils/genImage.js';
import { Structs } from 'node-napcat-ts';

export const name = 'look';
export const perm = 'user';
export const fuc = async function (msg, name) {
  const canRun = checkPerm(msg.user_id, perm);
  if (!canRun) return;
  let message = ``;
  let timeoutHandle;
  const userInfo = await this.userDb.col.findOne(
    { $or: [{ name }, { id: name }] },
    { sort: { time: -1 } }
  );
  if (!userInfo) {
    msg.quick_action(`未找到该用户`);
    return;
  }

  const onceFuc = async (data) => {
    if (!data) message = `目标离线或id错误`;
    else {
      const img = await genMsgImage(data);
      message = img ? Structs.image(img) : null;
    }
    clearTimeout(timeoutHandle);
    message && msg.quick_action(message);
  };

  timeoutHandle = setTimeout(() => {
    if (!message) {
      this.botEvent.off('mud.look', onceFuc);
      message = `获取失败`;
      msg.quick_action(message);
    }
  }, 5e3);

  this.muds.get(Number(userInfo.server)).send(`look3 body of ${userInfo.id}`);
  this.botEvent.once('mud.look', onceFuc);
};
