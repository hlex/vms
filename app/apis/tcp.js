
import net from 'net';
import TcpClient from '../models/TcpClient';
import store from '../index';
import * as ApplicationActions from '../actions/applicationActions';
import { verifyServerResponseData } from '../helpers/tcp';

export const createTcpClient = (ip, port) => {
  const client = new net.Socket();
  client.connect(port, ip, () => {
    console.log('Client: Connected to Server\r\n');
  });
  // ======================================================
  // Add any listeners function chere...
  // ======================================================
  client.on('data', data => {
    const dataChunk = data.toString('utf8');
    console.log(`Client: Received: ${dataChunk}\r\n`);
    const dataObject = JSON.parse(dataChunk);
    if (verifyServerResponseData(dataObject)) {
      store.dispatch(ApplicationActions.receivedDataFromServer(dataObject));
    }
  });
  client.on('close', () => {
    console.log('Client: Connection closed');
  });

  // ======================================================
  // Create Object
  // ======================================================
  const tcpClient = new TcpClient(client);
  // ======================================================
  // Test Calling
  // ======================================================
  // tcpClient.send({
  //   action: 3,
  //   msg: '0',
  // });

  return tcpClient;
};
