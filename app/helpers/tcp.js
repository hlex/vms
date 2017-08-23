import _ from 'lodash';
import { changeCoin } from './global';

export const verifyServerResponseData = (data) => {
  /*
    "{
      "action: 0,
      "sensor: "temp,
      "msg: {
        "temp: 4.3
      }
    }"
  */
  return true;
};

export const isInsertCash = (data) => {
  const action = _.get(data, 'action');
  const amount = Number(_.get(data, 'msg', ''));
  if (!action) return false;
  if (action !== 2 || amount <= 0) return false;
  return true;
};

export const isProductDropSuccess = (data) => {
  const action = _.get(data, 'action');
  const result = _.get(data, 'result', '').toUpperCase();
  const isProductDrop = _.get(data, 'description', '').toLowerCase().indexOf('item') !== -1;
  if (!action) return false;
  if (action !== 1 || result !== 'SUCCESS' || !isProductDrop) return false;
  return true;
};

export const isProductDropFail = (data) => {
  const action = _.get(data, 'action');
  const result = _.get(data, 'result', '').toUpperCase();
  const isProductDrop = _.get(data, 'description', '').toLowerCase().indexOf('item') !== -1;
  if (!action) return false;
  if (action !== 1 || result !== 'FAIL' || !isProductDrop) return false;
  return true;
};

export const isGetCashRemaining = (data) => {
  const action = _.get(data, 'action');
  const result = _.get(data, 'result', '').toUpperCase();
  const remain = _.get(data, 'remain');
  if (!action || !remain) return false;
  if (action !== 2 || result !== 'SUCCESS') return false;
  return true;
};

export const verifyCanChangeCoin = (cashRemaining, cashReturnTotalAmount) => {
  const changeCoins = changeCoin(cashReturnTotalAmount);
  console.log('verifyCanChangeCoin', cashRemaining, cashReturnTotalAmount);
  const minimumExistingCoin = 3;
  // {baht1: 0, baht5: 1, baht10: 4}
  if (changeCoins.baht1 > 0 && cashRemaining.baht1 <= minimumExistingCoin) return false;
  if (changeCoins.baht5 > 0 && cashRemaining.baht5 <= minimumExistingCoin) return false;
  if (changeCoins.baht10 > 0 && cashRemaining.baht10 <= minimumExistingCoin) return false;
  return true;
};

export const needToChangeCash = (totalAmount, currentCash) => {
  return currentCash > totalAmount;
};

export const isCashChangeSuccess = (data) => {
  const action = _.get(data, 'action');
  const result = _.get(data, 'result', '').toUpperCase();
  const isCashChangeAction = _.get(data, 'description', '').toLowerCase().indexOf('cash') !== -1;
  if (!action) return false;
  if (action !== 2 || result !== 'SUCCESS' || !isCashChangeAction) return false;
  return true;
};

export const isCashChangeFail = (data) => {
  const action = _.get(data, 'action');
  const result = _.get(data, 'result', '').toUpperCase();
  const isCashChangeAction = _.get(data, 'description', '').toLowerCase().indexOf('cash') !== -1;
  if (!action) return false;
  if (action !== 2 || result !== 'FAIL' || !isCashChangeAction) return false;
  return true;
};
