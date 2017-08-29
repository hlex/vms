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
  isProductDropFail,
  needToChangeCash,
  isCashChangeSuccess,
  isCashChangeFail,
} from '../helpers/tcp';
import {
  createLog,
} from '../helpers/global';

export const backToHome = () => dispatch => {
  dispatch(changePage(''));
    // ======================================================
    // Clear many stuffs
    // ======================================================
  dispatch(Actions.resetPaymentReducer());
  dispatch(Actions.notReadyToDropProduct());
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
  setTimeout(() => {
    dispatch(backToHome());
  }, 3000);
};

export const receivedCashCompletely = () => dispatch => {
  dispatch(Actions.receivedCashCompletely());
};

export const productDrop = () => (dispatch, getState) => {
  const readyToDropProduct = MasterappSelector.verifyReadyToDropProduct(getState().masterapp);
  if (readyToDropProduct) {
    const client = MasterappSelector.getTcpClient(getState().masterapp);
    client.send({
      action: 1,
      msg: '11', // row * col
    });
  } else {
    console.error('Cannot Drop Product because readyToDropProduct = ', readyToDropProduct);
  }
};

export const selectTopupProvider = (context, topupProvider) => {
  return (dispatch) => {
    dispatch(changePage(context));
    dispatch(Actions.selectTopupProvider(topupProvider));
  };
};

export const receivedDataFromServer = data => (dispatch, getState) => {
  console.log('%c App Received: ', createLog(null, 'lime', 'black'), data);
  // classify data
  // ======================================================
  // SENSOR
  // ======================================================
  if (data.sensor) {
    console.log('%c App getSensor:', createLog('app'), data);
    dispatch(Actions.receivedSensorInformation(data));
  } else if (isInsertCash(data)) {
    console.log('%c App insertCoin:', createLog('app'), data);
    // ======================================================
    // CASH
    // ======================================================
    dispatch(Actions.receivedCash(data));
    // dispatch(getCashRemaining());
    // const cashRemaining = PaymentSelector.getCashRemaining(getState().payment);
    const currentCash = PaymentSelector.getCurrentAmount(getState().payment);
    const totalAmount = OrderSelector.getOrderTotalAmount(getState().order);
    // const cashReturnTotalAmount = RootSelector.getCashReturnAmount(getState());
    console.log('%c App isInsertCash:', createLog('app'), 'currentCash =', currentCash, 'totalAmount =', totalAmount);
    if (currentCash >= totalAmount) {
      dispatch(setReadyToDropProduct());
      if (needToChangeCash(totalAmount, currentCash)) {
        // change
        console.log('%c App cashChange:', createLog('app'), 'cashChange =', currentCash - totalAmount);
        setTimeout(() => {
          dispatch(cashChange());
        }, 1000);
      } else {
        // no change
        console.log('%c App productDrop:', createLog('app'), 'cashChange =', currentCash - totalAmount);
        setTimeout(() => {
          dispatch(receivedCashCompletely());
          dispatch(productDrop());
        }, 1000);
      }
    }
  } else if (isCashChangeSuccess(data)) {
    console.log('%c App cashChange success:', createLog('app'), data);
    const readyToDropProduct = MasterappSelector.verifyReadyToDropProduct(getState().masterapp);
    if (readyToDropProduct) {
      setTimeout(() => {
        dispatch(receivedCashCompletely());
        dispatch(productDrop());
      }, 1000);
    } else {
      console.error('Cannot Drop Product because readyToDropProduct = ', readyToDropProduct);
    }
  } else if (isCashChangeFail(data)) {
    console.log('%c App cashChange fail:', createLog('app'), data);
    // popup
    dispatch(Actions.showModal('cashChangeError'));
  } else if (isProductDropSuccess(data)) {
    console.log('%c App productDrop success:', createLog('app'), data);
    // ======================================================
    // DROP PRODUCT SUCCESS
    // ======================================================
    dispatch(productDropSuccess());
  } else if (isProductDropFail(data)) {
    console.log('%c App productDrop fail:', createLog('app'), data);
    // return cash eql product price
    dispatch(setNotReadyToDropProduct());
    dispatch(cashChangeAll());
    dispatch(Actions.showModal('productDropError'));
  } else {
    console.log('%c App Do nothing:', createLog('app'), data);
    // Do Nothing
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
    const cashReturnTotalAmount = RootSelector.getCashChangeAmount(getState());
    // ======================================================
    // if cashReturn > 0 then call api to return cash
    // ======================================================
    debugger;
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

export const returnCash = () => {
  return (dispatch, getState) => {
    const cashReturnTotalAmount = RootSelector.getCashReturnAmount(getState());
    // ======================================================
    // if cashReturn > 0 then call api to return cash
    // ======================================================
    debugger;
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
}

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
    // dispatch(cashChangeAll()); // ปล่อยให้มันกินตังค์ไปก่อน
    dispatch(hideAllModal());
  };
};

export const hideAllModal = () => {
  return (dispatch) => {
    dispatch(Actions.hideAllModal());
  };
};

export const setReadyToDropProduct = () => {
  return (dispatch) => {
    dispatch(Actions.readyToDropProduct());
  };
};

export const setNotReadyToDropProduct = () => {
  return (dispatch) => {
    dispatch(Actions.notReadyToDropProduct());
  };
};
