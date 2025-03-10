export const name = 'tip';
export const event = async function ({ msg }) {
  if (msg.includes('说：')) {
    return;
  }
  if (msg.includes('本店现有以下拍卖物品')) {
    this.bot.botEvent.emit('mud.auction', msg);
  }

  if (msg.includes('看起来')) {
    this.bot.botEvent.emit('mud.look', msg);
  }

  if (msg === '没有这个玩家。') {
    this.bot.botEvent.emit('mud.look', false);
  }

  if (msg === '你只能查看公开的技能信息。') {
    this.bot.botEvent.emit('mud.skill', 1);
  }

  if (msg === '没有这个技能。') {
    this.bot.botEvent.emit('mud.skill', 2);
  }

  if (msg.includes('绝招')) {
    this.bot.botEvent.emit('mud.skill', msg);
  }
};
