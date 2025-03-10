import json5 from 'json5';
import { WebSocket } from 'ws';
import EventEmitter from 'events';

const servers = [
  'ws://120.77.213.218:25631',
  'ws://120.77.213.218:25632',
  'ws://120.77.213.218:25633',
  'ws://120.77.213.218:25634',
  'ws://120.77.182.178:25631',
];

class MudWebSocket extends EventEmitter {
  #commandList = [];
  #lastCommandTime = new Date().getTime();
  constructor(config) {
    super();
    this.ws = null;
    this.config = config;
    this.heartbeat = null;
    this.ping = false;
    this.init();
  }

  init() {
    try {
      this.ws = new WebSocket(servers[this.config.server - 1], {
        origin: 'http://game.wsmud.com',
      });
      this.ws.onopen = this.onOpen.bind(this);
      this.ws.onclose = this.onClose.bind(this);
      this.ws.onerror = this.onError.bind(this);
      this.ws.onmessage = this.onMessage.bind(this);
    } catch (e) {
      console.error(e);
      process.exit();
    }
  }

  reInit() {
    this.#commandList = [];
    clearTimeout(this.heartbeat);
    setTimeout(() => {
      this.init();
    }, 1e3);
  }

  onOpen() {
    this.ws.send(this.config.token);
  }

  onClose() {
    this.emit('close', this.config);
    this.reInit();
  }

  onError(error) {
    this.emit('error', error);
    this.reInit();
  }

  onMessage(message) {
    try {
      const data = /^{.*}$/.test(message.data)
        ? json5.parse(message.data)
        : {
            type: 'tip',
            msg: message.data,
          };
      this.emit(data.type, data);
    } catch (e) {
      this.emit('error', e);
    }
  }

  send(commandString) {
    if (typeof commandString !== 'string') {
      return;
    }

    this.#commandList.push(commandString);
    this.#commandQueue();
  }

  #hasCommand() {
    return this.#commandList.length > 0;
  }

  #commandQueue() {
    const nowTime = new Date().getTime();
    if (!this.#hasCommand() || this.ws.readyState !== 1) {
      return;
    }

    if (nowTime - this.#lastCommandTime < 5e2) {
      setTimeout(() => this.#commandQueue(), 5e2);
      return;
    }

    const command = this.#commandList.shift();
    this.ws.send(command);
    this.#lastCommandTime = nowTime;

    if (this.#hasCommand()) {
      setTimeout(() => this.#commandQueue(), 5e2);
    }
  }
}

export default MudWebSocket;
