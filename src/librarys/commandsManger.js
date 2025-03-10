import importAll from '../utils/importAll.js';

export async function loadCommands(dir) {
  const commands = await importAll(dir);
  return commands;
}

export function attackAllCommand(hand, commands) {
  const attackCmd = [];
  commands.forEach(({ name, fuc }) => {
    const newCmd = {
      name,
      fuc: fuc.bind(hand),
    };
    attackCmd.push(newCmd);
  });
  hand.commands = attackCmd;
}
