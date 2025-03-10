function commandParse(str) {
  if (!str.startsWith('/')) return null;

  const data = {};
  const newStr = str.slice(1);
  const str2cmd = newStr.split(' ');

  if (!str2cmd.length) return null;

  data.cmd = str2cmd.shift();
  data.args = [...str2cmd];
  return data;
}

export default commandParse;
