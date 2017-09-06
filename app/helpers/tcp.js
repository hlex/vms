import _ from 'lodash';
import { changeCoin } from './global';
import {
  createLog,
} from './global';
// ======================================================
// Action Code
// ======================================================
const actionCode = {
  sensor: 0,
  productAndMonitor: 1,
  cash: 2,
  converter: 3,
  system: 4,
};
// ======================================================
// Message Code
// ======================================================
const messageCode = {
  resetTAIKO: '01',
  disableMoneyReceiverOFF: '021',
  disableMoneyReceiverON: '022',
};
// ======================================================
// Result Code
// ======================================================
const resultCode = {
  success: 'success',
  unsuccess: 'failed',
};

export const verifyServerResponseData = (data) => {
  // ======================================================
  // Bypass nothing to check error
  // ======================================================
  return true;
};

export const needToChangeCash = (totalAmount, currentCash) => {
  return currentCash > totalAmount;
};

export const isInsertCash = ({ action, msg, result, description }) => {
  if (msg === '') return false;
  if (action !== actionCode.cash || Number(msg) <= 0) return false;
  return true;
};

export const isCashChangeSuccess = ({ action, msg, result, description }) => {
  if (action !== actionCode.cash
    || result !== resultCode.success
    || description.indexOf('cash') < 0) return false;
  return true;
};

export const isCashChangeFail = ({ action, msg, result, description }) => {
  if (action !== actionCode.cash
    || result !== 'fail'
    || description.indexOf('cash') < 0) return false;
  return true;
};


export const isProductDropSuccess = ({ action, msg, result, description }) => {
  if (action !== actionCode.productAndMonitor
    || result !== resultCode.success
    || description.indexOf('item') < 0) return false;
  return true;
};

export const isProductDropFail = ({ action, msg, result, description }) => {
  if (action !== actionCode.productAndMonitor
    || result !== 'fail'
    || description.indexOf('item') < 0) return false;
  return true;
};

export const isSensor = ({ action, msg, result, description }) => {
  if (action !== actionCode.sensor) return false;
  return true;
};

export const isResetTAIKOSuccess = ({ action, msg, result, description }) => {
  if (action !== actionCode.cash
    || msg !== messageCode.resetTAIKO
    || result !== resultCode.success
    || description.indexOf('completed') < 0) return false;
  return true;
};

export const isResetTAIKOFail = ({ action, msg, result, description }) => {
  if (action !== actionCode.cash
    || msg !== messageCode.resetTAIKO
    || result !== resultCode.unsuccess
    || description.indexOf('failed') < 0) return false;
  return true;
};

export const isDisabledMoneyBox = ({ action, msg, result, description }) => {
  if (action !== actionCode.cash
    || msg !== messageCode.disableMoneyReceiverON
    || result !== resultCode.success
    || description.indexOf('disable on') < 0) return false;
  return true;
};

export const isEnableMoneyBox = ({ action, msg, result, description }) => {
  if (action !== actionCode.cash
    || msg !== messageCode.disableMoneyReceiverOFF
    || result !== resultCode.success
    || description.indexOf('disable off') < 0) return false;
  return true;
};

export const isConnectionEstablish = ({ action, msg, result, description, initialized }) => {
  if (action !== actionCode.system
    || initialized !== 0) return false;
  return true;
};

export const isConnected = ({ action, msg, result, description, initialized }) => {
  if (action !== actionCode.system
    || initialized !== 1) return false;
  return true;
};

export const getServerCommand = (data) => {
  const normalizeData = {
    action: _.get(data, 'action', ''),
    result: _.get(data, 'result', '').toLowerCase(),
    msg: _.get(data, 'msg', ''),
    description: _.get(data, 'description', '').toLowerCase(),
    initialized: _.get(data, 'initialized', ''),
  };
  console.log('%c App getServerCommand:normalizeData', createLog('app'), normalizeData);
  if (isConnectionEstablish(normalizeData)) return 'CONNECTION_ESTABLISH';
  if (isConnected(normalizeData)) return 'CONNECTED';
  if (isSensor(normalizeData)) return 'SENSOR';
  if (isResetTAIKOSuccess(normalizeData)) return 'RESET_TAIKO_SUCCESS';
  if (isResetTAIKOFail(normalizeData)) return 'RESET_TAIKO_FAIL';
  if (isDisabledMoneyBox(normalizeData)) return 'DISABLE_MONEY_BOX';
  if (isEnableMoneyBox(normalizeData)) return 'ENABLE_MONEY_BOX';
  if (isInsertCash(normalizeData)) return 'INSERT_CASH';
  if (isCashChangeSuccess(normalizeData)) return 'CASH_CHANGE_SUCCESS';
  if (isCashChangeFail(normalizeData)) return 'CASH_CHANGE_FAIL';
  if (isProductDropSuccess(normalizeData)) return 'PRODUCT_DROP_SUCCESS';
  if (isProductDropFail(normalizeData)) return 'PRODUCT_DROP_FAIL';
  return 'NOTHING_TO_DO';
};
