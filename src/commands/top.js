import { checkPerm } from '../utils/permission.js';
import { genMsgImage } from '../utils/genImage.js';
import { Structs } from 'node-napcat-ts';

export const name = 'top';
export const perm = 'user';

const servers = [1, 2, 3, 4, 5];
const chineseRank = '一二三四五六七八九十'.split('');

export const fuc = async function (msg, server) {
  const canRun = checkPerm(msg.user_id, perm);
  if (!canRun || !servers.includes(Number(server))) return;

  let message = ``;
  const topInfo = await this.otherDb.col.findOne({
    server: Number(server),
    type: 'top',
  });

  if (!topInfo) {
    message += `暂未记录擂台信息`;
  } else {
    const newTopInfo = topInfo.stats.map((info, index) => {
      switch (index) {
        case 0:
          return `<hio>天下第${chineseRank[index]}</hio>&nbsp;&nbsp;${info}`;
          break;
        case 1:
          return `<hiz>天下第${chineseRank[index]}</hiz>&nbsp;&nbsp;${info}`;
          break;
        case 2:
          return `<hij>天下第${chineseRank[index]}</hij>&nbsp;&nbsp;${info}`;
          break;
        default:
          return `<hic>天下第${chineseRank[index]}</hic>&nbsp;&nbsp;${info}`;
          break;
      }
    });
    const img = await genMsgImage(newTopInfo.join('\n'));

    message = img ? Structs.image(img) : '获取失败';
  }

  msg.quick_action(message);
};
