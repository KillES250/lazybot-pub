import path from 'path';
import BotWebsocket from './src/librarys/botWebsocket.js';
import { attackAllCommand, loadCommands } from './src/librarys/commandsManger.js';
import Mongo from './src/librarys/database.js';
import { attackAllEvent, loadEvents } from './src/librarys/eventsManger.js';
import MudWebSocket from './src/librarys/mudWebsocket.js';
import { permsInit } from './src/utils/permission.js';

const MudConfig = [
  {
    server: 1,
    token: '',
  },
  {
    server: 2,
    token: '',
  },
  {
    server: 3,
    token: '',
  },
  {
    server: 4,
    token: '',
  },
  {
    server: 5,
    token: '',
  },
];

const bot = new BotWebsocket({
  baseUrl: '',
  accessToken: '',
});

bot.userDb = new Mongo('user');
bot.messageDb = new Mongo('message');
bot.otherDb = new Mongo('other');
bot.captchaDb = new Mongo('captcha');
bot.bindDb = new Mongo('bind');
permsInit();

const botEvents = await loadEvents(path.resolve(process.cwd(), 'src/botEvents'));
const mudEvents = await loadEvents(path.resolve(process.cwd(), 'src/mudEvents'));
const commands = await loadCommands(path.resolve(process.cwd(), 'src/commands'));
attackAllEvent(bot, botEvents);
attackAllCommand(bot, commands);

MudConfig.forEach((config) => {
  const mud = new MudWebSocket(config);
  mud.bot = bot;
  attackAllEvent(mud, mudEvents);
  bot.muds.set(config.server, mud);
});
