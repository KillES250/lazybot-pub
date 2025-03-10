import commandParse from '../utils/commandParse.js';

export const name = 'message';
export const event = async function (data) {
  const hasStr = data.message.some(({ type }) => type === 'text');
  if (!hasStr) return;
  const text = data.raw_message.replace(/\[.+\]/, '');
  const cmdInfo = commandParse(text);
  if (!cmdInfo) return;

  const hasCmd = this.commands.find(({ name }) => name === cmdInfo.cmd);
  if (hasCmd) {
    hasCmd.fuc(data, ...cmdInfo.args);
  }
};
