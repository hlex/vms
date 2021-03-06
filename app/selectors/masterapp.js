import _ from 'lodash';
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
const verifyAppReady = state => state.hardwareReady && state.mode === 'running' && state.dataIsFetched === true;
const verifyIsMaintenanceMode = state => state.mode === 'maintenance';
const verifyIsHardwareMalfunction = state => state.mode === 'hardwareBoxServerDown';
const verifyIsPaymentSystemMalfunction = state => state.paymentSystemDown === true;
const verifyIsMoneyBoxActive = state => state.moneyBoxActive;
const verifyIsLoading = state => state.loading.show;
const getActivityFreeRule = state => state.activityFreeRule;
const getLanguage = state => state.lang;
const getHardwareProcessing = state => state.hardwareProcessing;
const getAutoplayTime = state => state.autoplayTime;
const getMuteAds = state => state.mutedAds;
const getMachineId = state => state.machineId;
const getVerifiedSalesman = state => state.verifiedSalesman;
const getDropProductInterval = state => state.dropProductInterval;
const getLogId = state => state.logId;
const getRequestOrderId = state => state.requestOrderId;

const verifyIsEnablingMoneyBox = createSelector(
  [
    getHardwareProcessing
  ],
  (
    hardwareProcessing
  ) => hardwareProcessing === 'enableMoneyBox'
);

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
const verifyIsDroppingProduct = createSelector(
  [
    getDroppingProduct,
  ],
  (droppingProduct) => !_.isEmpty(droppingProduct)
);

export default {
  getRequestOrderId,
  getLogId,
  getLocalURL,
  getBaseURL,
  getLocalStaticURL,
  getTcp,
  getTemp,
  getTcpClient,
  verifyReadyToDropProduct,
  getDroppingProduct,
  getVerifiedSalesman,
  verifyCanChangeCash,
  getLimitBanknote,
  verifyAppReady,
  verifyIsMoneyBoxActive,
  verifyIsLoading,
  getActivityFreeRule,
  verifyIsDroppingProduct,
  verifyIsDroppingFreeProduct,
  getLanguage,
  getHardwareProcessing,
  verifyIsHardwareProcessing,
  verifyIsPaymentSystemMalfunction,
  getAutoplayTime,
  getMuteAds,
  verifyIsMaintenanceMode,
  getMachineId,
  verifyIsEnablingMoneyBox,
  verifyIsHardwareMalfunction,
  getDropProductInterval
};
