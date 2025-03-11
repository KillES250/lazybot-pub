export const name = 'items'
export const event = async function (data) {
  for (const item of data.items) {
    if (!item || item.p || !item.name) {
      continue;
    }

    if (item.name.includes('帮会管理员')) {
      const id = item.id;
      this.send(`partylist ${id}`);
      this.send('jh fam 0 start');
      this.send('go south');
      this.send('go east');
      this.send('go up');
    }
  }
};