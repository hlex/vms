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
  isGetCashRemaining,
  verifyCanChangeCoin,
} from '../helpers/tcp';


const appLog = 'background: #000; color: #fff';

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
  console.log('%c App Received: ', 'background: #000; color: #fff', data);
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
    console.log('%c App Cash Remaining:', appLog, cashRemaining);
    const currentCash = PaymentSelector.getCurrentAmount(getState().payment);
    const totalAmount = OrderSelector.getOrderTotalAmount(getState().order);
    const cashReturnTotalAmount = RootSelector.getCashReturnAmount(getState());
    if (currentCash >= totalAmount) {
      const canChangeCoin = verifyCanChangeCoin(cashRemaining, cashReturnTotalAmount);
      console.log('%c App canChangeCoin', appLog, cashRemaining, cashReturnTotalAmount, canChangeCoin);
      if (canChangeCoin) {
        setTimeout(() => {
          dispatch(receivedCashCompletely());
          dispatch(productDrop());
        }, 1000);
      } else {
        // error and cashChangeAll
        dispatch(Actions.showModal('contentError'));
      }
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

export const cashChangeAll = () => {
  return (dispatch, getState) => {
    const cashReturnTotalAmount = OrderSelector.getOrderTotalAmount(getState());
    const client = MasterappSelector.getTcpClient(getState().masterapp);
    client.send({
      action: 2,
      msg: `${cashReturnTotalAmount}`,
      mode: 'coin',
    });
    dispatch(Actions.clearPaymentAmount());
  };
};

export const cashChange = () => {
  return (dispatch, getState) => {
    const cashReturnTotalAmount = RootSelector.getCashReturnAmount(getState());
    // ======================================================
    // if cashReturn > 0 then call api to return cash
    // ======================================================
    if (cashReturnTotalAmount > 0) {
      const client = MasterappSelector.getTcpClient(getState().masterapp);
      client.send({
        action: 2,
        msg: `${cashReturnTotalAmount}`,
        mode: 'coin',
      });
    }
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

export const cancelPayment = () => {
  return (dispatch) => {
    dispatch(backToHome());
    dispatch(cashChangeAll());
    dispatch(hideAllModal());
  };
};

export const hideAllModal = () => {
  return (dispatch) => {
    dispatch(Actions.hideAllModal());
  };
};
