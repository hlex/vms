import {
  SELECT_PRODUCT,
  SELECT_PROMOTION_SET,
  INIT_TCP_CLIENT,
  RECEIVED_SENSOR_INFORMATION,
  RECEIVED_CASH,
  RECEIVED_CASH_COMPLETELY,
  PRODUCT_DROP_SUCCESS,
  PRODUCT_DROP_PROCESS_COMPLETELY,
  RESET_PAYMENT_REDUCER,
  CLEAR_PAYMENT_AMOUNT,
  SELECT_MOBILE_TOPUP_PROVIDER,
  CONFIRM_MOBILE_TOPUP_MSISDN,
  RECEIVED_CASH_REMAINING,
  SHOW_MODAL,
  HIDE_MODAL,
  HIDE_ALL_MODAL,
  READY_TO_DROP_PRODUCT,
  NOT_READY_TO_DROP_PRODUCT,
  CLEAR_ORDER,
  DROPPING_PRODUCT,
  SELECT_MOBILE_TOPUP_VALUE,
  SUBMIT_MOBILE_TOPUP_VALUE,
  CLEAR_MOBILE_TOPUP_VALUE,
  SET_CASH_CHANGE_AMOUNT,
} from './actionTypes';

export const receivedSensorInformation = (data) => {
  return {
    type: RECEIVED_SENSOR_INFORMATION,
    data,
  };
};

export const receivedCash = (data) => {
  return {
    type: RECEIVED_CASH,
    data,
  };
};

export const receivedCashCompletely = () => {
  return {
    type: RECEIVED_CASH_COMPLETELY,
  };
};

export const productDropSuccess = (droppedProduct) => {
  return {
    type: PRODUCT_DROP_SUCCESS,
    product: droppedProduct
  };
};

export const productDropProcessCompletely = () => {
  return {
    type: PRODUCT_DROP_PROCESS_COMPLETELY,
  };
};

export const selectProduct = (item) => {
  return {
    type: SELECT_PRODUCT,
    item
  };
};

export const selectPromotionSet = (item) => {
  return {
    type: SELECT_PROMOTION_SET,
    item
  };
};

export const initTcpClient = (tcpClient) => {
  return {
    type: INIT_TCP_CLIENT,
    tcpClient
  };
};

export const resetPaymentReducer = () => {
  return {
    type: RESET_PAYMENT_REDUCER,
  };
};

export const clearPaymentAmount = () => {
  return {
    type: CLEAR_PAYMENT_AMOUNT,
  };
};

export const selectTopupProvider = (topupProvider) => {
  return {
    type: SELECT_MOBILE_TOPUP_PROVIDER,
    topupProvider
  };
};

export const confirmMobileTopupMSISDN = (MSISDN) => {
  return {
    type: CONFIRM_MOBILE_TOPUP_MSISDN,
    MSISDN,
  };
};

export const getCashRemaining = (data) => {
  return {
    type: RECEIVED_CASH_REMAINING,
    data,
  };
};

export const showModal = (modalName, data) => {
  return {
    type: SHOW_MODAL,
    name: modalName,
    data,
  };
};

export const hideModal = (modalName) => {
  return {
    type: HIDE_MODAL,
    name: modalName
  };
};

export const hideAllModal = () => {
  return {
    type: HIDE_ALL_MODAL
  };
};

export const readyToDropProduct = () => {
  return {
    type: READY_TO_DROP_PRODUCT
  };
};

export const notReadyToDropProduct = () => {
  return {
    type: NOT_READY_TO_DROP_PRODUCT
  };
};

export const clearOrder = () => {
  return {
    type: CLEAR_ORDER
  };
};

export const droppingProduct = (product) => {
  return {
    type: DROPPING_PRODUCT,
    product
  };
};

export const selectMobileTopupValue = (item) => {
  return {
    type: SELECT_MOBILE_TOPUP_VALUE,
    item,
  };
};

export const submitMobileTopupValue = (item) => {
  return {
    type: SUBMIT_MOBILE_TOPUP_VALUE,
    item,
  };
};

export const clearMobileTopupValue = () => {
  return {
    type: CLEAR_MOBILE_TOPUP_VALUE,
  };
};

export const setCashChangeAmount = (cashChangeAmount) => {
  return {
    type: SET_CASH_CHANGE_AMOUNT,
    cashChangeAmount
  };
};
