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
  verifyCanUseDiscount,
  getCashRemainingAmount,
  getEventInputByChannel,
} from '../helpers/global';
import {
  convertApplicationErrorToError,
} from '../helpers/error';
// ======================================================
// APIs
// ======================================================
import {
  serviceTopupMobile
} from '../apis/mobileTopup';
import {
  serviceVerifyDiscountCode,
  serviceUseDiscountCode
} from '../apis/discount';
import {
  serviceSubmitOrder,
} from '../apis/order';
import {
  createTcpClient
} from '../apis/tcp';
import {
  serviceGetEvents
} from '../apis/masterdata';
import {
  serviceGetEventReward
} from '../apis/event';

let cmdNo = 0;
let retryNo = 0;

export const initApplication = () => {
  return async (dispatch, getState) => {
    const tcp = MasterappSelector.getTcp(getState().masterapp);
    dispatch(initTcpClient(createTcpClient(tcp.ip, tcp.port)));
    // ======================================================
    // GET MASTER DATA
    // ======================================================
    try {
      const serviceGetEventsResponse = await serviceGetEvents();
      console.log('serviceGetEventsResponse', serviceGetEventsResponse);
      dispatch(Actions.receivedMasterdata('events', serviceGetEventsResponse));
    } catch (error) {
      console.error(error);
    }
  };
};

export const receivedDataFromServer = data => (dispatch, getState) => {
  if (data.sensor && data.sensor === 'temp') return;
  console.log('%c App Received: ', createLog(null, 'lime', 'black'), data);
  const client = MasterappSelector.getTcpClient(getState().masterapp);
  client.setFree();
  client.doSend();

  // classify data
  const cmd = getServerCommand(data);
  cmdNo += 1;
  console.log(`%c App cmd: ${cmd}`, createLog(null, 'pink', 'red'), 'trx:cmd =', cmdNo);
  switch (cmd) {
    case 'CONNECTION_ESTABLISH':
      console.log('%c App CONNECTION_ESTABLISH:', createLog('app'));
      break;
    case 'CONNECTED':
      console.log('%c App CONNECTED:', createLog('app'));
      dispatch(resetTAIKO());
      break;
    case 'UPDATE_TEMP':
      console.log('%c App UPDATE_TEMP:', createLog('app'));
      dispatch(Actions.receivedSensorInformation(data));
      break;
    case 'SCANNED_QR_CODE':
      console.log('%c App SCANNED_QR_CODE:', createLog('app'));
      break;
    case 'INSERT_CASH':
      console.log('%c App INSERT_CASH:', createLog('app'));
      dispatch(Actions.receivedCash(data));
      dispatch(runFlowCashInserted());
      break;
    case 'CASH_CHANGE_SUCCESS':
      console.log('%c App CASH_CHANGE_SUCCESS:', createLog('app'));
      dispatch(runFlowCashChangeSuccess());
      break;
    case 'CASH_CHANGE_FAIL':
      console.log('%c App CASH_CHANGE_FAIL:', createLog('app'));
      dispatch(Actions.showModal('cashChangeError'));
      break;
    case 'PRODUCT_DROP_SUCCESS':
      console.log('%c App PRODUCT_DROP_SUCCESS:', createLog('app'));
      dispatch(runFlowProductDropSuccess());
      break;
    case 'PRODUCT_DROP_FAIL':
      console.log('%c App PRODUCT_DROP_FAIL:', createLog('app'), data);
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
      console.log('%c App RESET_TAIKO_SUCCESS:', createLog('app'), data);
      dispatch(getCashRemaining());
      break;
    case 'RESET_TAIKO_FAIL':
      console.log('%c App RESET_TAIKO_FAIL:', createLog('app'), data);
      break;
    case 'ENABLE_MONEY_BOX_SUCCESS':
      console.log('%c App ENABLE_MONEY_BOX_SUCCESS:', createLog('app'), data);
      // Do nothing
      retryNo = 0;
      dispatch(activateMoneyBox());
      break;
    case 'ENABLE_MONEY_BOX_FAIL':
      console.log('%c App ENABLE_MONEY_BOX_FAIL:', createLog('app'), data);
      // Retry
      // if (retryNo <= 3) {
      dispatch(enableMoneyBox());
        // retryNo += 1;
      // } else {
        // retryNo = 0;
        // alert('Retry 3 times max quota');
      // }
      break;
    case 'DISABLE_MONEY_BOX_SUCCESS':
      console.log('%c App DISABLE_MONEY_BOX_SUCCESS:', createLog('app'), data);
      dispatch(sendCashChangeToServer());
      dispatch(deactivateMoneyBox());
      retryNo = 0;
      break;
    case 'DISABLE_MONEY_BOX_FAIL':
      console.log('%c App DISABLE_MONEY_BOX_FAIL:', createLog('app'), data);
      // Retry
      // if (retryNo <= 3) {
      dispatch(disableMoneyBox());
        // retryNo += 1;
      // } else {
        // retryNo = 0;
        // alert('Retry 3 times max quota');
      // }
      break;
    case 'CASH_REMAINING_SUCCESS':
      console.log('%c App CASH_REMAINING_SUCCESS:', createLog('app'), data);
      dispatch(receivedCashRemaining(data));
      if (MasterappSelector.verifyAppReady(getState().masterapp) === false) {
        dispatch(Actions.hardwareReady());
      }
      break;
    case 'CASH_REMAINING_FAIL':
      console.log('%c App CASH_REMAINING_FAIL:', createLog('app'), data);
      dispatch(getCashRemaining());
      break;
    case 'LIMIT_BANKNOTE_SUCCESS':
      console.log('%c App LIMIT_BANKNOTE_SUCCESS:', createLog('app'), data);
      break;
    default:
      console.log('%c App Do nothing:', createLog('app'), data);
      break;
  }
};

/*
const data = {
  title: {
    th: `ไม่สามารถใช้ส่วนลด ${code} ได้`,
    en: '',
  },
  messages: {
    th: `เนื่องจากส่วนลด ${code} ไม่มีในระบบ กรุณากรอกรหัสใหม่อีกครั้ง`,
    en: '',
  },
  technical: {
    message: '',
    code: ''
  },
};
*/
export const openAlertMessage = (data) => {
  return (dispatch) => {
    dispatch(Actions.openAlertMessage(data));
  };
};

export const closeAlertMessage = () => {
  return (dispatch) => {
    dispatch(Actions.closeAlertMessage());
  };
};


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
      dispatch(selectTopupProvider(context, item));
      break;
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

export const submitOrder = () => {
  return async (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      // ======================================================
      // Check has discount or not ?
      // ======================================================
      try {
        const hasDiscount = OrderSelector.verifyOrderHasDiscount(getState().order);
        if (hasDiscount) {
          const discounts = OrderSelector.getDiscounts(getState().order);
          _.forEach(discounts, async (discount) => {
            const serviceUseDiscountCodeResponse = await serviceUseDiscountCode(discount.code);
            console.log('serviceUseDiscountCodeResponse', serviceUseDiscountCodeResponse);
          });
          console.log('serviceUseDiscountCodeResponse:finish');
        }
        const serviceSubmitOrderResponse = await serviceSubmitOrder();
        console.log('serviceSubmitOrderResponse', serviceSubmitOrderResponse);
        resolve(serviceSubmitOrderResponse);
      } catch (error) {
        reject(error);
      }
    });
  };
};

const endProcess = () => {
  return (dispatch, getState) => {
    const currentCash = PaymentSelector.getCurrentAmount(getState().payment);
    const grandTotalAmount = OrderSelector.getOrderGrandTotalAmount(getState().order);
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
  };
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
      dispatch(endProcess());
    }
  }
};

const runFlowCashChangeSuccess = () => {
  return (dispatch, getState) => {
    dispatch(Actions.setCashChangeAmount(0));
    dispatch(getCashRemaining());
    console.log('isFinish', getState().payment.isFinish);
    if (getState().payment.isFinish) {
      setTimeout(() => {
        dispatch(backToHome());
      }, 500);
    }
  };
};

const runFlowProductDropSuccess = () => (dispatch, getState) => {
  const droppedProduct = MasterappSelector.getDroppedProduct(getState().masterapp);
  dispatch(productDropSuccess(droppedProduct));
    // ======================================================
    // check hasPromotionSet ?
    // ======================================================
  if (OrderSelector.verifyAllOrderDropped(getState().order)) {
    dispatch(endProcess());
  } else {
    dispatch(productDrop());
  }
};

export const setLimitBanknote = (limitAmount) => {
  return (dispatch, getState) => {
    setTimeout(() => {
      const client = MasterappSelector.getTcpClient(getState().masterapp);
      client.send({
        action: 2,
        msg: `${limitAmount}`,
        mode: 'limit',
      });
      dispatch(Actions.setLimitBanknote(limitAmount));
    }, 500);
  };
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
    // ======================================================
    // Check should disable bank note
    // ======================================================
    const cashRemainingAmount = getCashRemainingAmount(data.remain);
    const currentLimitBanknote = MasterappSelector.getLimitBanknote(getState().masterapp);
    console.log('get', cashRemainingAmount, currentLimitBanknote);
    if (cashRemainingAmount > 100 && currentLimitBanknote !== 500) {
      // disable 500
      dispatch(setLimitBanknote(500));

    } else if (cashRemainingAmount <= 100 && cashRemainingAmount > 50 && currentLimitBanknote !== 100) {
      // disable 100
      dispatch(setLimitBanknote(100));
    } else if (cashRemainingAmount <= 50 && cashRemainingAmount > 20 && currentLimitBanknote !== 50) {
      // disable 50
      dispatch(setLimitBanknote(50));
    } else if (cashRemainingAmount < 20 && currentLimitBanknote !== 20) {
      // disable 20
      dispatch(setLimitBanknote(20));
    } else {
      // do nothing
      console.log('Do not limit any banknotes');
    }
    dispatch(Actions.receivedCashRemaining(data));
  };
};

export const productDropProcessCompletely = () => async (dispatch, getState) => {
  dispatch(Actions.productDropProcessCompletely());
  const cashChangeAmount = PaymentSelector.getCashChangeAmount(getState().payment);
  // submitOrder
  try {
    const submitOrderResponse = await dispatch(submitOrder());
    console.log('productDropProcessCompletely.submitOrderResponse', submitOrderResponse);
    if (cashChangeAmount === 0) {
      setTimeout(() => {
        dispatch(backToHome());
      }, 1000);
    }
  } catch (error) {
    console.error(error);
  }
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
  console.log('=======================================');
  console.log('=======================================');
  console.log('sendCashChangeToServer:cashChangeAmount', cashChangeAmount);
  console.log('=======================================');
  console.log('=======================================');
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
export const insertCoin = value => (dispatch, getState) => {
  const client = MasterappSelector.getTcpClient(getState().masterapp);
  client.setFree();
  client.send({
    action: 999,
    msg: value,
  });
};
export const scanCode = value => (dispatch, getState) => {
  const client = MasterappSelector.getTcpClient(getState().masterapp);
  client.setFree();
  client.send({
    action: 998,
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
  dispatch(changePage('/topup/confirm'));
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
          ...verifyDiscountCodeResponse,
          code,
        };
        dispatch(Actions.addDiscount(discountItem));
      } catch (error) {
        dispatch(openAlertMessage(error));
      }
    } else {
      dispatch(openAlertMessage(convertApplicationErrorToError({
        th: `ไม่สามารถใช้รหัสส่วนลด ${code} ได้ เนื่องจากใช้ไปแล้ว`,
        en: '',
      })));
    }
  };
};

export const initHomePage = () => {
  return (dispatch, getState) => {
    dispatch(clearOrder());
  };
};

export const enableMoneyBoxWhenInitPage = () => {
  return (dispatch, getState) => {
    const moneyBoxActive = MasterappSelector.verifyIsMoneyBoxActive(getState().masterapp);
    // if mount with moneyBoxActive not active enable money box
    if (!moneyBoxActive) {
      dispatch(enableMoneyBox());
    } else {
      console.log('enableMoneyBoxWhenInitPage: LOADING PLZ');
      dispatch(showLoading('ระบบกำลังทอนเงิน'));
    }
  };
};

export const willReceivePropsEnableMoneyBoxWhenInitPage = (props, nextProps) => {
  return (dispatch, getState) => {
    if (props.moneyBoxActive && !nextProps.moneyBoxActive) {
      dispatch(hideLoading());
      dispatch(enableMoneyBoxWhenInitPage());
    }
  };
};

export const warningSystemWillNotChangeCash = () => {
  return (dispatch, getState) => {
    const canChangeCash = MasterappSelector.verifyCanChangeCash(getState().masterapp);
    if (!canChangeCash) {
      dispatch(Actions.showModal('warningSystemWillNotChangeCash'));
    }
  };
};

export const initSingleProductPage = () => {
  return (dispatch, getState) => {
    dispatch(enableMoneyBoxWhenInitPage());
    dispatch(warningSystemWillNotChangeCash());
  };
};

export const initPromotionSetPage = () => {
  return (dispatch, getState) => {
    dispatch(enableMoneyBoxWhenInitPage());
    dispatch(warningSystemWillNotChangeCash());
  };
};

export const initMobileTopupPage = () => {
  return (dispatch, getState) => {
    dispatch(enableMoneyBoxWhenInitPage());
    dispatch(warningSystemWillNotChangeCash());
  };
};

export const initPaymentPage = () => {
  return (dispatch, getState) => {
    const moneyBoxActive = MasterappSelector.verifyIsMoneyBoxActive(getState().masterapp);
    // if mount with moneyBoxActive not active enable money box
    if (!moneyBoxActive) {
      dispatch(enableMoneyBox());
    }
  };
};

// ======================================================
// EVENTS
// ======================================================
export const submitPlayEvent = () => {
  return (dispatch, getState) => {
    const eventWatches = OrderSelector.getEventWatches(getState().order);
    console.log('submitPlayEvent', eventWatches);
    debugger;
    if (_.size(eventWatches) > 0) {
      dispatch(changePage('/event/ads'));
    } else {
      dispatch(eventInitGetReward());
    }
  };
};

export const eventInitGetReward = () => {
  return (dispatch, getState) => {
    const shouldSendReward = OrderSelector.verifyEventShouldSendReward(getState().order);
    // const shouldUseRewardInstantly = OrderSelector.verifyEventShouldUseRewardInstantly(getState().order);
    const targetRoute = OrderSelector.getEventNextRewardRoute(getState().order);
    console.log('eventInitGetReward', shouldSendReward, targetRoute);
    debugger;
    if (shouldSendReward) {
      dispatch(eventGetReward());
    } else if (targetRoute.indexOf('/') >= 0) {
      // add discount
      const reward = OrderSelector.getEventNextReward(getState().order);
      const discountItem = {
        code: reward.code,
        value: reward.value
      };
      dispatch(Actions.addDiscount(discountItem));
      dispatch(changePage(targetRoute));
    }
  };
};

export const updateEventInput = (inputName, inputValue) => {
  return (dispatch, getState) => {
    dispatch(Actions.updateEventInput(inputName, inputValue));
  };
};

export const eventGetReward = () => {
  return async (dispatch, getState) => {
    const eventId = OrderSelector.getEventId(getState().order);
    const eventRewards = OrderSelector.getEventRewards(getState().order);
    const eventInputs = OrderSelector.getEventInputs(getState().order);
    try {
      _.forEach(eventRewards, async (reward) => {
        // ======================================================
        // Check should get reward
        // ======================================================
        if (_.includes(['SMS', 'EMAIL'], reward.channel.toUpperCase())) {
          console.log('eventGetReward', reward);
          const channel = reward.channel;
          const eventInput = getEventInputByChannel(eventInputs, channel);
          const rewardToServiceItem = {
            eventId,
            discountType: reward.name,
            amount: reward.value,
            channel: reward.channel,
            value: eventInput.value
          };
          const serviceGetEventRewardResponse = await serviceGetEventReward(rewardToServiceItem);
          console.log('serviceGetEventRewardResponse', serviceGetEventRewardResponse);
          dispatch({
            type: 'EVENT_SENT_REWARD',
            rewardToServiceItem
          });
        }
      });
    } catch (error) {
      dispatch(openAlertMessage(error));
    }
  };
};

export const eventUseDiscountRewardInstantly = () => {
  return (dispatch, getState) => {
    const eventRewardInstantly = OrderSelector.getEventRewardInstantly(getState().order);
    // ======================================================
    // ADD DISCOUNT
    // ======================================================
    const discountItem = {
      code: eventRewardInstantly.code,
      value: eventRewardInstantly.value
    };
    dispatch(Actions.addDiscount(discountItem));
    dispatch(changePage('/product/single'));
  };
};

export const eventUseMobileTopupRewardInstantly = () => {
  return (dispatch, getState) => {
    const eventRewardInstantly = OrderSelector.getEventRewardInstantly(getState().order);
    // ======================================================
    // ADD DISCOUNT
    // ======================================================
    const discountItem = {
      code: eventRewardInstantly.code,
      value: eventRewardInstantly.value
    };
    dispatch(Actions.addDiscount(discountItem));
    dispatch(changePage('/topup'));
  };
};

export const eventUseProductRewardInstantly = () => {
  return (dispatch, getState) => {
    // 1) SELECT PRODUCT
    const rewardProduct = OrderSelector.getEventProduct(getState().order);
    dispatch(Actions.selectProduct(rewardProduct));
    // 2) DROP PRODUCT
    dispatch(productDrop());
  };
};

export const eventUseRewardInstantly = () => {
  return async (dispatch, getState) => {
    const eventRewardInstantly = OrderSelector.getEventRewardInstantly(getState().order);
    if (eventRewardInstantly) {
      // ======================================================
      // Check reward type
      // ======================================================
      const rewardType = eventRewardInstantly.name;
      switch (rewardType) {
        case 'DISCOUNT':
          dispatch(eventUseDiscountRewardInstantly());
          break;
        case 'MOBILE_TOPUP':
          dispatch(eventUseMobileTopupRewardInstantly());
          break;
        case 'PRODUCT':
          dispatch(eventUseProductRewardInstantly());
          break;
        default:
          break;
      }
    }
  };
};

export const activateMoneyBox = () => {
  return (dispatch) => {
    dispatch(Actions.activateMoneyBox());
  };
};

export const deactivateMoneyBox = () => {
  return (dispatch) => {
    dispatch(Actions.deactivateMoneyBox());
  };
};

export const showLoading = (message) => {
  return (dispatch) => {
    dispatch(Actions.showLoading(message));
  };
};

export const hideLoading = () => {
  return (dispatch) => {
    dispatch(Actions.hideLoading());
  };
};
