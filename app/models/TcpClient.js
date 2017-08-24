import { createLog } from '../helpers/global';

export default class TcpClient {
  client;
  constructor(client) {
    this.client = client;
  }
  send(data) {
    console.log('%c App Send Data:', createLog(null, 'orange', '#fff'), data);
    if (typeof data === 'string') {
      this.client.write(data);
    } else {
      this.client.write(JSON.stringify(data));
    }
  }
}
