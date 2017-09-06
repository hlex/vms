import { push, goBack } from 'react-router-redux';
import _ from 'lodash';
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
  getServerCommand,
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

let cmdNo = 0;
let retryNo = 0;

export const clearOrder = () => dispatch => {
  dispatch(Actions.clearOrder());
};

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

export const selectProduct = (context, item, module) => dispatch => {
  console.log('selectProduct', context, item, module);
  dispatch(changePage(context));
  // ======================================================
  // Select Product
  // ======================================================
  switch (module) {
    case 'singleProduct':
      dispatch(Actions.selectProduct(item));
      break;
    case 'promotionSet':
      dispatch(Actions.selectPromotionSet(item));
      _.forEach(item.products, (product) => {
        dispatch(Actions.selectProduct(product));
      });
      break;
    case 'mobileTopup':
    case 'event':
    default:
      console.warn('module not matching', module);
      break;
  }
};

export const submitProduct = () => dispatch => {
  dispatch(changePage('/payment'));
};

export const submitPromotionSet = () => dispatch => {
  dispatch(changePage('/payment'));
};

export const initTcpClient = tcpClient => dispatch => {
  dispatch(Actions.initTcpClient(tcpClient));
};

export const productDropSuccess = (droppedProduct) => dispatch => {
  dispatch(Actions.productDropSuccess(droppedProduct));
};

export const receivedCashCompletely = () => dispatch => {
  dispatch(Actions.receivedCashCompletely());
};

export const productDrop = () => (dispatch, getState) => {
  const readyToDropProduct = MasterappSelector.verifyReadyToDropProduct(getState().masterapp);
  if (readyToDropProduct) {
    const targetRowColumn = OrderSelector.getDropProductTargetRowColumn(getState().order);
    const client = MasterappSelector.getTcpClient(getState().masterapp);
    client.send({
      action: 1,
      msg: targetRowColumn, // row * col
    });
    dispatch(Actions.droppingProduct(OrderSelector.getProductToDrop(getState().order)));
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

// ======================================================
// Server Command
// ======================================================
const runFlowCashInserted = () => {
  return (dispatch, getState) => {
    const currentCash = PaymentSelector.getCurrentAmount(getState().payment);
    const grandTotalAmount = OrderSelector.getOrderGrandTotalAmount(getState().order);
    console.log('%c App isInsertCash:', createLog('app'), 'currentCash =', currentCash, 'totalAmount =', grandTotalAmount);
    if (currentCash >= grandTotalAmount) {
      dispatch(setReadyToDropProduct());
      if (needToChangeCash(grandTotalAmount, currentCash)) {
        // cashChange
        console.log('%c App cashChange:', createLog('app'), 'cashChange =', currentCash - grandTotalAmount);
        setTimeout(() => {
          dispatch(cashChange());
        }, 1000);
      } else {
        // clear amount because no need to return money to customer even if cannot drop product
        setTimeout(() => {
          dispatch(clearPaymentAmount());
        }, 1000);
        // no change
        console.log('%c App productDrop:', createLog('app'), 'cashChange =', currentCash - grandTotalAmount);
        if (OrderSelector.verifyOrderHasProduct(getState().order)) {
          setTimeout(() => {
            dispatch(receivedCashCompletely());
            dispatch(productDrop());
          }, 1000);
        } else if (OrderSelector.verifyMobileTopupOrder(getState().order)) {
          dispatch(receivedCashCompletely());
          setTimeout(() => {
            dispatch(productDropProcessCompletely());
          }, 1000);
        }
      }
    }
  };
};

const runFlowCashChangeSuccess = () => {
  return (dispatch, getState) => {
    dispatch(Actions.setCashChangeAmount(0));
    if (OrderSelector.verifyOrderHasProduct(getState().order)) {
      console.log('%c App Product Order', createLog('app'));
      const readyToDropProduct = MasterappSelector.verifyReadyToDropProduct(getState().masterapp);
      if (readyToDropProduct) {
        setTimeout(() => {
          dispatch(receivedCashCompletely());
          dispatch(productDrop());
        }, 1000);
      } else {
        console.error('Cannot Drop Product because readyToDropProduct = ', readyToDropProduct);
      }
    } else if (OrderSelector.verifyMobileTopupOrder(getState().order)) {
      console.log('%c App MobileTopup Order', createLog('app'));
      // call API
      dispatch(receivedCashCompletely());
      setTimeout(() => {
        dispatch(productDropProcessCompletely());
      }, 1000);
    }
  };
};

const runFlowProductDropSuccess = () => {
  return (dispatch, getState) => {
    const droppedProduct = MasterappSelector.getDroppedProduct(getState().masterapp);
    dispatch(productDropSuccess(droppedProduct));
    // ======================================================
    // check hasPromotionSet ?
    // ======================================================
    if (OrderSelector.verifyAllOrderDropped(getState().order)) {
      dispatch(productDropProcessCompletely());
    } else {
      dispatch(productDrop());
    }
  };
};

export const receivedDataFromServer = data => (dispatch) => {
  if (data.sensor) return;
  console.log('%c App Received: ', createLog(null, 'lime', 'black'), data);
  // classify data
  const cmd = getServerCommand(data);
  cmdNo += 1;
  console.log(`%c App cmd: ${cmd}`, createLog(null, 'pink', 'red'), 'trx:cmd =', cmdNo);
  switch (cmd) {
    case 'CONNECTION_ESTABLISH':
      console.log('%c App connectionEstablish:', createLog('app'));
      break;
    case 'CONNECTED':
      console.log('%c App connected:', createLog('app'));
      dispatch(resetTAIKO());
      break;
    case 'SENSOR':
      console.log('%c App getSensor:', createLog('app'));
      dispatch(Actions.receivedSensorInformation(data));
      break;
    case 'INSERT_CASH':
      console.log('%c App insertCoin:', createLog('app'));
      dispatch(Actions.receivedCash(data));
      dispatch(runFlowCashInserted());
      break;
    case 'CASH_CHANGE_SUCCESS':
      console.log('%c App cashChange success:', createLog('app'));
      dispatch(runFlowCashChangeSuccess());
      break;
    case 'CASH_CHANGE_FAIL':
      console.log('%c App cashChange fail:', createLog('app'));
      dispatch(Actions.showModal('cashChangeError'));
      break;
    case 'PRODUCT_DROP_SUCCESS':
      console.log('%c App productDrop success:', createLog('app'));
      dispatch(runFlowProductDropSuccess());
      break;
    case 'PRODUCT_DROP_FAIL':
      console.log('%c App productDrop fail:', createLog('app'), data);
      // return cash eql product price
      dispatch(setNotReadyToDropProduct());
      dispatch(cashChangeEqualToGrandTotalAmount());
      dispatch(Actions.showModal('productDropError'));
      break;
    case 'RESET_TAIKO_SUCCESS':
      break;
    case 'RESET_TAIKO_FAIL':
      break;
    case 'ENABLE_MONEY_BOX_SUCCESS':
      // Do nothing
      retryNo = 0;
      break;
    case 'ENABLE_MONEY_BOX_FAIL':
      // Retry
      if (retryNo <= 3) {
        dispatch(enableMoneyBox());
        retryNo += 1;
      } else {
        retryNo = 0;
        alert('Retry 3 times max quota');
      }
      break;
    case 'DISABLE_MONEY_BOX_SUCCESS':
      dispatch(sendCashChangeToServer());
      retryNo = 0;
      break;
    case 'DISABLE_MONEY_BOX_FAIL':
      // Retry
      if (retryNo <= 3) {
        dispatch(disableMoneyBox());
        retryNo += 1;
      } else {
        retryNo = 0;
        alert('Retry 3 times max quota');
      }
      break;
    default:
      console.log('%c App Do nothing:', createLog('app'), data);
      break;
  }
};

export const productDropProcessCompletely = () => dispatch => {
  dispatch(Actions.productDropProcessCompletely());
  setTimeout(() => {
    dispatch(backToHome());
  }, 3000);
};

export const confirmMobileTopupMSISDN = (MSISDN) => {
  return (dispatch) => {
    dispatch(changePage('/topup/selectTopupValue'));
    dispatch(Actions.confirmMobileTopupMSISDN(MSISDN));
  };
};

export const clearPaymentAmount = () => dispatch => {
  setTimeout(() => {
    dispatch(Actions.clearPaymentAmount());
  }, 1000);
};

export const sendCashChangeToServer = () => {
  return (dispatch, getState) => {
    const cashChangeAmount = PaymentSelector.getCashChangeAmount(getState().payment);
    console.log('sendCashChangeToServer:cashChangeAmount', cashChangeAmount);
    // ======================================================
    // if cashReturn > 0 then call api to return cash
    // ======================================================
    if (cashChangeAmount > 0) {
      const client = MasterappSelector.getTcpClient(getState().masterapp);
      client.send({
        action: 2,
        msg: `${cashChangeAmount}`,
        mode: 'coin',
      });
    }
    dispatch(clearPaymentAmount());
  };
};

export const cashChangeEqualToGrandTotalAmount = () => {
  return (dispatch, getState) => {
    const grandTotalAmount = RootSelector.getCashChangeFromOrderAmount(getState());
    dispatch(Actions.setCashChangeAmount(grandTotalAmount));
    // ======================================================
    // Disable Moneybox before sendCashChange
    // ======================================================
    dispatch(disableMoneyBox());
  };
};

export const cashChange = () => {
  return (dispatch, getState) => {
    const currentCash = RootSelector.getCashChangeAmount(getState());
    dispatch(Actions.setCashChangeAmount(currentCash));
    // ======================================================
    // Disable Moneybox before sendCashChange
    // ======================================================
    dispatch(disableMoneyBox());
  };
};

export const returnAllInsertCash = () => {
  return (dispatch, getState) => {
    const currentCash = RootSelector.getCashChangeFromCurrentCash(getState());
    dispatch(Actions.setCashChangeAmount(currentCash));
    // ======================================================
    // Disable Moneybox before sendCashChange
    // ======================================================
    dispatch(disableMoneyBox());
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
    // dispatch(cashChangeEqualToGrandTotalAmount()); // ปล่อยให้มันกินตังค์ไปก่อน
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

export const selectMobileTopupValue = (item) => {
  return (dispatch) => {
    dispatch(Actions.selectMobileTopupValue(item));
  };
};

export const submitMobileTopupValue = (mobileTopupValue) => {
  return (dispatch) => {
    dispatch(Actions.submitMobileTopupValue(mobileTopupValue));
    dispatch(changePage('/payment'));
  };
};

export const clearMobileTopupValue = () => {
  return (dispatch) => {
    dispatch(Actions.clearMobileTopupValue());
  };
};

export const resetTAIKO = () => {
  return (dispatch, getState) => {
    const client = MasterappSelector.getTcpClient(getState().masterapp);
    client.send({
      action: 2,
      msg: '01',
      mode: 'bill'
    });
  };
};

export const enableMoneyBox = () => {
  return (dispatch, getState) => {
    const client = MasterappSelector.getTcpClient(getState().masterapp);
    client.send({
      action: 2,
      msg: '020',
      mode: 'both'
    });
  };
};

export const disableMoneyBox = () => {
  return (dispatch, getState) => {
    const client = MasterappSelector.getTcpClient(getState().masterapp);
    client.send({
      action: 2,
      msg: '021',
      mode: 'both'
    });
  };
};

