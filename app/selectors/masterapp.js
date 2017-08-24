import { createSelector } from 'reselect';

const getBaseURL = state => state.baseURL;
const getTcp = state => state.tcp;
const getTemp = state => state.temp;
const getTcpClient = state => state.tcpClient;
const verifyReadyToDropProduct = state => state.readyToDropProduct;

export default {
  getBaseURL,
  getTcp,
  getTemp,
  getTcpClient,
  verifyReadyToDropProduct,
};
