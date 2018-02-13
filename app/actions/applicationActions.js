import { push, goBack } from 'react-router-redux';
import _ from 'lodash';
import cuid from 'cuid';
import * as Actions from './index';

// ======================================================
// Selectors
// ======================================================
import RootSelector from '../selectors/root';
import MasterappSelector from '../selectors/masterapp';
import MasterdataSelector from '../selectors/masterdata';
import PaymentSelector from '../selectors/payment';
import OrderSelector from '../selectors/order';
// ======================================================
// Helpers
// ======================================================
import {
  getServerCommand,
  needToChangeCash
} from '../helpers/tcp';
import {
  createLog,
  verifyLessThanThreshold,
  verifyDuplicatedDiscount,
  getCashRemainingAmount,
  getEventInputByChannel,
  verifyThisOrderShouldDropFreeProduct
} from '../helpers/global';
import {
  convertApplicationErrorToError,
} from '../helpers/error';
import {
  isSoldout,
  normalizeStripAds,
  convertToAppAd,
  convertToAppProduct,
  convertToAppPromotion,
  convertToAppMobileTopupProvider,
  convertToAppEvent,
  convertToAppText,
  convertToAppMainMenu,
} from '../helpers/masterdata';
import {
  extractResponseData,
} from '../helpers/api';
// ======================================================
// APIs
// ======================================================
import {
  serviceTopupMobile
} from '../apis/mobileTopup';
import {
  serviceVerifyDiscountCode,
} from '../apis/discount';
import {
  serviceSubmitOrder,
  serviceGetSumOrderAmount,
  syncSettlement,
  updateStock,
} from '../apis/order';
import {
  createTcpClient
} from '../apis/tcp';
import {
  serviceGetBaseAds,
  serviceGetEvents,
  serviceGetProducts,
  serviceGetPromotions,
  serviceGetMobileTopupProviders,
  serviceGetProductSteps,
  serviceGetEventSteps,
  serviceGetMobileTopupSteps,
  serviceGetMainMenu,
  serviceGetSetting,
  serviceGetMachineId,
} from '../apis/masterdata';
import {
  serviceGetEventReward,
  verifyBarcodeOrQrcode,
  verifyLineQrcode
} from '../apis/event';
import {
  serviceVerifySalesman
} from '../apis/salesman';

let cmdNo = 0;
let retryNo = 0;

var resetTimer;

export const getMasterProductAndEventAndPromotions = () => {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      const fileURL = MasterappSelector.getLocalURL(getState().masterapp);
      // ======================================================
      // PRODUCTS
      // ======================================================
      const serviceGetProductsResponse = await serviceGetProducts();
      const sanitizedProducts = _.map(extractResponseData(serviceGetProductsResponse), (product) => {
        return convertToAppProduct(product, fileURL);
      });
      // ======================================================
      // Grouped PoId
      // ======================================================
      const groupedByPoId = _.groupBy(sanitizedProducts, 'id');
      const mergedPhysicalProducts = _.reduce(groupedByPoId, (result, products, poId) => {
        const baseProduct = _.get(products, 0, {});
        const sumQty = _.sumBy(products, 'qty');
        const physicals = _.reduce(products, (accPhysical, product) => {
          return [
            ...accPhysical,
            {
              cuid: cuid(),
              row: product.row,
              col: product.col,
              qty: product.qty,
              canDrop: product.qty !== 0,
              slotNo: product.slotNo,
              isFree: product.isFree,
            }
          ];
        }, []);
        const everyPhysicalIsFree = _.every(physicals, physical => physical.isFree);
        console.log('everyPhysicalIsFree', poId, everyPhysicalIsFree, physicals);
        return [
          ...result,
          _.omit({
            ...baseProduct,
            qty: sumQty,
            isSoldout: isSoldout(sumQty),
            everyPhysicalIsFree,
            physicals,
          }, ['isFree', 'col', 'row', 'slotNo'])
        ];
      }, []);
      dispatch(Actions.receivedMasterdata('products', mergedPhysicalProducts));
      // ======================================================
      // EVENTS
      // ======================================================
      const serviceGetEventsResponse = await serviceGetEvents();
      const sanitizedEvents = _.map(extractResponseData(serviceGetEventsResponse), event => convertToAppEvent(event, fileURL));
      const eventsWhichMorphEventProductToMasterProduct = _.map(sanitizedEvents, (event) => {
        return {
          ...event,
          product: _.find(mergedPhysicalProducts, product => product.id === event.product.id),
        };
      });
      dispatch(Actions.receivedMasterdata('events', eventsWhichMorphEventProductToMasterProduct));
      // ======================================================
      // PROMOTION
      // ======================================================
      const serviceGetPromotionsResponse = await serviceGetPromotions();
      const sanitizedPromotions = _.map(extractResponseData(serviceGetPromotionsResponse), promotion => {
        const products = _.map(promotion.Product_List, (promotionProduct) => {
          return _.find(mergedPhysicalProducts, product => product.id === promotionProduct.Po_ID);
        })
        const hasSomeProductThatEveryPhysicalIsFree = _.some(products, 'everyPhysicalIsFree');
        console.log('promotion => ', products, hasSomeProductThatEveryPhysicalIsFree);
        const promotionWithMorphProduct = {
          ...promotion,
          products,
          hasSomeProductThatEveryPhysicalIsFree,
        };
        return convertToAppPromotion(promotionWithMorphProduct, fileURL);
      });
      dispatch(Actions.receivedMasterdata('promotionSets', sanitizedPromotions));
      resolve(mergedPhysicalProducts);
    });
  };
};

export const initApplication = () => {
  return async (dispatch, getState) => {
    const tcp = MasterappSelector.getTcp(getState().masterapp);
    dispatch(initTcpClient(createTcpClient(tcp.ip, tcp.port)));
    // ======================================================
    // GET MASTER DATA
    // ======================================================
    try {
      const fileURL = MasterappSelector.getLocalURL(getState().masterapp);
      // ======================================================
      // MAINMENU
      // ======================================================
      const serviceGetMainMenuResponse = await serviceGetMainMenu();
      const mainMenus = _.map(extractResponseData(serviceGetMainMenuResponse), (mainMenu, index) => convertToAppMainMenu(mainMenu, index));
      dispatch(Actions.receivedMasterdata('mainMenus', mainMenus));
      // ======================================================
      // STEPS
      // ======================================================
      const serviceGetEventStepsResponse = await serviceGetEventSteps();
      const eventSteps = _.map(extractResponseData(serviceGetEventStepsResponse), (event, index) => convertToAppText(event, index));
      dispatch(Actions.receivedMasterdata('eventSteps', eventSteps));
      const serviceGetProductStepsResponse = await serviceGetProductSteps();
      const productSteps = _.map(extractResponseData(serviceGetProductStepsResponse), (event, index) => convertToAppText(event, index));
      dispatch(Actions.receivedMasterdata('productSteps', productSteps));
      const serviceGetMobileTopupStepsResponse = await serviceGetMobileTopupSteps();
      const mobileTopupSteps = _.map(extractResponseData(serviceGetMobileTopupStepsResponse), (event, index) => convertToAppText(event, index));
      dispatch(Actions.receivedMasterdata('mobileTopupSteps', mobileTopupSteps));
      // ======================================================
      // SETTING
      // ======================================================
      const getMachineIdResponse = await serviceGetMachineId();
      console.log('getMachineIdResponse', getMachineIdResponse);
      const machineId = _.get(extractResponseData(getMachineIdResponse), 'MachineID', '');
      dispatch(Actions.setMachineId(machineId));

      const getSettingResponse = await serviceGetSetting();
      const settingResponse = extractResponseData(getSettingResponse);
      const activityFreeRule = _.get(settingResponse, 'rule', '');
      const resetTime = _.get(settingResponse, 'resetTime', 60);
      const autoplayTime = _.get(settingResponse, 'autoplayTime', 10);
      dispatch(Actions.setActivityFreeRule(activityFreeRule));
      dispatch(Actions.setResetTime(resetTime));
      dispatch(Actions.autoplayTime(autoplayTime));
      // ======================================================
      // ADS
      // ======================================================
      const serviceGetBaseAdsResponse = await serviceGetBaseAds();
      const sanitizedBaseAds = _.map(extractResponseData(serviceGetBaseAdsResponse), (ad) => {
        return normalizeStripAds(convertToAppAd(ad), fileURL);
      });
      dispatch(Actions.setBaseAds(sanitizedBaseAds));
      dispatch(Actions.setFooterAds(sanitizedBaseAds));
      // ======================================================
      // PRODUCTS & EVENT & PROMOTION
      // ======================================================
      await dispatch(getMasterProductAndEventAndPromotions());
      // ======================================================
      // MOBILE TOPUP PROVIDER
      // ======================================================
      const serviceGetMobileTopupProvidersResponse = await serviceGetMobileTopupProviders();
      const sanitizedMobileTopupProviders = _.map(extractResponseData(serviceGetMobileTopupProvidersResponse), mobileTopupProvider => convertToAppMobileTopupProvider(mobileTopupProvider, fileURL));
      dispatch(Actions.receivedMasterdata('topupProviders', sanitizedMobileTopupProviders));

      const resetTimeMS = resetTime * 1000;
      setTimeout(() => {
        dispatch(addResetTimer(resetTimeMS));
      }, 10000);
    } catch (error) {
      console.error(error);
    }
  };
};

const addResetTimer = (resetTimeMS) => {
  const addResetTime = (callback) => {
    // console.log('--- START RESET TIME ---', resetTimer);
    return window.setInterval(() => {
      // console.log('--- DO RESET --- ', resetTimer);
      callback();
    }, resetTimeMS);
  };
  return (dispatch) => {
    resetTimer = addResetTime(() => {
      dispatch(backToHome());
    });
    // console.log('resetTimer', resetTimer);
    document.addEventListener('click', () => {
      window.clearInterval(resetTimer);
      // console.log('--- CLS RESET TIME --- ', resetTimer);
      resetTimer = addResetTime(() => {
        dispatch(backToHome());
      });
    });
  };
};

export const doorClosed = () => {
  return async (dispatch, getState) => {
    console.log('doorClosed');
    try {
      await syncSettlement();
    } catch (error) {
      dispatch(openAlertMessage(convertApplicationErrorToError({
        title: 'ไม่สามารถ Sync Settlement ได้',
        th: 'กรุณาตรวจสอบข้อมูลและทำรายการใหม่อีกครั้ง',
        en: '',
      })));
    }
    // even if syncSettlement error, continue update stock.
    try {
      await updateStock();
      // openAlarm
      const client = MasterappSelector.getTcpClient(getState().masterapp);
      client.send({
        action: 0,
        sensor: 'alarm',
        msg: '1',
      });
      dispatch(getMasterProductAndEventAndPromotions());
      setTimeout(dispatch(Actions.setApplicationMode('running')), 3000);
      dispatch(backToHome());
    } catch (error) {
      dispatch(openAlertMessage(convertApplicationErrorToError({
        title: 'ไม่สามารถ Update Stock ได้',
        th: 'ระบบไม่สามารถทำงานต่อได้ กรุณาตรวจสอบข้อมูลและทำรายการอีกครั้ง',
        en: '',
      })));
    }
  };
};

export const doorOpened = () => {
  return (dispatch, getState) => {
    console.log('doorOpened');
    dispatch(Actions.setApplicationMode('maintenance'));
  };
};

export const receivedDataFromServer = data => (dispatch, getState) => {
  if (data.sensor && data.sensor === 'temp') return;
  const client = MasterappSelector.getTcpClient(getState().masterapp);
  client.setFree();
  client.doSend();
  // classify data
  const cmd = getServerCommand(data);
  cmdNo += 1;
  console.log(`%c App cmd: ${cmd}`, createLog(null, 'pink', 'red'), 'trx:cmd =', cmdNo);
  switch (cmd) {
    case 'CONNECTION_ESTABLISH':
      break;
    case 'CONNECTED':
      setTimeout(() => {
        dispatch(resetTAIKO());
      }, 1000);
      break;
    case 'UPDATE_TEMP':
      dispatch(Actions.receivedSensorInformation(data));
      break;
    case 'SCANNED_QR_CODE':
      dispatch(receivedScannedCode(data.msg || ''));
      break;
    case 'INSERT_CASH':
      dispatch(Actions.receivedCash(data));
      dispatch(runFlowCashInserted());
      break;
    case 'CASH_CHANGE_SUCCESS':
      dispatch(runFlowCashChangeSuccess());
      break;
    case 'CASH_CHANGE_FAIL':
      dispatch(Actions.showModal('cashChangeError'));
      break;
    case 'PRODUCT_DROP_SUCCESS':
      dispatch(runFlowProductDropSuccess());
      break;
    case 'PRODUCT_DROP_FAIL':
      const isDroppingFreeProduct = MasterappSelector.verifyIsDroppingFreeProduct(getState().masterapp);
      console.log('isDroppingFreeProduct', isDroppingFreeProduct);
      if (isDroppingFreeProduct) {
        const productToDrop = OrderSelector.getProductToDrop(getState().order);
        const targetPhysical = OrderSelector.getFreeDropProductTargetPhysical(getState().order);
        dispatch({
          type: 'PRODUCT_MARK_CANNOT_USE_PHYSICAL',
          product: productToDrop,
          physical: targetPhysical
        });
        const productToFreeDropHasAvailablePhysical = OrderSelector.verifyProductToFreeDropHasAvailablePhysical(getState().order);
        console.log('productToFreeDropHasAvailablePhysical', productToFreeDropHasAvailablePhysical);
        if (productToFreeDropHasAvailablePhysical) {
          // retry
          dispatch(productFreeDrop());
        } else {
          // filter free product from orders
          dispatch(Actions.removeProductFromOrder(productToDrop));
          dispatch(endProcess());
        }
      } else {
        // ======================================================
        // STAMP FAIL TO PHYSICAL
        // ======================================================
        const productToDrop = OrderSelector.getProductToDrop(getState().order);
        const targetPhysical = OrderSelector.getDropProductTargetPhysical(getState().order);
        dispatch({
          type: 'PRODUCT_MARK_CANNOT_USE_PHYSICAL',
          product: productToDrop,
          physical: targetPhysical
        });
        const productToDropHasAvailablePhysical = OrderSelector.verifyProductToDropHasAvailablePhysical(getState().order);
        console.log('productToDropHasAvailablePhysical', productToDropHasAvailablePhysical);
        if (productToDropHasAvailablePhysical) {
          // retry
          dispatch(productDrop());
        } else {
          // return cash eql product price
          dispatch(setNotReadyToDropProduct());
          if (OrderSelector.verifyHasDroppedProduct(getState().order)) {
            dispatch(cashChangeEqualToCurrentCashAmountMinusDroppedProduct());
          } else {
            dispatch(cashChangeEqualToCurrentCashAmount());
          }
          dispatch(Actions.showModal('productDropError'));
        }
      }
      break;
    case 'RESET_TAIKO_SUCCESS':
      setTimeout(() => {
        dispatch(getCashRemaining());
      }, 1000);
      break;
    case 'RESET_TAIKO_FAIL':
      break;
    case 'ENABLE_MONEY_BOX_SUCCESS':
      // Do nothing
      dispatch(activateMoneyBox());
      dispatch(Actions.hardwareStartProcess(''));
      retryNo = 0;
      break;
    case 'ENABLE_MONEY_BOX_FAIL':
      setTimeout(() => {
        dispatch(enableMoneyBox());
      }, 1000);
      break;
    case 'DISABLE_MONEY_BOX_SUCCESS':
      setTimeout(() => {
        dispatch(sendCashChangeToServer());
      }, 1000);
      dispatch(deactivateMoneyBox());
      dispatch(Actions.hardwareStartProcess(''));
      retryNo = 0;
      break;
    case 'DISABLE_MONEY_BOX_FAIL':
      dispatch(disableMoneyBox());
      break;
    case 'CASH_REMAINING_SUCCESS':
      setTimeout(() => {
        dispatch(receivedCashRemaining(data));
        if (MasterappSelector.verifyAppReady(getState().masterapp) === false) {
          dispatch(Actions.hardwareReady());
        }
      }, 1000);
      break;
    case 'CASH_REMAINING_FAIL':
      setTimeout(() => {
        dispatch(getCashRemaining());
      }, 1000);
      break;
    case 'LIMIT_BANKNOTE_SUCCESS':
      break;
    case 'DOOR_CLOSED':
      dispatch(doorClosed());
      break;
    case 'DOOR_OPENED':
      dispatch(doorOpened());
      break;
    default:
      break;
  }
};

const verifyIsBarcodeOrQrCodeInput = (inputType) => {
  return _.includes(['BARCODE', 'QR_CODE'], inputType);
};

const verifyIsLineQrcodeInput = (inputType) => {
  return _.includes(['LINE_QR_CODE'], inputType);
};
// code is scannedCode
const verifyIsLineQrcode = (scannedCode) => {
  return scannedCode.indexOf('http') >= 0;
};

const verifyIsBarcode = (scannedCode) => {
  return /^\d+$/.test(scannedCode);
};

const extractDiscountFromResponseData = (responseData) => {
  return {
    code: responseData.discountcode || 0,
    value: responseData.discountprice || '',
    expireDate: responseData.expiredate,
  };
};

const verifyDiscountIsExist = (discount) => {
  return discount.code !== '' && discount.value !== 0;
}

export const receivedScannedCode = (scannedCode) => {
  return async (dispatch, getState) => {
    const nextInput = OrderSelector.getEventNextInput(getState().order);
    const nextReward = OrderSelector.getEventNextReward(getState().order);
    const eventId = OrderSelector.getEventId(getState().order);
    console.log('receivedScannedCode', eventId, scannedCode, nextInput);
    if (eventId) {
      try {
        if (verifyIsBarcodeOrQrCodeInput(nextInput)) {
          const isBarcode = verifyIsBarcode(scannedCode);
          const dataToVerify = {
            eventId,
            code: scannedCode,
            discountType: isBarcode ? 'barcode' : 'qrcode'
          };
          dispatch(showLoading('กำลังตรวจสอบข้อมูล'));
          const verifyBarcodeOrQrcodeResponse = await verifyBarcodeOrQrcode(dataToVerify);
          const responseData = extractResponseData(verifyBarcodeOrQrcodeResponse);
          const discount = extractDiscountFromResponseData(responseData);
          dispatch(hideLoading());
          if (verifyDiscountIsExist(discount)) {
            dispatch(updateEventReward(nextReward, discount));
          }
          dispatch(updateEventInput(nextInput, scannedCode));
        } else if (verifyIsLineQrcodeInput) {
          const isLineQrcode = verifyIsLineQrcode(scannedCode);
          const exactLineId = _.last(_.split(scannedCode, '/'));
          if (isLineQrcode) {
            const barcodeOrQrcode = OrderSelector.getEventBarcodeOrQrcodeInput(getState().order);
            const dataToVerify = {
              eventId,
              code: exactLineId,
              barcodeOrQrcode,
            };
            dispatch(showLoading('กำลังตรวจสอบข้อมูล'));
            const verifyLineQrcodeResponse = await verifyLineQrcode(dataToVerify);
            const responseData = extractResponseData(verifyLineQrcodeResponse);
            const discount = extractDiscountFromResponseData(responseData);
            dispatch(hideLoading());
            if (verifyDiscountIsExist(discount)) {
              dispatch(updateEventReward(nextReward, discount));
            }
            dispatch(updateEventInput(nextInput, exactLineId));
          } else {
            console.error(`${scannedCode} is not lineId`);
          }
        } else {
          console.error(`${scannedCode} is not barcode or qrcode or lineId`);
        }
      } catch (error) {
        dispatch(handleApiError(error));
      }
    }
    if (getState().router.location.pathname === '/salesman') {
      // validate salesman
      try {
        dispatch(showLoading('กำลังตรวจสอบข้อมูล'));
        await serviceVerifySalesman(scannedCode);
        dispatch(hideLoading());
        // pass call api disable alarm
        const client = MasterappSelector.getTcpClient(getState().masterapp);
        client.send({
          action: 0,
          sensor: 'alarm',
          msg: '0',
        });
        // render under construction
        dispatch(openAlertMessage(convertApplicationErrorToError({
          title: `รหัสพนักงาน ${scannedCode} ถูกต้อง`,
          th: 'กรุณาเปิดตู้เพื่อทำรายการต่อ',
          en: '',
        })));
      } catch (error) {
        // show error
        dispatch(handleApiError(error));
        dispatch(openAlertMessage(convertApplicationErrorToError({
          title: `รหัสพนักงาน ${scannedCode} ไม่ถูกต้อง`,
          th: 'กรุณาตรวจสอบใหม่อีกครั้ง',
          en: '',
        })));
      }
    }
  };
};

/*
const data = {
  title: {
    th: `ไม่สามารถใช้ส่วนลด ${code} ได้`,
    en: '',
  },
  messages: {
    th: `เนื่องจากส่วนลด ${code} ไม่มีในระบบ กรุณากรอกรหัสใหม่อีกครั้ง`,
    en: '',
  },
  technical: {
    message: '',
    code: ''
  },
};
*/
export const openAlertMessage = (data) => {
  return (dispatch) => {
    dispatch(Actions.openAlertMessage(data));
  };
};

export const closeAlertMessage = () => {
  return (dispatch) => {
    dispatch(Actions.closeAlertMessage());
  };
};

export const handleApiError = (error) => {
  return (dispatch) => {
    dispatch(hideLoading());
    dispatch(Actions.openAlertMessage(error));
  };
};

export const clearOrder = () => dispatch => {
  dispatch(Actions.clearOrder());
};

export const backToHome = () => (dispatch, getState) => {
  const isHardwareProcessing = MasterappSelector.verifyIsHardwareProcessing(getState().masterapp);
  if (isHardwareProcessing) {
    return '';
  }
  dispatch(changePage(''));
  // ======================================================
  // Clear many stuffs
  // ======================================================
  dispatch(Actions.resetPaymentReducer());
  dispatch(Actions.notReadyToDropProduct());
};

export const back = () => dispatch => {
  dispatch(goBack());
};

export const changePage = context => dispatch => {
  dispatch(push(context));
};

export const selectProduct = (context, item, module) => dispatch => {
  console.log('selectProduct', context, item, module);
  dispatch(changePage(context));
  // ======================================================
  // Select Product
  // ======================================================
  switch (module) {
    case 'singleProduct':
      dispatch(Actions.selectProduct(item));
      break;
    case 'promotionSet':
      dispatch(Actions.selectPromotionSet(item));
      _.forEach(item.products, product => {
        dispatch(Actions.selectProduct(product));
      });
      break;
    case 'mobileTopup':
      dispatch(selectTopupProvider(context, item));
      dispatch(Actions.receivedMasterdata('mobileTopupValues', item.topupValues));
      break;
    case 'event':
      dispatch(selectEvent(context, item));
      break;
    default:
      console.warn('module not matching', module);
      break;
  }
  if (item.ads) {
    dispatch(Actions.setFooterAds(item.ads));
  }
};

export const submitProduct = () => dispatch => {
  dispatch(changePage('/payment'));
};

export const submitPromotionSet = () => dispatch => {
  dispatch(changePage('/payment'));
};

export const initTcpClient = tcpClient => dispatch => {
  dispatch(Actions.initTcpClient(tcpClient));
};

export const productDropSuccess = droppedProduct => dispatch => {
  dispatch(Actions.productDropSuccess(droppedProduct));
};

export const receivedCashCompletely = () => dispatch => {
  dispatch(Actions.receivedCashCompletely());
};

export const productDrop = () => (dispatch, getState) => {
  const readyToDropProduct = MasterappSelector.verifyReadyToDropProduct(getState().masterapp);
  if (readyToDropProduct) {
    const targetRowColumn = OrderSelector.getDropProductTargetRowColumn(getState().order);
    const client = MasterappSelector.getTcpClient(getState().masterapp);
    client.send({
      action: 1,
      msg: targetRowColumn || '00', // row * col
    });
    dispatch(Actions.droppingProduct(OrderSelector.getProductToDrop(getState().order)));
  } else {
    console.error('Cannot Drop Product because readyToDropProduct = ', readyToDropProduct);
  }
};

export const productFreeDrop = () => (dispatch, getState) => {
  const readyToDropProduct = MasterappSelector.verifyReadyToDropProduct(getState().masterapp);
  if (readyToDropProduct) {
    const targetRowColumn = OrderSelector.getFreeDropProductTargetRowColumn(getState().order);
    const client = MasterappSelector.getTcpClient(getState().masterapp);
    client.send({
      action: 1,
      msg: targetRowColumn, // row * col
    });
    dispatch(Actions.droppingProduct(OrderSelector.getProductToDrop(getState().order)));
  } else {
    console.error('Cannot Drop Product because readyToDropProduct = ', readyToDropProduct);
  }
};

export const selectTopupProvider = (context, topupProvider) => dispatch => {
  dispatch(changePage(context));
  dispatch(Actions.selectTopupProvider(topupProvider));
};

export const submitOrder = () => {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      // ======================================================
      // Check has discount or not ?
      // ======================================================
      try {
        // const hasDiscount = OrderSelector.verifyOrderHasDiscount(getState().order);
        // if (hasDiscount) {
        //   const discounts = OrderSelector.getDiscounts(getState().order);
        //   const poId = OrderSelector.getOrderPoId(getState().order);
        //   _.forEach(discounts, async (discount) => {
        //     const discountType = discount.discountType || 'product';
        //     const serviceUseDiscountCodeResponse = await serviceUseDiscountCode(discount.code, poId, discountType);
        //     console.log('serviceUseDiscountCodeResponse', serviceUseDiscountCodeResponse);
        //   });
        //   console.log('serviceUseDiscountCodeResponse:finish');
        // }
        const order = OrderSelector.toSubmitOrder(getState().order);
        const serviceSubmitOrderResponse = await serviceSubmitOrder(order);
        console.log('serviceSubmitOrderResponse', serviceSubmitOrderResponse);
        // ======================================================
        // REGET PRODUCTS & EVENT
        // ======================================================
        await dispatch(getMasterProductAndEventAndPromotions());
        resolve(serviceSubmitOrderResponse);
      } catch (error) {
        reject(error);
      }
    });
  };
};

const endProcess = () => {
  return (dispatch, getState) => {
    // const currentCash = PaymentSelector.getCurrentAmount(getState().payment);
    // const grandTotalAmount = OrderSelector.getOrderGrandTotalAmount(getState().order);
    // if (needToChangeCash(grandTotalAmount, currentCash)) {
    //   console.log(
    //       '%c App cashChange:',
    //       createLog('app'),
    //       'cashChange =',
    //       currentCash - grandTotalAmount,
    //     );
    //   dispatch(cashChange());
    // }
    dispatch(productDropProcessCompletely());
  };
};

// ======================================================
// Server Command
// ======================================================
const runFlowCashInserted = () => async (dispatch, getState) => {
  dispatch(changePage('/payment'));
  const currentCash = PaymentSelector.getCurrentAmount(getState().payment);
  const grandTotalAmount = OrderSelector.getOrderGrandTotalAmount(getState().order);
  console.log(
      '%c App isInsertCash:',
      createLog('app'),
      'currentCash =',
      currentCash,
      'totalAmount =',
      grandTotalAmount,
    );
  if (currentCash >= grandTotalAmount) {
    dispatch(setReadyToDropProduct());
    dispatch(Actions.stopPlayAudio());
    setTimeout(() => {
      dispatch(receivedCashCompletely());
    }, 1000);
    if (OrderSelector.verifyOrderHasProduct(getState().order)) {
      dispatch(productDrop());
    } else if (OrderSelector.verifyMobileTopupOrder(getState().order)) {
      try {
        const discount = OrderSelector.getDiscount(getState().order);
        const discountCode = _.get(discount, 'code', '');
        const machineId = MasterappSelector.getMachineId(getState().masterapp);
        const serviceTopupMobileResponse = await serviceTopupMobile(
            OrderSelector.getMobileTopupToService(getState().order),
            discountCode,
            machineId
          );
        console.log('serviceTopupMobile', serviceTopupMobileResponse);
        dispatch(endProcess());
      } catch (error) {
        dispatch(handleApiError(error));
        dispatch(backToHome());
      }
    }
  }
};

const runFlowCashChangeSuccess = () => {
  return (dispatch, getState) => {
    dispatch(Actions.setCashChangeAmount(0));
    dispatch(getCashRemaining());
    if (getState().payment.isFinish) {
      setTimeout(() => {
        dispatch(backToHome());
      }, 500);
    }
  };
};

const runFlowProductDropSuccess = () => async (dispatch, getState) => {
  const droppedProduct = MasterappSelector.getDroppingProduct(getState().masterapp);
  dispatch(productDropSuccess(droppedProduct));
    // ======================================================
    // check hasPromotionSet ?
    // ======================================================
  if (OrderSelector.verifyAllOrderDropped(getState().order)) {
    const activityFreeRule = MasterappSelector.getActivityFreeRule(getState().masterapp);
    const serviceGetSumOrderAmountResponse = await serviceGetSumOrderAmount();
    const sumOrderAmount = extractResponseData(serviceGetSumOrderAmountResponse);
    const isOrderHasFreeProduct = OrderSelector.verifyOrderHasFreeProduct(getState().order);
    console.log('CheckDropFreeProduct: activityFreeRule', activityFreeRule);
    console.log('CheckDropFreeProduct: sumOrderAmount', sumOrderAmount);
    console.log('CheckDropFreeProduct: isOrderHasFreeProduct', isOrderHasFreeProduct);
    console.log('CheckDropFreeProduct: verifyThisOrderShouldDropFreeProduct', verifyThisOrderShouldDropFreeProduct(sumOrderAmount, activityFreeRule));
    if (verifyThisOrderShouldDropFreeProduct(sumOrderAmount, activityFreeRule) && !isOrderHasFreeProduct) {
      const freeProduct = MasterdataSelector.getActivityFreeProduct(getState().masterdata);
      if (freeProduct) {
        // add freeProduct
        dispatch(Actions.selectProduct(freeProduct));
        dispatch(productFreeDrop());
      } else {
        dispatch(endProcess());
      }
    } else {
      dispatch(endProcess());
    }
  } else {
    dispatch(productDrop());
  }
};

export const setLimitBanknote = (limitAmount) => {
  return (dispatch, getState) => {
    setTimeout(() => {
      const client = MasterappSelector.getTcpClient(getState().masterapp);
      client.send({
        action: 2,
        msg: `${limitAmount}`,
        mode: 'limit',
      });
      dispatch(Actions.setLimitBanknote(limitAmount));
    }, 500);
  };
};

export const receivedCashRemaining = (data) => {
  return (dispatch, getState) => {
    dispatch(hideLoading());
    // ======================================================
    // Check < 100 baht
    // ======================================================
    const thresHold = 100;
    const isLessThanThreshold = verifyLessThanThreshold(data.remain, thresHold);
    const canChangeCash = isLessThanThreshold === false;
    dispatch(Actions.setCanChangeCash(canChangeCash));
    // ======================================================
    // Check should disable bank note
    // ======================================================
    const cashRemainingAmount = getCashRemainingAmount(data.remain);
    const { oneBahtCount } = getCashRemaining(data.remain);
    const currentLimitBanknote = MasterappSelector.getLimitBanknote(getState().masterapp);
    console.log('get', cashRemainingAmount, oneBahtCount, currentLimitBanknote);
    if (oneBahtCount < 5) {
      dispatch(setLimitBanknote(20));
    } else if (cashRemainingAmount > 100 && currentLimitBanknote !== 500) {
      // disable 500
      dispatch(setLimitBanknote(500));
    } else if (cashRemainingAmount <= 100 && cashRemainingAmount > 50 && currentLimitBanknote !== 100) {
      // disable 100
      dispatch(setLimitBanknote(100));
    } else if (cashRemainingAmount <= 50 && cashRemainingAmount > 20 && currentLimitBanknote !== 50) {
      // disable 50
      dispatch(setLimitBanknote(50));
    } else if (cashRemainingAmount < 20 && currentLimitBanknote !== 20) {
      // disable 20
      dispatch(setLimitBanknote(20));
    } else {
      // do nothing
      console.log('Do not limit any banknotes');
    }
    dispatch(Actions.receivedCashRemaining(data));
  };
};

export const productDropProcessCompletely = () => async (dispatch, getState) => {
  const isOrderHasFreeProduct = OrderSelector.verifyOrderHasFreeProduct(getState().order);
  debugger;
  if (isOrderHasFreeProduct) {
    dispatch(changePage('/thankyou-with-free-product'));
  } else {
    dispatch(changePage('/thankyou'));
  }
  dispatch(Actions.productDropProcessCompletely());
  const currentCash = PaymentSelector.getCurrentAmount(getState().payment);
  const grandTotalAmount = OrderSelector.getOrderGrandTotalAmount(getState().order);
  const cashChangeAmount = currentCash - grandTotalAmount;
  const isOrderHasProduct = OrderSelector.verifyOrderHasProduct(getState().order);
  console.log('productDropProcessCompletely: currentCash', currentCash, 'grandTotalAmount', grandTotalAmount, 'cashChangeAmount', cashChangeAmount, 'isOrderHasProduct', isOrderHasProduct);
  try {
    if (isOrderHasProduct) {
      const submitOrderResponse = await dispatch(submitOrder());
      console.log('productDropProcessCompletely.submitOrderResponse', submitOrderResponse);
    }
    if (cashChangeAmount > 0) {
      dispatch(cashChange());
    } else {
      setTimeout(() => {
        dispatch(backToHome());
      }, 1000);
    }
  } catch (error) {
    console.error(error);
  }
};

export const confirmMobileTopupMSISDN = MSISDN => dispatch => {
  dispatch(changePage('/topup/selectTopupValue'));
  dispatch(Actions.confirmMobileTopupMSISDN(MSISDN));
};

export const clearPaymentAmount = () => dispatch => {
  setTimeout(() => {
    dispatch(Actions.clearPaymentAmount());
  }, 1000);
};

export const sendCashChangeToServer = () => (dispatch, getState) => {
  const cashChangeAmount = PaymentSelector.getCashChangeAmount(getState().payment);
    // ======================================================
    // if cashReturn > 0 then call api to return cash
    // ======================================================
  if (cashChangeAmount > 0) {
    console.log('=======================================');
    console.log('sendCashChangeToServer:ระบบสั่งทอนเงินจำนวน =', cashChangeAmount);
    console.log('=======================================');
    const client = MasterappSelector.getTcpClient(getState().masterapp);
    client.send({
      action: 2,
      msg: `${cashChangeAmount}`,
      mode: 'coin',
    });
  }
  dispatch(clearPaymentAmount());
};

// export const cashChangeEqualToGrandTotalAmount = () => {
//   return (dispatch, getState) => {
//     const grandTotalAmount = RootSelector.getCashChangeFromOrderAmount(getState());
//     dispatch(Actions.setCashChangeAmount(grandTotalAmount));
//     // ======================================================
//     // Disable Moneybox before sendCashChange
//     // ======================================================
//     dispatch(disableMoneyBox());
//   };
// };

export const cashChangeEqualToCurrentCashAmountMinusDroppedProduct = () => (dispatch, getState) => {
  const cashChangePromotionError = RootSelector.getCashChangePromotionSetError(getState());
  dispatch(Actions.setCashChangeAmount(cashChangePromotionError));
    // ======================================================
    // Disable Moneybox before sendCashChange
    // ======================================================
  dispatch(disableMoneyBox());
};

export const cashChangeEqualToCurrentCashAmount = () => (dispatch, getState) => {
  const currentAmount = PaymentSelector.getCurrentAmount(getState().payment);
  dispatch(Actions.setCashChangeAmount(currentAmount));
    // ======================================================
    // Disable Moneybox before sendCashChange
    // ======================================================
  dispatch(disableMoneyBox());
};

export const cashChange = () => (dispatch, getState) => {
  const currentCash = RootSelector.getCashChangeAmount(getState());
  dispatch(Actions.setCashChangeAmount(currentCash));
    // ======================================================
    // Disable Moneybox before sendCashChange
    // ======================================================
  dispatch(disableMoneyBox());
};

export const returnAllInsertCash = () => (dispatch, getState) => {
  const currentCash = RootSelector.getCashChangeFromCurrentCash(getState());
  dispatch(Actions.setCashChangeAmount(currentCash));
    // ======================================================
    // Disable Moneybox before sendCashChange
    // ======================================================
  dispatch(disableMoneyBox());
};

export const getCashRemaining = () => (dispatch, getState) => {
  const client = MasterappSelector.getTcpClient(getState().masterapp);
  client.send({
    action: 2,
    mode: 'remain',
  });
};

// ======================================================
// Dev
// ======================================================
export const insertCoin = value => (dispatch, getState) => {
  const client = MasterappSelector.getTcpClient(getState().masterapp);
  client.setFree();
  client.send({
    action: 999,
    msg: value,
  });
};
export const scanCode = value => (dispatch, getState) => {
  const client = MasterappSelector.getTcpClient(getState().masterapp);
  client.setFree();
  client.send({
    action: 998,
    msg: value,
  });
};

export const confirmWarningSystemWillNotChangeCash = () => dispatch => {
  dispatch(hideAllModal());
};

export const cancelPayment = () => dispatch => {
  dispatch(backToHome());
    // dispatch(cashChangeEqualToGrandTotalAmount()); // ปล่อยให้มันกินตังค์ไปก่อน
  dispatch(hideAllModal());
};

export const hideAllModal = () => dispatch => {
  dispatch(Actions.hideAllModal());
};

export const setReadyToDropProduct = () => dispatch => {
  dispatch(Actions.readyToDropProduct());
};

export const setNotReadyToDropProduct = () => dispatch => {
  dispatch(Actions.notReadyToDropProduct());
};

export const selectMobileTopupValue = item => dispatch => {
  dispatch(Actions.selectMobileTopupValue(item));
};

export const submitMobileTopupValue = mobileTopupValue => dispatch => {
  dispatch(Actions.submitMobileTopupValue(mobileTopupValue));
  dispatch(changePage('/topup/confirm'));
};

export const clearMobileTopupValue = () => dispatch => {
  dispatch(Actions.clearMobileTopupValue());
};

export const resetTAIKO = () => (dispatch, getState) => {
  const client = MasterappSelector.getTcpClient(getState().masterapp);
  client.send({
    action: 2,
    msg: '01',
    mode: 'bill',
  });
};

export const enableMoneyBox = () => (dispatch, getState) => {
  dispatch(Actions.hardwareStartProcess('enableMoneyBox'));
  const client = MasterappSelector.getTcpClient(getState().masterapp);
  client.send({
    action: 2,
    msg: '020',
    mode: 'both',
  });
};

export const disableMoneyBox = () => (dispatch, getState) => {
  const client = MasterappSelector.getTcpClient(getState().masterapp);
  client.send({
    action: 2,
    msg: '021',
    mode: 'both',
  });
};

export const clearMobileTopupMSISDN = () => dispatch => {
  dispatch(Actions.clearMobileTopupMSISDN());
};

export const selectEvent = (context, item) => {
  return (dispatch, getState) => {
    dispatch(changePage(context));
    dispatch(Actions.selectEvent(item));
  };
};

export const verifyDiscountCode = (code) => {
  console.log('verifyDiscountCode', code);
  return async (dispatch, getState) => {
    // ======================================================
    // Check code is already exist
    // ======================================================
    const discounts = OrderSelector.getDiscounts(getState().order);
    const isOrderHasOneDiscount = _.size(discounts) === 1;
    const isDuplicatedDiscount = verifyDuplicatedDiscount(discounts, code);
    if (isOrderHasOneDiscount) {
      dispatch(hideLoading());
      dispatch(openAlertMessage(convertApplicationErrorToError({
        title: `ไม่สามารถใช้รหัสส่วนลด ${code} ได้`,
        th: 'เนื่องจากระบบไม่อนุญาตให้ใช้ส่วนลดมากกว่า 1 อัน',
        en: '',
      })));
    } else if (isDuplicatedDiscount) {
      dispatch(hideLoading());
      dispatch(openAlertMessage(convertApplicationErrorToError({
        title: `ไม่สามารถใช้รหัสส่วนลด ${code} ได้`,
        th: 'เนื่องจากรหัสส่วนลดถูกใช้ไปแล้ว',
        en: '',
      })));
    } else {
      try {
        const discountType = OrderSelector.getOrderDiscountType(getState().order);
        const poId = OrderSelector.getOrderPoId(getState().order);
        dispatch(showLoading('ระบบกำลังตรวจสอบรหัสส่วนลด'));
        const verifyDiscountCodeResponse = await serviceVerifyDiscountCode(code, poId, discountType);
        dispatch(hideLoading());
        console.log('verifyDiscountCodeResponse', verifyDiscountCodeResponse);
        const discountItem = {
          ...extractDiscountFromResponseData(verifyDiscountCodeResponse),
          discountType,
        };
        dispatch(Actions.addDiscount(discountItem));
      } catch (error) {
        dispatch(handleApiError(error));
      }
    }
  };
};

export const resetFooterAds = () => {
  return (dispatch) => {
    dispatch(Actions.resetFooterAds());
  };
};

export const clearInstantlyDiscount = () => {
  return (dispatch) => {
    dispatch(Actions.clearInstantlyDiscount());
  };
}

export const initMobileTopupProviderSelectionPage = () => {
  return (dispatch) => {
    dispatch(clearMobileTopupMSISDN());
    dispatch(resetFooterAds());
  };
};

export const initHomePage = () => {
  return (dispatch, getState) => {
    // dispatch(clearInstantlyDiscount()); // right now order is cleared.
    dispatch(resetFooterAds());
    dispatch(clearOrder());
    // const moneyBoxActive = MasterappSelector.verifyIsMoneyBoxActive(getState().masterapp);
    // if (moneyBoxActive) {
    //   dispatch(disableMoneyBox());
    // }
  };
};

export const processingReturningCash = () => {
  return (dispatch, getState) => {
    const moneyBoxActive = MasterappSelector.verifyIsMoneyBoxActive(getState().masterapp);
    if (moneyBoxActive) {
      dispatch(showLoading('ระบบกำลังทอนเงิน รอสักครู่'));
      setTimeout(() => {
        if (MasterappSelector.verifyIsLoading(getState().masterapp)) {
          dispatch(hideLoading());
        }
      }, 5000);
    }
  }
}

export const enableMoneyBoxWhenInitPage = () => {
  return (dispatch, getState) => {
    const moneyBoxActive = MasterappSelector.verifyIsMoneyBoxActive(getState().masterapp);
    // if mount with moneyBoxActive not active enable money box
    if (!moneyBoxActive) {
      dispatch(enableMoneyBox());
    } else {
      dispatch(showLoading('ระบบกำลังดำเนินการ'));
      setTimeout(() => {
        if (MasterappSelector.verifyIsLoading(getState().masterapp)) {
          dispatch(hideLoading());
        }
      }, 5000);
    }
  };
};

export const willReceivePropsEnableMoneyBoxWhenInitPage = (props, nextProps) => {
  return (dispatch, getState) => {
    console.log('willReceivePropsEnableMoneyBoxWhenInitPage', props.moneyBoxActive, !nextProps.moneyBoxActive);
    if (props.moneyBoxActive && !nextProps.moneyBoxActive) {
      dispatch(hideLoading());
      dispatch(enableMoneyBoxWhenInitPage());
    }
  };
};

export const warningSystemWillNotChangeCash = () => {
  return (dispatch, getState) => {
    const canChangeCash = MasterappSelector.verifyCanChangeCash(getState().masterapp);
    if (!canChangeCash) {
      dispatch(Actions.showModal('warningSystemWillNotChangeCash'));
    }
  };
};

export const initSingleProductPage = () => {
  return (dispatch, getState) => {
    dispatch(processingReturningCash());
    // dispatch(enableMoneyBoxWhenInitPage());
    dispatch(warningSystemWillNotChangeCash());
  };
};

export const initPromotionSetPage = () => {
  return (dispatch, getState) => {
    dispatch(processingReturningCash());
    // dispatch(enableMoneyBoxWhenInitPage());
    dispatch(warningSystemWillNotChangeCash());
  };
};

export const initMobileTopupPage = () => {
  return (dispatch, getState) => {
    dispatch(processingReturningCash());
    // dispatch(enableMoneyBoxWhenInitPage());
    dispatch(warningSystemWillNotChangeCash());
  };
};

export const initPaymentPage = () => {
  return (dispatch, getState) => {
    dispatch(runFlowCashInserted());
    const moneyBoxActive = MasterappSelector.verifyIsMoneyBoxActive(getState().masterapp);
    // if mount with moneyBoxActive not active enable money box
    if (!moneyBoxActive) {
      dispatch(enableMoneyBox());
    }
  };
};

// ======================================================
// EVENTS
// ======================================================
export const submitPlayEvent = () => {
  return (dispatch, getState) => {
    const eventWatches = OrderSelector.getEventWatches(getState().order);
    console.log('submitPlayEvent', eventWatches);
    if (_.size(eventWatches) > 0) {
      dispatch(changePage('/event/ads'));
    } else {
      dispatch(eventInitGetReward());
    }
  };
};

export const eventInitGetReward = () => {
  return (dispatch, getState) => {
    const selectedEvent = OrderSelector.getSelectedEvent(getState().order);
    const shouldSendReward = OrderSelector.verifyEventShouldSendReward(getState().order);
    const reward = OrderSelector.getEventNextReward(getState().order);
    console.log('eventInitGetReward', selectedEvent, shouldSendReward, reward);
    if (shouldSendReward) {
      dispatch(eventGetReward());
    } else if (reward) {
      if (reward.channel === 'VENDING_MACHINE_NOW') {
        // add discount
        const discountItem = {
          code: reward.code,
          value: reward.value,
          instantly: true,
        };
        dispatch(Actions.addDiscount(discountItem));
        // dispatch(Actions.setFlagUseDiscountInstantly(true));
        if (reward.name === 'topup') {
          dispatch(changePage('/topup'));
        } else if (reward.name === 'product') {
          dispatch(selectProduct('/product/single', selectedEvent.product, 'singleProduct'));
        }
      } else if (reward.channel === 'VENDING_MACHINE_CODE') {
        const message = {
          title: 'ขอบคุณที่ร่วมกิจกรรม',
          th: `รหัสส่วนลด คือ ${reward.code} มูลค่า ${reward.value} บาท (ใช้ได้ก่อนวันที่ ${reward.expireDate})`,
          en: '',
        };
        dispatch(openAlertMessage(convertApplicationErrorToError(message)));
      }
    } else {
      console.log('NO_REWARD');
    }
  };
};

export const updateEventInput = (inputName, inputValue) => {
  return (dispatch) => {
    dispatch(Actions.updateEventInput(inputName, inputValue));
  };
};

export const updateEventReward = (reward, discount) => {
  return (dispatch) => {
    dispatch(Actions.updateEventReward(reward, discount));
  };
};

export const eventGetReward = () => {
  return async (dispatch, getState) => {
    const eventId = OrderSelector.getEventId(getState().order);
    const eventRewards = OrderSelector.getEventRewards(getState().order);
    const eventInputs = OrderSelector.getEventInputs(getState().order);
    try {
      _.forEach(eventRewards, async (reward) => {
        // ======================================================
        // Check should get reward
        // ======================================================
        if (_.includes(['SMS', 'EMAIL'], reward.channel.toUpperCase())) {
          console.log('eventGetReward', reward);
          const channel = reward.channel;
          const eventInput = getEventInputByChannel(eventInputs, channel);
          const rewardToServiceItem = {
            eventId,
            discountType: reward.name,
            amount: reward.value,
            channel: reward.channel,
            value: eventInput.value
          };
          try {
            dispatch(showLoading('กำลังส่งรหัสส่วนลด'));
            const eventProduct = OrderSelector.getEventProduct(getState().order);
            const serviceGetEventRewardResponse = await serviceGetEventReward(rewardToServiceItem, eventProduct.id);
            dispatch(hideLoading());
            console.log('serviceGetEventRewardResponse', serviceGetEventRewardResponse);
            dispatch({
              type: 'EVENT_SENT_REWARD',
              rewardToServiceItem
            });
            let message;
            if (channel === 'SMS') {
              message = {
                title: 'ขอบคุณที่ร่วมกิจกรรม',
                th: `ตรวจสอบรหัสส่วนลดได้ที่ หมายเลข ${eventInput.value}`,
                en: '',
              };
            } else if (channel === 'EMAIL') {
              message = {
                title: 'ขอบคุณที่ร่วมกิจกรรม',
                th: `ตรวจสอบรหัสส่วนลดได้ที่ อีเมล ${eventInput.value}`,
                en: '',
              };
            }
            dispatch(openAlertMessage(convertApplicationErrorToError(message)));
            dispatch(backToHome());
          } catch (error) {
            dispatch(handleApiError(error));
            dispatch(backToHome());
          }
        }
      });
    } catch (error) {
      dispatch(openAlertMessage(error));
    }
  };
};

export const eventUseDiscountRewardInstantly = () => {
  return (dispatch, getState) => {
    const eventRewardInstantly = OrderSelector.getEventRewardInstantly(getState().order);
    // ======================================================
    // ADD DISCOUNT
    // ======================================================
    const discountItem = {
      code: eventRewardInstantly.code,
      value: eventRewardInstantly.value
    };
    dispatch(Actions.addDiscount(discountItem));
    dispatch(changePage('/product/single'));
  };
};

export const eventUseMobileTopupRewardInstantly = () => {
  return (dispatch, getState) => {
    const eventRewardInstantly = OrderSelector.getEventRewardInstantly(getState().order);
    // ======================================================
    // ADD DISCOUNT
    // ======================================================
    const discountItem = {
      code: eventRewardInstantly.code,
      value: eventRewardInstantly.value
    };
    dispatch(Actions.addDiscount(discountItem));
    dispatch(changePage('/topup'));
  };
};

export const eventUseProductRewardInstantly = () => {
  return (dispatch, getState) => {
    // 1) SELECT PRODUCT
    const rewardProduct = OrderSelector.getEventProduct(getState().order);
    dispatch(Actions.selectProduct(rewardProduct));
    // 2) DROP PRODUCT
    dispatch(productDrop());
  };
};

export const eventUseRewardInstantly = () => {
  return async (dispatch, getState) => {
    const eventRewardInstantly = OrderSelector.getEventRewardInstantly(getState().order);
    if (eventRewardInstantly) {
      // ======================================================
      // Check reward type
      // ======================================================
      const rewardType = eventRewardInstantly.name;
      switch (rewardType) {
        case 'DISCOUNT':
          dispatch(eventUseDiscountRewardInstantly());
          break;
        case 'MOBILE_TOPUP':
          dispatch(eventUseMobileTopupRewardInstantly());
          break;
        case 'PRODUCT':
          dispatch(eventUseProductRewardInstantly());
          break;
        default:
          break;
      }
    }
  };
};

export const activateMoneyBox = () => {
  return (dispatch) => {
    dispatch(Actions.activateMoneyBox());
  };
};

export const deactivateMoneyBox = () => {
  return (dispatch) => {
    dispatch(Actions.deactivateMoneyBox());
  };
};

export const showLoading = (message) => {
  return (dispatch) => {
    dispatch(Actions.showLoading(message));
  };
};

export const hideLoading = () => {
  return (dispatch) => {
    dispatch(Actions.hideLoading());
  };
};

export const switchLanguageTo = (lang) => {
  return (dispatch) => {
    dispatch(Actions.switchLanguageTo(lang));
  };
};

export const endedAudio = () => {
  return (dispatch) => {
    dispatch(Actions.endedAudio());
  };
};

export const startedAudio = () => {
  return (dispatch) => {
    dispatch(Actions.startedAudio());
  };
};

export const startPlayAudio = () => {
  return (dispatch) => {
    dispatch(Actions.startPlayAudio());
  };
};

export const stopPlayAudio = () => {
  return (dispatch) => {
    dispatch(Actions.stopPlayAudio());
  };
};

export const playInputMSISDNErrorAudio = () => {
  return (dispatch, getState) => {
    const fileURL = MasterappSelector.getLocalURL(getState().masterapp);
    dispatch(Actions.setAudioSource(`${fileURL}/voice/8.2.m4a`));
    dispatch(Actions.startPlayAudio());
  };
};

export const openDoor = () => (dispatch, getState) => {
  const client = MasterappSelector.getTcpClient(getState().masterapp);
  client.setFree();
  client.send({
    action: 'door-open',
  });
};

export const closeDoor = () => (dispatch, getState) => {
  const client = MasterappSelector.getTcpClient(getState().masterapp);
  client.setFree();
  client.send({
    action: 'door-close',
  });
};
