import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import net from 'net';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import './app.global.scss';

const store = configureStore();
console.log('process.env', process.env);

if (process.env.NODE_ENV !== 'production') {
  console.log('development:createServer at 127.0.0.1:1337');
  const server = net.createServer(socket => {
    // socket.pipe(socket);
    setInterval(() => {
      socket.write(
        JSON.stringify({
          action: 0,
          sensor: 'temp',
          msg: {
            temp: 4.3,
          },
        }),
      );
    }, 20000);
    setInterval(() => {
      socket.write(
        JSON.stringify({
          action: 2,
          msg: 50,
        }),
      );
    }, 10000);
    socket.on('data', data => {
      // ======================================================
      // Received data from client.write
      // ======================================================
      const dataChunk = data.toString('utf8');
      console.log('Server: I got your data = ', dataChunk);
      const objectData = JSON.parse(dataChunk);
      if (objectData.action === 1 && objectData.msg !== 'failed') {
        console.log('drop product');
        setTimeout(() => {
          socket.write(
            JSON.stringify({
              action: 1,
              result: 'success',
              description: '',
            }),
          );
        }, 5000);
      }
    });
    socket.on('error', err => {
      console.error(err);
    });
  });
  // server.listen(8080, '192.168.1.41');
  server.listen(1337, '127.0.0.1');
}
render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    const NextRoot = require('./containers/Root'); // eslint-disable-line global-require
    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('root'),
    );
  });
}

export default store;
