import {
  SELECT_PRODUCT,
  INIT_TCP_CLIENT,
  RECEIVED_SENSOR_INFORMATION,
  RECEIVED_CASH,
  RECEIVED_CASH_COMPLETELY,
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
