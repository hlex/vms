import { push, goBack } from 'react-router-redux';
import * as Actions from './index';

// ======================================================
// Selectors
// ======================================================
import RootSelector from '../selectors/root';
import MasterappSelector from '../selectors/masterapp';
import PaymentSelector from '../selectors/payment';
import OrderSelector from '../selectors/order';

// ======================================================
// Helpers
// ======================================================
import {
  isInsertCash,
  isProductDropSuccess,
  isGetCashRemaining
} from '../helpers/tcp';

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

export const selectProduct = (context, item) => dispatch => {
  dispatch(changePage(context));
  // ======================================================
  // Select Product
  // ======================================================
  dispatch(Actions.selectProduct(item));
};

export const submitProduct = () => dispatch => {
  dispatch(changePage('/payment'));
};

export const initTcpClient = tcpClient => dispatch => {
  dispatch(Actions.initTcpClient(tcpClient));
};

export const productDropSuccess = () => dispatch => {
  dispatch(Actions.productDropSuccess());
};

export const receivedCashCompletely = () => dispatch => {
  dispatch(Actions.receivedCashCompletely());
};

export const productDrop = () => (dispatch, getState) => {
  const client = MasterappSelector.getTcpClient(getState().masterapp);
  client.send({
    action: 1,
    msg: '11', // row * col
  });
};

export const selectTopupProvider = (context, topupProvider) => {
  return (dispatch) => {
    dispatch(changePage(context));
    dispatch(Actions.selectTopupProvider(topupProvider));
  };
};

export const receivedDataFromServer = data => (dispatch, getState) => {
  console.log('receivedDataFromServer', data);
  // classify data
  // ======================================================
  // SENSOR
  // ======================================================
  if (data.sensor) {
    dispatch(Actions.receivedSensorInformation(data));
  }
  // ======================================================
  // CASH
  // ======================================================
  if (isInsertCash(data)) {
    dispatch(Actions.receivedCash(data));
    dispatch(getCashRemaining());
    const cashRemaining = PaymentSelector.getCashRemaining(getState().payment);
    console.log('Cash Remaining:', cashRemaining);
    const currentCash = PaymentSelector.getCurrentAmount(getState().payment);
    const totalAmount = OrderSelector.getOrderTotalAmount(getState().order);
    if (currentCash >= totalAmount) {
      // return and choose product
      setTimeout(() => {
        dispatch(receivedCashCompletely());
        dispatch(productDrop());
      }, 1000);
    }
  }
  if (isGetCashRemaining(data)) {
    dispatch(Actions.getCashRemaining(data));
  }
  // ======================================================
  // DROP PRODUCT
  // ======================================================
  if (isProductDropSuccess(data)) {
    dispatch(productDropSuccess());
    dispatch(cashChange());
  }
};

export const confirmMobileTopupMSISDN = (MSISDN) => {
  return (dispatch) => {
    dispatch(changePage('/topup/selectTopupValue'));
    dispatch(Actions.confirmMobileTopupMSISDN(MSISDN));
  };
};

export const cashChange = () => {
  return (dispatch, getState) => {
    const cashReturnTotalAmount = RootSelector.getCashReturnAmount(getState());
    const client = MasterappSelector.getTcpClient(getState().masterapp);
    client.send({
      action: 2,
      msg: `${cashReturnTotalAmount}`,
      mode: 'coin',
    });
    dispatch(Actions.clearPaymentAmount());
  };
};

export const getCashRemaining = () => {
  return (dispatch, getState) => {
    const client = MasterappSelector.getTcpClient(getState().masterapp);
    client.send({
      action: 2,
      mode: 'remain',
    });
  };
};

// ======================================================
// Dev
// ======================================================
export const insetCoin = (value) => {
  return (dispatch, getState) => {
    const client = MasterappSelector.getTcpClient(getState().masterapp);
    client.send({
      action: 999,
      msg: value,
    });
  };
};
