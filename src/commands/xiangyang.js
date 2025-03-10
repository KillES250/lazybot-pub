import genChinaDate from '../utils/genChinaDate.js';
import { checkPerm } from '../utils/permission.js';

const serverList = [1, 2, 3, 4, 5];

export const name = 'xy';
export const perm = 'user';
export const fuc = async function (msg, server) {
  const canRun = checkPerm(msg.user_id, perm);
  if (!canRun || !serverList.includes(Number(server))) return;

  let message = ``;
  const xyInfo = await this.otherDb.col.findOne({
    server: Number(server),
    type: 'xiangyang',
  });

  if (!xyInfo) {
    message += `暂未记录襄阳信息`;
  } else {
    const isOpen = !!xyInfo.beginTime;
    const canOpen = new Date().getTime() >= xyInfo.endTime + 36e5;
    message += `状态：${isOpen ? '开启中' : canOpen ? '可开启' : '冷却中'}`;
    if (isOpen) {
      if (xyInfo.isClan) message += `\n帮派：${xyInfo.isClan}`;
      message += `\n开启时间：${genChinaDate(xyInfo.beginTime)}`;
    }
    if (!isOpen && !canOpen) {
      message += `\n下次可开启时间：${genChinaDate(xyInfo.endTime + 36e5)}`;
    }
  }
  msg.quick_action(message);
};
