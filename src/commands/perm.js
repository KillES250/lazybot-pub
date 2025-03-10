import { checkPerm, comparePerm, setPerm } from '../utils/permission.js';

export const name = 'perm';
export const perm = 'admin';
export const fuc = async function (msg, userID, wsiiSetPerm) {
  const canRun = checkPerm(msg.user_id, perm);
  if (!canRun) return;
  let message = ``;

  const canSet = comparePerm(msg.user_id, userID, wsiiSetPerm);

  if (canSet) {
    const isOK = await setPerm(userID, wsiiSetPerm);
    message += isOK
      ? `设置成功，${userID}的当前权限为：${wsiiSetPerm}`
      : `操作失败`;
  } else {
    message += `权限不足`;
  }
  msg.quick_action(message);
};
