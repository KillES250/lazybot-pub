export const name = 'msg';
export const event = async function (data) {
  if (data.ch === 'tm' && data.content === 'ping') {
    this.ping = true;
  }

  if (data.ch !== 'chat' || !/^\d{6}$/.test(data.content)) return;

  const isJoinInfo = await this.bot.bindDb.col
    .find({ id: data.uid })
    .limit(1)
    .toArray();
  const isJoin = isJoinInfo.shift();
  if (isJoin) return;

  const userInfo = await this.bot.captchaDb.col
    .find({ name: data.name })
    .limit(1)
    .toArray();
  const user = userInfo.shift();

  if (user && data.content === user.code) {
    await this.bot.captchaDb.col.updateOne(
      { name: data.name },
      { $set: { verified: true, id: data.uid } },
      { upsert: true }
    );
  }
};
