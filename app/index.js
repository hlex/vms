import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import net from 'net';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import './app.global.scss';

import { changeCoin } from './helpers/global';

const store = configureStore();
console.log('process.env', process.env);

let isFirstTime = false;

class Server {
  baht1;
  baht5;
  baht10;
  constructor() {
    this.baht1 = 10;
    this.baht5 = 10;
    this.baht10 = 10;
  }
  getCoinOneBaht() {
    return this.baht1;
  }
  getCoinFiveBaht() {
    return this.baht5;
  }
  getCoinTenBaht() {
    return this.baht10;
  }
  addCoinOneBaht(number) {
    this.baht1 += number;
  }
  addCoinFiveBaht(number) {
    this.baht5 += number;
  }
  addCoinTenBaht(number) {
    this.baht10 += number;
  }
  minusCoinOneBaht(number) {
    this.baht1 += number;
  }
  minusCoinFiveBaht(number) {
    this.baht5 += number;
  }
  minusCoinTenBaht(number) {
    this.baht10 += number;
  }
  canChange(changeCoins) {
    const minimumExistingCoin = 3;
    // {baht1: 0, baht5: 1, baht10: 4}
    if (changeCoins.baht1 > 0 && this.getCoinOneBaht() <= minimumExistingCoin) return false;
    if (changeCoins.baht5 > 0 && this.getCoinFiveBaht() <= minimumExistingCoin) return false;
    if (changeCoins.baht10 > 0 && this.getCoinTenBaht() <= minimumExistingCoin) return false;
    return true;
  }
}

const serverLog = 'background: blue; color: #fff';

if (process.env.NODE_ENV !== 'production') {
  console.log('development:createServer at 127.0.0.1:1337');
  const server = net.createServer(socket => {
    const sv = new Server();
    console.log('%c Init Server:', serverLog, sv);
    setTimeout(() => {
      socket.write(
        JSON.stringify({
          action: 4,
          initialized: 0,
        }),
      );
    }, 500);
    setTimeout(() => {
      socket.write(
        JSON.stringify({
          action: 4,
          initialized: 1,
        }),
      );
    }, 2000);

    // socket.pipe(socket);
    // setInterval(() => {
    //   socket.write(
    //     JSON.stringify({
    //       action: 0,
    //       sensor: 'temp',
    //       msg: {
    //         temp: 4.3,
    //       },
    //     }),
    //   );
    // }, 20000);
    // setInterval(() => {
    //   socket.write(
    //     JSON.stringify({
    //       action: 2,
    //       msg: 50,
    //     }),
    //   );
    // }, 10000);
    socket.on('data', data => {
      // ======================================================
      // Received data from client.write
      // ======================================================
      const dataChunk = data.toString('utf8');
      console.log('%c Server: Received: ', serverLog, dataChunk);
      const objectData = JSON.parse(dataChunk);
      // ======================================================
      // Declare Protocols
      // ======================================================
      if (objectData.action === 1 && objectData.msg !== 'failed') {
        console.log('%c Server: Drop product', serverLog, data);
        const successPercent = Math.floor(((Math.random() * 10))) + 1;
        console.log('successPercent', successPercent);
        if (successPercent <= 10 && !isFirstTime) {
          isFirstTime = true;
          setTimeout(() => {
            socket.write(
              JSON.stringify({
                action: 1,
                result: 'success',
                description: 'Item XX delivered',
              }),
            );
          }, 5000);
        } else {
          isFirstTime = false;
          setTimeout(() => {
            socket.write(
              JSON.stringify({
                action: 1,
                result: 'fail',
                description: 'Item delivered failed',
              }),
            );
          }, 5000);
        }
      }
      if (objectData.action === 2 && objectData.mode === 'coin') {
        console.log('%c Server: Cash Change', serverLog, Number(objectData.msg), changeCoin(Number(objectData.msg)));
        const changeCoins = changeCoin(Number(objectData.msg));
        if (sv.canChange(changeCoins)) {
          socket.write(
            JSON.stringify({
              action: 2,
              result: 'success',
              description: 'cash change completed',
            }),
          );
        } else {
          socket.write(
            JSON.stringify({
              action: 2,
              result: 'fail',
              description: 'cash change failed',
            }),
          );
        }
      }
      if (objectData.action === 2 && objectData.mode === 'remain') {
        console.log('%c Server: Cash remaining', serverLog, sv);
        socket.write(
          JSON.stringify({
            action: 2,
            result: 'success',
            remain: {
              baht1: sv.getCoinOneBaht(),
              baht5: sv.getCoinFiveBaht(),
              baht10: sv.getCoinTenBaht(),
            },
          }),
        );
      }
      if (objectData.action === 2 && objectData.mode === 'bill' && objectData.msg === '01') {
        // reset TAIKO
        socket.write(
          JSON.stringify({
            action: 2,
            msg: '01',
            result: 'success',
            description: 'reset completed'
          }),
        );
      }
      if (objectData.action === 2 && objectData.mode === 'both' && objectData.msg === '020') {
        // enable money box
        const success = {
          action: 2,
          msg: '020',
          result: 'success',
          description: 'Disable Off.'
        };
        const failed = {
          action: 2,
          msg: '020',
          result: 'failed',
          description: 'failed please try again'
        };
        socket.write(
          JSON.stringify(_.random(1, 5) <= 4 ? success : failed),
        );
      }
      if (objectData.action === 2 && objectData.mode === 'both' && objectData.msg === '021') {
        // enable money box
        const success = {
          action: 2,
          msg: '021',
          result: 'success',
          description: 'Disable On.'
        };
        const failed = {
          action: 2,
          msg: '021',
          result: 'failed',
          description: 'failed please try again'
        };
        socket.write(
          JSON.stringify(_.random(1, 5) <= 4 ? success : failed),
        );
      }
      // insert coin
      if (objectData.action === 999) {
        const insertedValue = Number(objectData.msg);
        if (insertedValue === 1) {
          sv.addCoinOneBaht(1);
        } else if (insertedValue === 5) {
          sv.addCoinFiveBaht(1);
        } else if (insertedValue === 10) {
          sv.addCoinTenBaht(1);
        }
        socket.write(
          JSON.stringify({
            action: 2,
            msg: insertedValue,
          }),
        );
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
