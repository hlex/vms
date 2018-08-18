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
  ORDER_PRODUCT_REMOVE,
  HARDWARE_START_PROCESS,
  HARDWARE_FINISH_PROCESS,
  SETTING_SET_RESET_TIME,
  SETTING_SET_AUTOPLAY_TIME,
  AUDIO_STARTED,
  AUDIO_ENDED,
  AUDIO_STOP_PLAY,
  AUDIO_START_PLAY,
  SET_APPLICATION_MODE,
  SET_MACHINE_ID,
  FETCH_DATA_COMPLETED,
  VERIFIED_SALES_MAN,
  CLEAR_VERIFY_SALES_MAN,
  RECEIVED_PAID_IN_FULL,
  CLEAR_RECEIVED_PAID_IN_FULL,
  REMEMBER_BASE_AD_PLAYING_INDEX,
  SET_DROP_PRODUCT_INTERVAL,
  GENERATE_LOG_ID,
  RESET_APPLICATION,
  SET_REQUEST_ORDER_ID
} from './actionTypes';

export const receivedSensorInformation = data => ({
  type: RECEIVED_SENSOR_INFORMATION,
  data,
});

export const receivedCash = data => ({
  type: RECEIVED_CASH,
  data,
});

export const receivedCashCompletely = () => ({
  type: RECEIVED_CASH_COMPLETELY,
});

export const productDropSuccess = droppedProduct => ({
  type: PRODUCT_DROP_SUCCESS,
  product: droppedProduct,
});

export const productDropProcessCompletely = () => ({
  type: PRODUCT_DROP_PROCESS_COMPLETELY,
});

export const selectProduct = item => ({
  type: SELECT_PRODUCT,
  item,
});

export const selectPromotionSet = item => ({
  type: SELECT_PROMOTION_SET,
  item,
});

export const initTcpClient = tcpClient => ({
  type: INIT_TCP_CLIENT,
  tcpClient,
});

export const resetPaymentReducer = () => ({
  type: RESET_PAYMENT_REDUCER,
});

export const clearPaymentAmount = () => ({
  type: CLEAR_PAYMENT_AMOUNT,
});

export const selectTopupProvider = topupProvider => ({
  type: SELECT_MOBILE_TOPUP_PROVIDER,
  topupProvider,
});

export const confirmMobileTopupMSISDN = MSISDN => ({
  type: CONFIRM_MOBILE_TOPUP_MSISDN,
  MSISDN,
});

export const receivedCashRemaining = data => ({
  type: RECEIVED_CASH_REMAINING,
  data,
});

export const showModal = (modalName, data) => ({
  type: SHOW_MODAL,
  name: modalName,
  data,
});

export const hideModal = modalName => ({
  type: HIDE_MODAL,
  name: modalName,
});

export const hideAllModal = () => ({
  type: HIDE_ALL_MODAL,
});

export const readyToDropProduct = () => ({
  type: READY_TO_DROP_PRODUCT,
});

export const notReadyToDropProduct = () => ({
  type: NOT_READY_TO_DROP_PRODUCT,
});

export const clearOrder = () => ({
  type: CLEAR_ORDER,
});

export const droppingProduct = product => ({
  type: DROPPING_PRODUCT,
  product,
});

export const selectMobileTopupValue = item => ({
  type: SELECT_MOBILE_TOPUP_VALUE,
  item,
});

export const submitMobileTopupValue = item => ({
  type: SUBMIT_MOBILE_TOPUP_VALUE,
  item,
});

export const clearMobileTopupValue = () => ({
  type: CLEAR_MOBILE_TOPUP_VALUE,
});

export const setCashChangeAmount = cashChangeAmount => ({
  type: SET_CASH_CHANGE_AMOUNT,
  cashChangeAmount,
});

export const clearMobileTopupMSISDN = () => ({
  type: CLEAR_MOBILE_TOPUP_MSISDN,
});

export const selectEvent = item => ({
  type: SELECT_EVENT,
  event: item,
});

export const addDiscount = discount => ({
  type: ADD_DISCOUNT,
  discount,
});

export const setCanChangeCash = canChangeCash => ({
  type: SET_CAN_CHANGE_CASH,
  canChangeCash,
});

export const receivedMasterdata = (key, items) => ({
  type: RECEIVED_MASTERDATA,
  key,
  value: items,
});

export const updateEventInput = (key, items) => ({
  type: EVENT_UPDATE_INPUT_VALUE,
  key,
  value: items,
});

export const setLimitBanknote = banknoteValue => ({
  type: SET_LIMIT_BANKNOTE,
  banknoteValue,
});

export const hardwareReady = () => ({
  type: HARDWARE_READY,
});

export const openAlertMessage = data => ({
  type: OPEN_ALERT_MESSAGE,
  data,
});

export const closeAlertMessage = () => ({
  type: CLOSE_ALERT_MESSAGE,
});

export const activateMoneyBox = () => ({
  type: ACTIVE_MONEY_BOX,
});

export const deactivateMoneyBox = () => ({
  type: DEACTIVE_MONEY_BOX,
});

export const showLoading = message => ({
  type: SHOW_LOADING,
  message,
});

export const hideLoading = () => ({
  type: HIDE_LOADING,
});

export const setFooterAds = ads => ({
  type: SET_FOOTER_ADS,
  ads,
  footerAdType: 'product'
});

export const resetFooterAds = () => ({
  type: RESET_FOOTER_ADS,
});

export const setFlagUseDiscountInstantly = () => ({
  type: USE_DISCOUNT_INSTANTLY,
});

export const clearInstantlyDiscount = () => ({
  type: CLEAR_INSTANTLY_DISCOUNT,
});

export const setBaseAds = ads => ({
  type: SET_BASE_ADS,
  ads,
});

export const setActivityFreeRule = (rule) => ({
  type: SET_ACTIVITY_FREE_RULE,
  rule,
});

export const switchLanguageTo = lang => ({
  type: SWITCH_LANGUAGE_TO,
  lang,
});

export const updateEventReward = ({ cuid }, discount) => ({
  type: EVENT_UPDATE_REWARD_DISCOUNT,
  cuid,
  discount,
});

export const removeProductFromOrder = product => ({
  type: ORDER_PRODUCT_REMOVE,
  product,
});

export const hardwareStartProcess = key => ({
  type: HARDWARE_START_PROCESS,
  key,
});

export const hardwareFinishProcess = (processNameToFinish) => ({
  type: HARDWARE_FINISH_PROCESS,
  processNameToFinish
});

export const setResetTime = (second) => ({
  type: SETTING_SET_RESET_TIME,
  resetTime: second
});

export const autoplayTime = (second) => ({
  type: SETTING_SET_AUTOPLAY_TIME,
  autoplayTime: second
});

export const startedAudio = () => ({
  type: AUDIO_STARTED,
});

export const endedAudio = () => ({
  type: AUDIO_ENDED,
});

export const startPlayAudio = () => ({
  type: AUDIO_START_PLAY,
});

export const stopPlayAudio = () => ({
  type: AUDIO_STOP_PLAY,
});

export const setApplicationMode = (mode) => ({
  type: SET_APPLICATION_MODE,
  mode
});

export const setMachineId = (machineId) => ({
  type: SET_MACHINE_ID,
  machineId
});

export const dataFetchedCompletely = () => ({
  type: FETCH_DATA_COMPLETED
});

export const verifySalesmanPass = ({ salesman }) => ({
  type: VERIFIED_SALES_MAN,
  salesman
});

export const clearVerifySalesman = () => ({
  type: CLEAR_VERIFY_SALES_MAN
});

export const receivedPaidInFull = () => ({
  type: RECEIVED_PAID_IN_FULL
});

export const clearReceivedPaidInFull = () => ({
  type: CLEAR_RECEIVED_PAID_IN_FULL
});

export const rememberBaseAdPlayingIndex = (baseAdPlayingIndex) => ({
  type: REMEMBER_BASE_AD_PLAYING_INDEX,
  baseAdPlayingIndex
});

export const setDropProductInterval = (dropProductInterval) => ({
  type: SET_DROP_PRODUCT_INTERVAL,
  dropProductInterval,
});

export const generateLogId = () => ({
  type: GENERATE_LOG_ID
});

export const resetApplication = () => ({
  type: RESET_APPLICATION
});

export const setRequestOrderId = ({ requestOrderId }) => ({
  type: SET_REQUEST_ORDER_ID,
  requestOrderId
});
