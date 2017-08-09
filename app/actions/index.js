import {
  SELECT_PRODUCT,
  INIT_TCP_CLIENT,
  RECEIVED_SENSOR_INFORMATION,
  RECEIVED_CASH,
  RECEIVED_CASH_COMPLETELY,
  PRODUCT_DROP_SUCCESS,
  RESET_PAYMENT_REDUCER,
  SELECT_MOBILE_TOPUP_PROVIDER,
  CONFIRM_MOBILE_TOPUP_MSISDN,
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

export const selectProduct = (itemId) => {
  return {
    type: SELECT_PRODUCT,
    itemId
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
