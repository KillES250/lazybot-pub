import genChinaDate from '../utils/genChinaDate.js';
import { checkPerm } from '../utils/permission.js';

const serverList = [1, 2, 3, 4, 5];

export const name = 'mpz';
export const perm = 'user';
export const fuc = async function (msg, server) {
  const canRun = checkPerm(msg.user_id, perm);
  if (!canRun || !serverList.includes(Number(server))) return;

  let message = ``;
  const hour = new Date().getHours();
  if (hour < 18 || hour > 22) {
    message += `门派战尚未开启`;
  } else {
    const mpzData = await this.otherDb.col
      .find({ server: Number(server), type: 'mpz' })
      .sort({ time: 1 })
      .toArray();
    const time = new Date().getTime();

    if (!mpzData) {
      message += `暂未记录门派战信息`;
    } else {
      message = [];
      const isOpen = mpzData.filter((info) => info.time + 18e5 >= time);
      const canOpen = mpzData.filter((info) => info.time + 36e5 <= time);
      const isInCd = mpzData.filter(
        (info) => info.time + 18e5 <= time && info.time + 36e5 >= time
      );

      canOpen.length &&
        message.push(`可开启：${canOpen.map((info) => info.name).join('、')}`);
      isInCd.length &&
        message.push(`冷却中：
    ${isInCd.map(
      (info) => `${info.name}    可开启时间：${genChinaDate(info.time + 36e5)}`
    ).join(`
    `)}`);
      const vsInfo = [];
      isOpen.forEach((info) => {
        if (!vsInfo.some(({ name }) => name === info.fight)) {
          vsInfo.push(info);
        }
      });
      vsInfo.length &&
        message.push(`开启中：
    ${vsInfo.map(
      (info) =>
        `${info.name}VS${info.fight}    开启时间：${genChinaDate(info.time)}`
    ).join(`
    `)}`);
      message = message.join('\n');
    }
  }
  msg.quick_action(message);
};
