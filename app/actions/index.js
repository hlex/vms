import {
  SELECT_PRODUCT,
  INIT_TCP_CLIENT,
  RECEIVED_SENSOR_INFORMATION,
  RECEIVED_CASH,
  RECEIVED_CASH_COMPLETELY,
  PRODUCT_DROP_SUCCESS,
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

export const productDropSuccess = () => {
  return {
    type: PRODUCT_DROP_SUCCESS,
  };
};

export const selectProduct = (item) => {
  return {
    type: SELECT_PRODUCT,
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
