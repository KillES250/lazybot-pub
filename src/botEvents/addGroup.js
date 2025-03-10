export const name = 'request.group.add';
export const event = async function (data) {
  if (data.group_id !== 58806400) return;
  const name = data.comment.match(/问题：请输入角色名\n答案：(.*)/)[1];
  const userInfo = await this.userDb.col
    .find({ name })
    .sort({ time: -1 })
    .limit(1)
    .toArray();
  const user = userInfo.shift();
  if (!user) {
    data.quick_action(false, '未查询到此角色');
  } else {
    const isJoinInfo = await this.bindDb.col.find({ name }).limit(1).toArray();
    const isJoin = isJoinInfo.shift();
    if (isJoin) {
      data.quick_action(false, '此角色已进群');
      return;
    }

    await this.captchaDb.col.updateOne(
      { name: user.name, qq: data.user_id },
      {
        $set: { code: '', verified: false, id: '' },
      },
      { upsert: true }
    );
    data.quick_action(true);
  }
};
