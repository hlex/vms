export default class TcpClient {
  client;
  constructor(client) {
    this.client = client;
  }
  send(data) {
    if (typeof data === 'string') {
      this.client.write(data);
    } else {
      this.client.write(JSON.stringify(data));
    }
  }
}