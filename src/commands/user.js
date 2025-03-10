import genChinaDate from '../utils/genChinaDate.js';
import { checkPerm } from '../utils/permission.js';

const level = ['普通百姓', '武士', '武师', '宗师', '武圣', '武帝', '武神'];
const server = ['一区', '二区', '三区', '四区', '测试服'];

export const name = 'user';
export const perm = 'user';
export const fuc = async function (msg, name) {
  const canRun = checkPerm(msg.user_id, perm);
  if (!canRun) return;
  if (!name) return;
  let message = ``;
  const userInfo = await this.userDb.col.findOne(
    { $or: [{ name }, { id: name }] },
    { sort: { time: -1 } }
  );
  if (!userInfo) {
    message += `未找到该用户`;
  } else {
    message += `用户名：${userInfo.name}
id：${userInfo.id}
服务器：${server[userInfo.server - 1]}
气血：${userInfo.hp}
内力：${userInfo.mp}
等级：${level[userInfo.level - 1]}
曾用名：${userInfo.formerNames.length ? userInfo.formerNames.join(' ') : '无'}
更新时间：${genChinaDate(userInfo.time)}`;
  }
  msg.quick_action(message);
};
