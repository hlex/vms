import { push, goBack } from 'react-router-redux';
import * as Actions from './index.js';

export const back = () => {
  return (dispatch) => {
    dispatch(goBack());
  };
};

export const changePage = (context) => {
  return (dispatch) => {
    dispatch(push(context));
  };
};

export const selectProduct = (context, itemId) => {
  return (dispatch) => {
    dispatch(changePage(context));
    dispatch(Actions.selectProduct(itemId));
  };
};

export const submitProduct = () => {
  return (dispatch) => {
    dispatch(changePage('/payment'));
  };
};

export const initTcpClient = (tcpClient) => {
  return (dispatch) => {
    dispatch(Actions.initTcpClient(tcpClient));
  };
};

export const receivedCashCompletely = () => {
  return (dispatch) => {
    dispatch(Actions.receivedCashCompletely());
  };
};

export const receivedDataFromServer = (data) => {
  return (dispatch) => {
    // classify data
    if (data.sensor) {
      dispatch(Actions.receivedSensorInformation(data));
    }
    if (data.action === 2 && data.msg === '20') {
      dispatch(Actions.receivedCash(data));
    }
  };
};
