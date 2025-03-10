import genChinaDate from '../utils/genChinaDate.js';
import { checkPerm } from '../utils/permission.js';

const level = ['武士', '武师', '宗师', '武圣', '武帝'];
const serverList = [1, 2, 3, 4, 5];

export const name = 'boss';
export const perm = 'user';
export const fuc = async function (msg, server) {
  const canRun = checkPerm(msg.user_id, perm);
  if (!canRun || !serverList.includes(Number(server))) return;

  let message = ``;
  const bossData = await this.otherDb.col.findOne({
    server: Number(server),
    type: 'boss',
  });

  if (!bossData) {
    message += `暂未记录Boss信息`;
  } else {
    const newBossInfo = bossData.bossList.map(
      (boss) =>
        `${level[boss.level - 1]}-${boss.name}  ${boss.room || '已被击杀'}`
    );
    newBossInfo.push(`下次刷新时间：${genChinaDate(bossData.nextTime)}`);
    message = newBossInfo.join('\n');
  }
  msg.quick_action(message);
};
