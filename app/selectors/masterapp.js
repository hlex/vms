import { createSelector } from 'reselect';

const getLocalURL = state => state.localURL;
const getBaseURL = state => state.baseURL;
const getLocalStaticURL = state => state.localStaticURL;
const getTcp = state => state.tcp;
const getTemp = state => state.temp;
const getTcpClient = state => state.tcpClient;
const verifyReadyToDropProduct = state => state.readyToDropProduct;
const getDroppingProduct = state => state.droppingProduct;
const verifyCanChangeCash = state => state.canChangeCash;
const getLimitBanknote = state => state.limitBanknote;
const verifyAppReady = state => state.hardwareReady && state.mode === 'running';
const verifyIsMaintenanceMode = state => state.mode === 'maintenance';
const verifyIsMoneyBoxActive = state => state.moneyBoxActive;
const verifyIsLoading = state => state.loading.show;
const getActivityFreeRule = state => state.activityFreeRule;
const getLanguage = state => state.lang;
const getHardwareProcessing = state => state.hardwareProcessing;
const getAutoplayTime = state => state.autoplayTime;
const getMuteAds = state => state.mutedAds;
const verifyIsHardwareProcessing = createSelector(
  [
    getHardwareProcessing
  ],
  (
    hardwareProcessing
  ) => {
    return hardwareProcessing !== '';
  }
);
const verifyIsDroppingFreeProduct = createSelector(
  [
    getDroppingProduct,
  ],
  (droppingProduct) => {
    return droppingProduct.price === 0;
  }
);

export default {
  getLocalURL,
  getBaseURL,
  getLocalStaticURL,
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
  verifyIsDroppingFreeProduct,
  getLanguage,
  getHardwareProcessing,
  verifyIsHardwareProcessing,
  getAutoplayTime,
  getMuteAds,
  verifyIsMaintenanceMode
};
