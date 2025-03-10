import { Structs } from 'node-napcat-ts';
import genChinaDate from '../utils/genChinaDate.js';
import { checkPerm } from '../utils/permission.js';

const ch = {
  chat: '闲聊',
  es: '全区',
};
const server = ['一区', '二区', '三区', '四区', '测试服'];

export const name = 'msg';
export const perm = 'user';
export const fuc = async function (msg, userName, limit = 10) {
  const canRun = checkPerm(msg.user_id, perm);
  if (!canRun) return;
  let message = ``;
  if (!userName) {
    message += `请提供要查询聊天记录的用户名`;
  }
  let limit2num = Number(limit);
  if (!limit2num || typeof limit2num != 'number') {
    message += `聊天记录查询上限格式为数字，上限为50条`;
  }
  limit2num = limit2num > 50 ? 50 : limit2num;

  if (message === ``) {
    message = [];
    const messageList = await this.messageDb.col
      .find({ $or: [{ name: userName }, { id: userName }] })
      .sort({ time: -1 })
      .limit(limit2num)
      .toArray();

    if (messageList.length > 0) {
      messageList.forEach((data) => {
        const nodeMsg = Structs.customNode(`用户名：${data.name}
id：${data.id}
服务器：${server[data.server - 1]}
频道：${ch[data.type]}
内容：${data.message}
时间：${genChinaDate(data.time)}`);
        nodeMsg.data.nickname = userName;
        message.push(nodeMsg);
      });
    } else {
      message = Structs.text('未记录到该用户发言');
    }
  }

  const data = {
    message,
  };

  switch (msg.message_type) {
    case 'private':
      data.user_id = msg.user_id;
      break;
    case 'group':
      data.group_id = msg.group_id;
      break;
  }

  this.send_msg(data);
};
