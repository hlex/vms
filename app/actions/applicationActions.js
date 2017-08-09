import { push, goBack } from 'react-router-redux';
import * as Actions from './index.js';

export const backToHome = () => dispatch => {
  dispatch(changePage(''));
    // ======================================================
    // Clear many stuffs
    // ======================================================
  dispatch(Actions.resetPaymentReducer());
};

export const back = () => dispatch => {
  dispatch(goBack());
};

export const changePage = context => dispatch => {
  dispatch(push(context));
};

export const selectProduct = (context, itemId) => dispatch => {
  dispatch(changePage(context));
  dispatch(Actions.selectProduct(itemId));
};

export const submitProduct = () => dispatch => {
  dispatch(changePage('/payment'));
};

export const initTcpClient = tcpClient => dispatch => {
  dispatch(Actions.initTcpClient(tcpClient));
};

export const receivedCashCompletely = () => dispatch => {
  dispatch(Actions.receivedCashCompletely());
};

export const productDrop = () => dispatch => {
  dispatch(Actions.productDropSuccess());
};

export const receivedDataFromServer = data => dispatch => {
    // classify data
  if (data.sensor) {
    dispatch(Actions.receivedSensorInformation(data));
  }
  if (data.action === 2 && data.msg === '20') {
    dispatch(Actions.receivedCash(data));
  }
};
