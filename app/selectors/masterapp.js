import { createSelector } from 'reselect';

const getBaseURL = state => state.baseURL;
const getTcp = state => state.tcp;
const getTemp = state => state.temp;
const getTcpClient = state => state.tcpClient;
const verifyReadyToDropProduct = state => state.readyToDropProduct;
const getDroppingProduct = state => state.droppingProduct;
const verifyCanChangeCash = state => state.canChangeCash;
const getLimitBanknote = state => state.limitBanknote;
const verifyAppReady = state => state.hardwareReady;
const verifyIsMoneyBoxActive = state => state.moneyBoxActive;
const verifyIsLoading = state => state.loading.show;
const getActivityFreeRule = state => state.activityFreeRule;
const verifyIsDroppingFreeProduct = createSelector(
  [
    getDroppingProduct,
  ],
  (droppingProduct) => {
    return droppingProduct.price === 0;
  }
);

export default {
  getBaseURL,
  getTcp,
  getTemp,
  getTcpClient,
  verifyReadyToDropProduct,
  getDroppingProduct,
  verifyCanChangeCash,
  getLimitBanknote,
  verifyAppReady,
  verifyIsMoneyBoxActive,
  verifyIsLoading,
  getActivityFreeRule,
  verifyIsDroppingFreeProduct
};
