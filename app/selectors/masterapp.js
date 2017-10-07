import { createSelector } from 'reselect';

const getBaseURL = state => state.baseURL;
const getTcp = state => state.tcp;
const getTemp = state => state.temp;
const getTcpClient = state => state.tcpClient;
const verifyReadyToDropProduct = state => state.readyToDropProduct;
const getDroppedProduct = state => state.droppingProduct;
const verifyCanChangeCash = state => state.canChangeCash;

export default {
  getBaseURL,
  getTcp,
  getTemp,
  getTcpClient,
  verifyReadyToDropProduct,
  getDroppedProduct,
  verifyCanChangeCash
};
