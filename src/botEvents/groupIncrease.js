import { Structs } from 'node-napcat-ts';
import genCaptcha from '../utils/genCaptcha.js';

export const name = 'notice.group_increase.approve';
export const event = async function (data) {
  this.set_group_ban({
    group_id: data.group_id,
    user_id: data.user_id,
    duration: 30 * 60,
  });
  const code = genCaptcha();
  this.send_group_msg({
    group_id: data.group_id,
    message: [
      Structs.at(data.user_id),
      Structs.text(
        `请用你申请时所填的角色名在世界频道发送：${code}，有效期三分钟，三分钟后将验证，过时未验证将踢出群聊。`
      ),
    ],
  });
  await this.captchaDb.col.updateOne(
    { qq: data.user_id },
    { $set: { code } },
    { upsert: true }
  );

  setTimeout(async () => {
    const userInfo = await this.captchaDb.col
      .find({ qq: data.user_id })
      .limit(1)
      .toArray();
    const user = userInfo.shift();
    if (!user.verified) {
      this.set_group_kick({
        group_id: data.group_id,
        user_id: data.user_id,
      });
    } else {
      this.set_group_ban({
        group_id: data.group_id,
        user_id: data.user_id,
        duration: 0,
      });
      this.bindDb.col.updateOne(
        { qq: data.user_id },
        {
          $set: {
            time: new Date().getTime(),
            id: user.id,
            name: user.name,
          },
        },
        { upsert: true }
      );
    }
    await this.captchaDb.col.deleteOne({ qq: data.user_id });
  }, 3 * 60 * 1000);
};
