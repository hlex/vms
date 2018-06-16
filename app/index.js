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

// ======================================================
// Variables
// ======================================================
const DROP_PRODUCT_DELAY_MS = 2000;
const MONEY_BOX_DELAY_MS = 500;
const SERVER_MODE = 4;

/*
  case1: disable 20
  case2: disable 50
  case3: disable 100
  default: disable 500
*/
class Server {
  canReceiveCoin;
  baht1;
  baht5;
  baht10;
  limitBanknote;
  constructor(mode) {
    this.canReceiveCoin = false;
    switch (mode) {
      case 1:
        this.baht1 = 1;
        this.baht5 = 1;
        this.baht10 = 1;
        break;
      case 2:
        this.baht1 = 1;
        this.baht5 = 1;
        this.baht10 = 2;
        break;
      case 3:
        this.baht1 = 5;
        this.baht5 = 5;
        this.baht10 = 5;
        break;
      default:
        this.baht1 = 10;
        this.baht5 = 10;
        this.baht10 = 10;
        break;
    }
    this.limitBanknote = 500;
  }
  getCanReceiveCoin() {
    return this.canReceiveCoin;
  }
  setCanReceiveCoin(canReceiveCoin) {
    this.canReceiveCoin = canReceiveCoin;
  }
  getCoins() {
    return {
      baht1: this.getCoinOneBaht(),
      baht5: this.getCoinFiveBaht(),
      baht10: this.getCoinTenBaht(),
    }
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
    this.baht1 -= number;
  }
  minusCoinFiveBaht(number) {
    this.baht5 -= number;
  }
  minusCoinTenBaht(number) {
    this.baht10 -= number;
  }
  canChange(changeCoins) {
    const minimumExistingCoin = 3;
    // {baht1: 0, baht5: 1, baht10: 4}
    console.log(this.getCoins());
    if (changeCoins.baht1 > 0 && this.getCoinOneBaht() <= minimumExistingCoin) return false;
    if (changeCoins.baht5 > 0 && this.getCoinFiveBaht() <= minimumExistingCoin) return false;
    if (changeCoins.baht10 > 0 && this.getCoinTenBaht() <= minimumExistingCoin) return false;
    return true;
  }
  getLimitBanknote() {
    return this.limitBanknote;
  }
  setLimitBanknote(banknoteValue) {
    this.limitBanknote = banknoteValue;
  }
  verifyCanReceiveBanknote(banknoteValue) {
    if (banknoteValue >= this.getLimitBanknote()) return false;
    return true;
  }
}

const serverLog = 'background: blue; color: #fff';

if (process.env.NODE_ENV !== 'production') {
  console.log('development:createServer at 127.0.0.1:1337');
  const server = net.createServer(socket => {
    const sv = new Server(SERVER_MODE);
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
    }, 1000);

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
      // ======================================================
      // DROP PRODUCT
      // ======================================================
      if (objectData.action === 1 && objectData.msg !== 'failed') {
        console.log('%c Server: Drop product', serverLog, data);
        const successPercent = Math.floor(((Math.random() * 10))) + 1;
        console.log('successPercent', successPercent);
        setTimeout(() => {
          socket.write(
            JSON.stringify({
              action: 1,
              result: 'success',
              description: 'Item XX delivered',
            }),
          );
        }, DROP_PRODUCT_DELAY_MS);
        // if (successPercent <= 10 && !isFirstTime) {
        //   isFirstTime = true;
        //   setTimeout(() => {
        //     socket.write(
        //       JSON.stringify({
        //         action: 1,
        //         result: 'success',
        //         description: 'Item XX delivered',
        //       }),
        //     );
        //   }, DROP_PRODUCT_DELAY_MS);
        // // }
        // } else {
        //   // isFirstTime = false;
        //   setTimeout(() => {
        //     socket.write(
        //       JSON.stringify({
        //         action: 1,
        //         result: 'fail',
        //         description: 'Item delivered failed',
        //       }),
        //     );
        //   }, DROP_PRODUCT_DELAY_MS);
        // }
      }
      // ======================================================
      // CASH CHANGE
      // ======================================================
      if (objectData.action === 2 && objectData.mode === 'coin') {
        if (!sv.getCanReceiveCoin()) {
          console.log('%c Server: Cash Change', serverLog, Number(objectData.msg), changeCoin(Number(objectData.msg)));
          const changeCoins = changeCoin(Number(objectData.msg));
          if (sv.canChange(changeCoins)) {
            sv.minusCoinOneBaht(changeCoins.baht1);
            sv.minusCoinFiveBaht(changeCoins.baht5);
            sv.minusCoinTenBaht(changeCoins.baht10);
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
        } else {
          console.error('Server cannot change cash because Money Box is enable');
        }
      }
      // ======================================================
      // CASH REMAINING
      // ======================================================
      if (objectData.action === 2 && objectData.mode === 'remain') {
        if (!sv.getCanReceiveCoin()) {
          console.log('%c Server: Cash remaining', serverLog, sv);
          // socket.write(
          //   JSON.stringify({
          //     action: 2,
          //     result: 'success',
          //     remain: {
          //       baht1: sv.getCoinOneBaht(),
          //       baht5: sv.getCoinFiveBaht(),
          //       baht10: sv.getCoinTenBaht(),
          //     },
          //   }),
          // );
          socket.write(
            JSON.stringify({
              action: 2,
              result: 'failed',
              remain: '',
            }),
          );
        } else {
          console.error('Server cannot show remaining because Money Box is enable');
        }
      }
      // ======================================================
      // RESET TAIKO
      // ======================================================
      if (objectData.action === 2 && objectData.mode === 'bill' && objectData.msg === '01') {
        // reset TAIKO
        socket.write(
          JSON.stringify({
            action: 2,
            msg: '01',
            result: 'success',
            description: 'taiko reset completed'
          }),
        );
      }
      // ======================================================
      // ENABLE MONEY BOX
      // ======================================================
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
        const isSuccess = _.random(1, 5) <= 5;
        if (isSuccess) sv.setCanReceiveCoin(true);
        setTimeout(() => {
          socket.write(
            JSON.stringify(isSuccess ? success : failed),
          );
        }, MONEY_BOX_DELAY_MS);
      }
      // ======================================================
      // DISABLE MONEY BOX
      // ======================================================
      if (objectData.action === 2 && objectData.mode === 'both' && objectData.msg === '021') {
        // disable money box
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
        const isSuccess = _.random(1, 5) <= 5;
        if (isSuccess) sv.setCanReceiveCoin(false);
        setTimeout(() => {
          socket.write(
            JSON.stringify(isSuccess ? success : failed),
          );
        }, MONEY_BOX_DELAY_MS);
      }
      if (objectData.action === 2 && objectData.mode === 'limit') {
        const success = {
          action: 2,
          result: 'success',
          description: `Cash is now limit to ${objectData.msg}`
        };
        sv.setLimitBanknote(Number(objectData.msg));
        // const failed = {
        //   action: 2,
        //   msg: '021',
        //   result: 'failed',
        //   description: 'failed please try again'
        // };
        // const isSuccess = true; // _.random(1, 5) <= 4;
        socket.write(
          // JSON.stringify(isSuccess ? success : failed),
          JSON.stringify(success),
        );
      }
      // ======================================================
      // INSERT COIN
      // ======================================================
      if (objectData.action === 999) {
        if (sv.getCanReceiveCoin()) {
          const insertedValue = Number(objectData.msg);
          const canReceiveBanknote = sv.verifyCanReceiveBanknote(insertedValue);
          if (canReceiveBanknote) {
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
          } else {
            // คืนเงิน
            console.log('Cannot receive this banknote', insertedValue);
          }
        } else {
          // MONEY BOX IS DISABLE
          console.log('Cannot receive money because money box is disable');
        }
      }
      // ======================================================
      // QR CODE
      // ======================================================
      if (objectData.action === 998) {
        const scannedValue = objectData.msg;
        socket.write(
          JSON.stringify({
            action: 0,
            sensor: 'qrcode',
            msg: scannedValue,
          }),
        );
      }
      if (objectData.action === 'door-open') {
        socket.write(
          JSON.stringify({
            action: 0,
            sensor: 'door',
            msg: 'open',
          }),
        );
      }
      if (objectData.action === 'door-close') {
        socket.write(
          JSON.stringify({
            action: 0,
            sensor: 'door',
            msg: 'close',
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
