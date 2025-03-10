import { MongoClient } from 'mongodb';

class Mongo {
  constructor(colName) {
    this.colName = colName;
    try {
      this.client = new MongoClient('', {
        auth: {
          username: '',
          password: '',
        },
      });
      this.db = this.client.db('');
      this.db.createCollection(this.colName);
      this.col = this.db.collection(this.colName);
    } catch (e) {
      console.error(e);
      process.exit();
    }
  }
}

export default Mongo;
