
import net from 'net';
import TcpClient from '../models/TcpClient';
import store from '../index';
import * as Actions from '../actions';
import * as ApplicationActions from '../actions/applicationActions';
// ======================================================
// Helpers
// ======================================================
import { verifyServerResponseData } from '../helpers/tcp';
import { createLog, cleanDataChunk } from '../helpers/global';

export const createTcpClient = (ip, port) => {
  const client = new net.Socket();
  client.connect(port, ip, () => {
    console.log('%c Client Connected to Server: ', createLog('client'), ip, port);
  });
  // ======================================================
  // Add any listeners function here...
  // ======================================================
  client.on('data', data => {
    const dataChunk = data.toString('utf8');
    console.log('dataChunk', dataChunk);
    const sanitizedDataChuck = cleanDataChunk(dataChunk);
    const dataObject = JSON.parse(sanitizedDataChuck);
    if (!dataObject.sensor) console.log('%c Client Received: ', createLog('client'), dataChunk);
    if (verifyServerResponseData(dataObject)) {
      store.dispatch(ApplicationActions.receivedDataFromServer(dataObject));
    }
  });
  client.on('close', () => {
    console.log('%c Client Connection closed: ');
  });
  client.on('error', (ex) => {
    console.log('handled error', ex);
    store.dispatch(ApplicationActions.startRecordEvent('hardwareError', {
      action: 'HARDWARE_CONNECTION_ERROR'
    }));
    store.dispatch(Actions.setApplicationMode('hardwareBoxServerDown'));
    console.log('Start timer 5 seconds');
    setTimeout(() => {
      console.log('Execute initApplication');
      store.dispatch(ApplicationActions.initApplication());
    }, 5000);
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
