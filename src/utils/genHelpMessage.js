export function genAllHelpMessage(title, helpList, flag) {
  const helpMessage = [];

  if (flag) {
    helpMessage.push('武神传说查询机器人\n');
    helpMessage.push('使用方法：/help [命令]\n');
  } else {
    helpMessage.push('\n');
  }
  helpMessage.push(`${title}`);
  helpList
    .sort((a, b) => {
      if (a.cmd < b.cmd) {
        return -1;
      }
      if (a.cmd > b.cmd) {
        return 1;
      }
      return 0;
    })
    .forEach(({ cmd, help }) => {
      helpMessage.push(`   ${cmd}${' '.repeat(15 - cmd.length)}${help}`);
    });
  return helpMessage.join('\n');
}
export function genOneHelpMessage(title, content, argList) {
  const helpMessage = [];

  helpMessage.push(title);
  helpMessage.push(`使用方法：${content}`);
  helpMessage.push(`可用参数：`);
  argList.forEach(({ arg, help }) => {
    helpMessage.push(`   ${arg}${' '.repeat(15 - arg.length)}${help}`);
  });
  return helpMessage.join('\n');
}
