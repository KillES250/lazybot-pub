export const name = 'login';
export const event = async function (data) {
  if (!data.id) return;
  this.ping = true;

  this.heartbeat = setTimeout(() => {
    if (!this.ping) {
      this.ws.readyState === 1 && this.ws.close();
      this.init();
      return;
    }
    this.send('tm ping');
  }, 3e4);
};
