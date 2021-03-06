import _ from 'lodash';
import moment from 'moment';
import { createLog } from '../helpers/global';


export default class TcpClient {
  client;
  queue;
  busy;
  histories;
  constructor(client) {
    this.client = client;
    this.queue = new Queue();
    this.busy = false;
    this.histories = [];
  }
  send(data) {
    console.log('%c App Send Data:', createLog(null, 'orange', '#fff'), data, this.busy);
    this.queue.push(data);
    if (!this.busy) {
      this.doSend();
    }
  }
  doSend() {
    const data = this.queue.pop();
    // console.log('doSend()', data);
    if (data) {
      setTimeout(() => {
        if (typeof data === 'string') {
          this.client.write(data);
        } else {
          this.client.write(JSON.stringify(data));
        }
        this.busy = true;
        this.histories.push({
          ...data,
          time: moment().format('HH:mm:ss'),
        });
        // console.log('this.histories.length', this.histories, this.histories.length);
        if (this.histories.length === 20) {
          this.histories = _.tail(this.histories);
        }
      }, 1000);
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
  constructor(initialData = []) {
    this.data = initialData;
  }
  push(data) {
    this.data.push(data);
    // console.log('this.data.length', this.data, this.data.length);
    if (this.data.length > 3) {
      this.data = _.tail(this.data);
    }
  }
  pop() {
    const target = _.head(this.data);
    this.data = _.filter(this.data, (d, i) => i !== 0);
    return target;
  }
}
