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
  needToChangeCash
} from '../helpers/tcp';
import {
  createLog,
  verifyLessThanThreshold,
  verifyCanUseDiscount
} from '../helpers/global';
// ======================================================
// APIs
// ======================================================
import { serviceTopupMobile } from '../apis/mobileTopup';
import { serviceVerifyDiscountCode } from '../apis/discount';

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
      _.forEach(item.products, product => {
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

export const productDropSuccess = droppedProduct => dispatch => {
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

export const selectTopupProvider = (context, topupProvider) => dispatch => {
  dispatch(changePage(context));
  dispatch(Actions.selectTopupProvider(topupProvider));
};

// ======================================================
// Server Command
// ======================================================
const runFlowCashInserted = () => async (dispatch, getState) => {
  dispatch(changePage('/payment'));
  const currentCash = PaymentSelector.getCurrentAmount(getState().payment);
  const grandTotalAmount = OrderSelector.getOrderGrandTotalAmount(getState().order);
  console.log(
      '%c App isInsertCash:',
      createLog('app'),
      'currentCash =',
      currentCash,
      'totalAmount =',
      grandTotalAmount,
    );
  if (currentCash >= grandTotalAmount) {
    dispatch(setReadyToDropProduct());
    setTimeout(() => {
      dispatch(receivedCashCompletely());
    }, 1000);
    if (OrderSelector.verifyOrderHasProduct(getState().order)) {
      dispatch(productDrop());
    } else if (OrderSelector.verifyMobileTopupOrder(getState().order)) {
      const serviceTopupMobileResponse = await serviceTopupMobile(
          OrderSelector.getMobileTopupToService(getState().order),
        );
      console.log('serviceTopupMobile', serviceTopupMobileResponse);
      dispatch(productDropProcessCompletely());
    }
  }
    //   if (needToChangeCash(grandTotalAmount, currentCash)) {
    //     // cashChange
    //     console.log('%c App cashChange:', createLog('app'), 'cashChange =', currentCash - grandTotalAmount);
    //     setTimeout(() => {
    //       dispatch(cashChange());
    //     }, 1000);
    //   } else {
    //     // clear amount because no need to return money to customer even if cannot drop product
    //     setTimeout(() => {
    //       dispatch(clearPaymentAmount());
    //     }, 1000);
    //     // no change
    //     console.log('%c App productDrop:', createLog('app'), 'cashChange =', currentCash - grandTotalAmount);
    //     if (OrderSelector.verifyOrderHasProduct(getState().order)) {
    //       setTimeout(() => {
    //         dispatch(receivedCashCompletely());
    //         dispatch(productDrop());
    //       }, 1000);
    //     } else if (OrderSelector.verifyMobileTopupOrder(getState().order)) {
    //       dispatch(receivedCashCompletely());
    //       setTimeout(() => {
    //         dispatch(productDropProcessCompletely());
    //       }, 1000);
    //     }
    //   }
    // }
};

const runFlowCashChangeSuccess = () => dispatch => {
  dispatch(Actions.setCashChangeAmount(0));
};

const runFlowProductDropSuccess = () => (dispatch, getState) => {
  const droppedProduct = MasterappSelector.getDroppedProduct(getState().masterapp);
  dispatch(productDropSuccess(droppedProduct));
    // ======================================================
    // check hasPromotionSet ?
    // ======================================================
  if (OrderSelector.verifyAllOrderDropped(getState().order)) {
    const currentCash = PaymentSelector.getCurrentAmount(getState().payment);
    const grandTotalAmount = OrderSelector.getOrderGrandTotalAmount(getState().order);
      // ======================================================
      // Cash Change
      // ======================================================
    if (needToChangeCash(grandTotalAmount, currentCash)) {
      console.log(
          '%c App cashChange:',
          createLog('app'),
          'cashChange =',
          currentCash - grandTotalAmount,
        );
      dispatch(cashChange());
    }
    dispatch(productDropProcessCompletely());
  } else {
    dispatch(productDrop());
  }
};

export const receivedCashRemaining = (data) => {
  return (dispatch, getState) => {
    // ======================================================
    // Check < 100 baht
    // ======================================================
    const thresHold = 100;
    const isLessThanThreshold = verifyLessThanThreshold(data.remain, thresHold);
    const canChangeCash = isLessThanThreshold === false;
    dispatch(Actions.setCanChangeCash(canChangeCash));
    dispatch(Actions.receivedCashRemaining(data));
  };
};

export const receivedDataFromServer = data => (dispatch, getState) => {
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
      if (OrderSelector.verifyHasDroppedProduct(getState().order)) {
        dispatch(cashChangeEqualToCurrentCashAmountMinusDroppedProduct());
      } else {
        dispatch(cashChangeEqualToCurrentCashAmount());
      }
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
    case 'CASH_REMAINING_SUCCESS':
      dispatch(receivedCashRemaining(data));
      break;
    case 'CASH_REMAINING_FAIL':
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

export const confirmMobileTopupMSISDN = MSISDN => dispatch => {
  dispatch(changePage('/topup/selectTopupValue'));
  dispatch(Actions.confirmMobileTopupMSISDN(MSISDN));
};

export const clearPaymentAmount = () => dispatch => {
  setTimeout(() => {
    dispatch(Actions.clearPaymentAmount());
  }, 1000);
};

export const sendCashChangeToServer = () => (dispatch, getState) => {
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

// export const cashChangeEqualToGrandTotalAmount = () => {
//   return (dispatch, getState) => {
//     const grandTotalAmount = RootSelector.getCashChangeFromOrderAmount(getState());
//     dispatch(Actions.setCashChangeAmount(grandTotalAmount));
//     // ======================================================
//     // Disable Moneybox before sendCashChange
//     // ======================================================
//     dispatch(disableMoneyBox());
//   };
// };

export const cashChangeEqualToCurrentCashAmountMinusDroppedProduct = () => (dispatch, getState) => {
  const cashChangePromotionError = RootSelector.getCashChangePromotionSetError(getState());
  dispatch(Actions.setCashChangeAmount(cashChangePromotionError));
    // ======================================================
    // Disable Moneybox before sendCashChange
    // ======================================================
  dispatch(disableMoneyBox());
};

export const cashChangeEqualToCurrentCashAmount = () => (dispatch, getState) => {
  const currentAmount = PaymentSelector.getCurrentAmount(getState().payment);
  debugger;
  dispatch(Actions.setCashChangeAmount(currentAmount));
    // ======================================================
    // Disable Moneybox before sendCashChange
    // ======================================================
  dispatch(disableMoneyBox());
};

export const cashChange = () => (dispatch, getState) => {
  const currentCash = RootSelector.getCashChangeAmount(getState());
  dispatch(Actions.setCashChangeAmount(currentCash));
    // ======================================================
    // Disable Moneybox before sendCashChange
    // ======================================================
  dispatch(disableMoneyBox());
};

export const returnAllInsertCash = () => (dispatch, getState) => {
  const currentCash = RootSelector.getCashChangeFromCurrentCash(getState());
  dispatch(Actions.setCashChangeAmount(currentCash));
    // ======================================================
    // Disable Moneybox before sendCashChange
    // ======================================================
  dispatch(disableMoneyBox());
};

export const getCashRemaining = () => (dispatch, getState) => {
  const client = MasterappSelector.getTcpClient(getState().masterapp);
  client.send({
    action: 2,
    mode: 'remain',
  });
};

// ======================================================
// Dev
// ======================================================
export const insetCoin = value => (dispatch, getState) => {
  const client = MasterappSelector.getTcpClient(getState().masterapp);
  client.send({
    action: 999,
    msg: value,
  });
};

export const confirmWarningSystemWillNotChangeCash = () => dispatch => {
  dispatch(hideAllModal());
};

export const cancelPayment = () => dispatch => {
  dispatch(backToHome());
    // dispatch(cashChangeEqualToGrandTotalAmount()); // ปล่อยให้มันกินตังค์ไปก่อน
  dispatch(hideAllModal());
};

export const hideAllModal = () => dispatch => {
  dispatch(Actions.hideAllModal());
};

export const setReadyToDropProduct = () => dispatch => {
  dispatch(Actions.readyToDropProduct());
};

export const setNotReadyToDropProduct = () => dispatch => {
  dispatch(Actions.notReadyToDropProduct());
};

export const selectMobileTopupValue = item => dispatch => {
  dispatch(Actions.selectMobileTopupValue(item));
};

export const submitMobileTopupValue = mobileTopupValue => dispatch => {
  dispatch(Actions.submitMobileTopupValue(mobileTopupValue));
  dispatch(changePage('/payment'));
};

export const clearMobileTopupValue = () => dispatch => {
  dispatch(Actions.clearMobileTopupValue());
};

export const resetTAIKO = () => (dispatch, getState) => {
  const client = MasterappSelector.getTcpClient(getState().masterapp);
  client.send({
    action: 2,
    msg: '01',
    mode: 'bill',
  });
};

export const enableMoneyBox = () => (dispatch, getState) => {
  const client = MasterappSelector.getTcpClient(getState().masterapp);
  client.send({
    action: 2,
    msg: '020',
    mode: 'both',
  });
};

export const disableMoneyBox = () => (dispatch, getState) => {
  const client = MasterappSelector.getTcpClient(getState().masterapp);
  client.send({
    action: 2,
    msg: '021',
    mode: 'both',
  });
};

export const clearMobileTopupMSISDN = () => dispatch => {
  dispatch(Actions.clearMobileTopupMSISDN());
};

export const selectEvent = (context, item) => {
  return (dispatch, getState) => {
    dispatch(changePage(context));
    dispatch(Actions.selectEvent(item));
  };
};

export const verifyDiscountCode = (code) => {
  console.log('verifyDiscountCode', code);
  return async (dispatch, getState) => {
    // ======================================================
    // Check code is already exist
    // ======================================================
    const canUseDiscount = verifyCanUseDiscount(OrderSelector.getDiscounts(getState().order), code);
    if (canUseDiscount) {
      try {
        const verifyDiscountCodeResponse = await serviceVerifyDiscountCode(code);
        console.log('verifyDiscountCodeResponse', verifyDiscountCodeResponse);
        const discountItem = {
          code,
          ...verifyDiscountCodeResponse,
          value: 10
        };
        dispatch(Actions.addDiscount(discountItem));
      } catch (error) {

      }
    } else {
      alert('Cannot use discount');
    }
  };
};

export const submitPlayEvent = (value) => {
  return (dispatch) => {
    dispatch(changePage('/event/ads'));
  };
};

export const initHomePage = () => {
  return (dispatch, getState) => {
    // get cash remaining
    dispatch(getCashRemaining());
    dispatch(clearOrder());
  };
};

export const initSingleProductPage = () => {
  return (dispatch, getState) => {
    const canChangeCash = MasterappSelector.verifyCanChangeCash(getState().masterapp);
    if (!canChangeCash) {
      dispatch(Actions.showModal('warningSystemWillNotChangeCash'));
    }
    // if mount enable money box
    enableMoneyBox();
  };
};

export const initPromotionSetPage = () => {
  return (dispatch, getState) => {
    const canChangeCash = MasterappSelector.verifyCanChangeCash(getState().masterapp);
    if (!canChangeCash) {
      dispatch(Actions.showModal('warningSystemWillNotChangeCash'));
    }
    // if mount enable money box
    enableMoneyBox();
  };
};
