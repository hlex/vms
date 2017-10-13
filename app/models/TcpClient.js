import _ from 'lodash';
import { createLog } from '../helpers/global';


export default class TcpClient {
  client;
  queue;
  busy;
  constructor(client) {
    this.client = client;
    this.queue = new Queue();
    this.busy = false;
  }
  send(data) {
    console.log('%c App Send Data:', createLog(null, 'orange', '#fff'), data);
    console.log('Queue --------->', this.queue, this.busy);
    this.queue.push(data);
    if (!this.busy) {
      this.doSend();
    }
  }
  doSend() {
    const data = this.queue.pop();
    console.log('doSend()', data);
    if (data) {
      if (typeof data === 'string') {
        this.client.write(data);
      } else {
        this.client.write(JSON.stringify(data));
      }
      this.busy = true;
    }
  }
  setFree() {
    this.busy = false;
  }
  setBusy() {
    this.busy = true;
  }
}

class Queue {
  data;
  constructor(initiatialData = []) {
    this.data = initiatialData;
  }
  push(data) {
    this.data.push(data);
  }
  pop() {
    const target = _.head(this.data);
    this.data = _.filter(this.data, (d, i) => i !== 0);
    return target;
  }
}
