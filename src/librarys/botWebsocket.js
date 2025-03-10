import { NCWebsocket } from 'node-napcat-ts';
import { EventEmitter } from 'events';

class BotWebSocket extends NCWebsocket {
  constructor({ baseUrl, accessToken }) {
    super({
      baseUrl,
      accessToken,
      throwPromise: true,
      reconnection: {
        enable: true,
        attempts: 10,
        delay: 5000,
      },
    });
    this.botEvent = new EventEmitter();
    this.commands = [];
    this.muds = new Map();
    this.connect();
  }
}

export default BotWebSocket;
