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
  CLEAR_MOBILE_TOPUP_MSISDN,
  SELECT_EVENT,
  ADD_DISCOUNT,
  SET_CAN_CHANGE_CASH,
  RECEIVED_MASTERDATA,
  EVENT_UPDATE_INPUT_VALUE,
  SET_LIMIT_BANKNOTE,
  HARDWARE_READY,
  OPEN_ALERT_MESSAGE,
  CLOSE_ALERT_MESSAGE,
  ACTIVE_MONEY_BOX,
  DEACTIVE_MONEY_BOX,
  SHOW_LOADING,
  HIDE_LOADING,
  SET_FOOTER_ADS,
  RESET_FOOTER_ADS,
  USE_DISCOUNT_INSTANTLY,
  CLEAR_INSTANTLY_DISCOUNT,
  SET_BASE_ADS,
  SET_ACTIVITY_FREE_RULE,
  SWITCH_LANGUAGE_TO,
  EVENT_UPDATE_REWARD_DISCOUNT,
  ORDER_PRODUCT_REMOVE
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

export const receivedCashRemaining = (data) => {
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

export const clearMobileTopupMSISDN = () => {
  return {
    type: CLEAR_MOBILE_TOPUP_MSISDN,
  };
};

export const selectEvent = (item) => {
  return {
    type: SELECT_EVENT,
    event: item
  };
};

export const addDiscount = (discount) => {
  return {
    type: ADD_DISCOUNT,
    discount,
  };
};

export const setCanChangeCash = (canChangeCash) => {
  return {
    type: SET_CAN_CHANGE_CASH,
    canChangeCash
  };
};

export const receivedMasterdata = (key, items) => {
  return {
    type: RECEIVED_MASTERDATA,
    key,
    value: items
  };
};

export const updateEventInput = (key, items) => {
  return {
    type: EVENT_UPDATE_INPUT_VALUE,
    key,
    value: items
  };
};

export const setLimitBanknote = (banknoteValue) => {
  return {
    type: SET_LIMIT_BANKNOTE,
    banknoteValue
  };
};

export const hardwareReady = () => {
  return {
    type: HARDWARE_READY,
  };
};

export const openAlertMessage = (data) => {
  return {
    type: OPEN_ALERT_MESSAGE,
    data
  };
};

export const closeAlertMessage = () => {
  return {
    type: CLOSE_ALERT_MESSAGE,
  };
};

export const activateMoneyBox = () => {
  return {
    type: ACTIVE_MONEY_BOX,
  };
};

export const deactivateMoneyBox = () => {
  return {
    type: DEACTIVE_MONEY_BOX,
  };
};

export const showLoading = (message) => {
  return {
    type: SHOW_LOADING,
    message
  };
};

export const hideLoading = () => {
  return {
    type: HIDE_LOADING,
  };
};

export const setFooterAds = (ads) => {
  return {
    type: SET_FOOTER_ADS,
    ads,
  };
};

export const resetFooterAds = () => {
  return {
    type: RESET_FOOTER_ADS
  };
};

export const setFlagUseDiscountInstantly = () => {
  return {
    type: USE_DISCOUNT_INSTANTLY
  };
};

export const clearInstantlyDiscount = () => {
  return {
    type: CLEAR_INSTANTLY_DISCOUNT
  };
};

export const setBaseAds = (ads) => {
  return {
    type: SET_BASE_ADS,
    ads
  };
};

export const setActivityFreeRule = ({ rule }) => {
  return {
    type: SET_ACTIVITY_FREE_RULE,
    rule
  };
};

export const switchLanguageTo = (lang) => {
  return {
    type: SWITCH_LANGUAGE_TO,
    lang
  }
}

export const updateEventReward = ({ cuid }, discount) => {
  return {
    type: EVENT_UPDATE_REWARD_DISCOUNT,
    cuid,
    discount
  };
};

export const removeProductFromOrder = (product) => {
  return {
    type: ORDER_PRODUCT_REMOVE,
    product
  };
};
