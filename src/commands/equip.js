import { checkPerm } from '../utils/permission.js';

const levels = {
  1: { type: 'orange', name: '橙' },
  2: { type: 'red', name: '红' },
};
const serverList = [1, 2, 3, 4, 5];
const serverName = ['一区', '二区', '三区', '四区', '测试服'];

export const name = 'equip';
export const perm = 'user';
export const fuc = async function (msg, server, level) {
  const canRun = checkPerm(msg.user_id, perm);
  if (
    !canRun ||
    !(Number(level) in levels) ||
    !serverList.includes(Number(server))
  )
    return;
  let message = ``;
  const equipInfo = await this.otherDb.col.findOne({
    type: 'equip',
    server: Number(server),
  });
  if (!equipInfo) {
    message += `暂未记录装备获得信息`;
  } else {
    message += `${serverName[server - 1]}${levels[level].name}装获得情况如下：
${Object.keys(equipInfo[levels[level].type])
  .map((item) => `${item}: ${equipInfo[levels[level].type][item]}`)
  .join('\n')}`;
  }
  msg.quick_action(message);
};
