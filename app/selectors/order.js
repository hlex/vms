import { createSelector } from 'reselect';
import _ from 'lodash';
// ======================================================
// Helpers
// ======================================================
import { appLog, getPhysicalUsedSlotNo } from '../helpers/global';

const getProducts = state => state.products;
const getPromotionSets = state => state.promotionSets;
const getMobileTopup = state => state.mobileTopup;
const getDiscounts = state => state.discounts;
const getEvent = state => state.event;

const getSelectedEvent = createSelector(
  [getEvent],
  (event) => {
    return event.selectedEvent;
  }
);

const getEventId = createSelector(
  [getSelectedEvent],
  (event) => {
    return event.eventId;
  }
);

const getEventProduct = createSelector(
  [getSelectedEvent],
  (event) => {
    return event.product || {}
  }
);

const getEventRewards = createSelector(
  [getSelectedEvent],
  (event) => {
    return event.rewards || [];
  }
);

const getEventNextReward = createSelector(
  [getEventRewards],
  (eventRewards) => {
    if (_.size(eventRewards) <= 0) return '';
    const nextItem = _.find(eventRewards, item => item.completed === false);
    // console.log('getEventNextReward', nextItem);
    return nextItem;
  }
);

const getEventRewardInstantly = createSelector(
  [getEventRewards],
  (eventRewards) => {
    return _.find(eventRewards, eventReward => _.includes(['VENDING_MACHINE_NOW'], eventReward.channel.toUpperCase()));
  }
);

const getEventNextRewardRoute = createSelector(
  [getEventNextReward],
  (eventNextReward) => {
    if (!eventNextReward) return 'REWARD_NOT_FOUND';
    const targetProduct = eventNextReward.name;
    switch (targetProduct) {
      case 'topup':
        return '/topup';
      case 'product':
        return '/product/single';
      default:
        return 'PAGE_NOT_FOUND';
    }
  }
);

const getEventInputs = createSelector(
  [getSelectedEvent],
  (selectedEvent) => {
    return selectedEvent.inputs || [];
  }
);

const getEventBarcodeOrQrcodeInput = createSelector(
  [getEventInputs],
  (eventInputs) => {
    if (_.size(eventInputs) <= 0) return '';
    const barcodeOrQrcodeInput = _.find(eventInputs, item => item.completed === true && _.includes(['BARCODE', 'QR_CODE'], item.name));
    return barcodeOrQrcodeInput ? barcodeOrQrcodeInput.value : '';
  }
);

const getEventNextInput = createSelector(
  [getEventInputs],
  (eventInputs) => {
    if (_.size(eventInputs) <= 0) return '';
    const nextItem = _.find(eventInputs, item => item.completed === false);
    return nextItem ? nextItem.name.toUpperCase() : '';
  }
);

const getEventNextInputObject = createSelector(
  [getEventInputs],
  (eventInputs) => {
    if (_.size(eventInputs) <= 0) return '';
    const nextItem = _.find(eventInputs, item => item.completed === false);
    return nextItem;
  }
);

const getEventNextInputOrder = createSelector(
  [getEventInputs],
  (eventInputs) => {
    if (_.size(eventInputs) <= 0) return '';
    const nextItemIndex = _.findIndex(eventInputs, item => item.completed === false);
    // console.log('getEventNextInputOrder', eventInputs, nextItemIndex);
    return nextItemIndex !== undefined ? `${nextItemIndex + 1}.` : '0.';
  }
);

const getEventWatches = createSelector(
  [getSelectedEvent],
  (selectedEvent) => {
    return selectedEvent.watches || [];
  }
);

const getEventNextWatch = createSelector(
  [getEventWatches],
  (eventWatches) => {
    if (_.size(eventWatches) <= 0) return '';
    const nextItem = _.find(eventWatches, item => item.completed === false);
    return nextItem;
  }
);

const verifyEventShouldSendReward = createSelector(
  [getEventRewards],
  (eventRewards) => {
    const foundChannel = _.some(eventRewards, reward => _.includes(['SMS', 'EMAIL'], reward.channel.toUpperCase()));
    return foundChannel;
  }
);

const verifyEventShouldUseRewardInstantly = createSelector(
  [getEventRewards],
  (eventRewards) => {
    const foundChannel = _.some(eventRewards, reward => _.includes(['VENDING_MACHINE'], reward.channel.toUpperCase()));
    return foundChannel;
  }
);


const getDiscount = createSelector(
  [getDiscounts],
  (discounts) => {
    return _.head(discounts);
  }
);

const getDiscountAmount = createSelector(
  [getDiscounts],
  (discounts) => {
    return Number(_.sumBy(discounts, discount => Number(discount.value)));
  }
);

const verifyOrderHasDiscount = createSelector(
  [getDiscounts],
  (discounts) => {
    return _.size(discounts) > 0;
  }
);

const getTopupMSISDN = createSelector([getMobileTopup], mobileTopup => mobileTopup.MSISDN || '');

const getSelectedMobileTopupProvider = createSelector(
  [getMobileTopup],
  mobileTopup => mobileTopup.selectedMobileTopupProvider || {},
);

const getSelectedMobileTopupValue = createSelector(
  [getMobileTopup],
  mobileTopup => mobileTopup.selectedMobileTopupValue || {},
);

const getSelectedMobileTopupPrice = createSelector(
  [getSelectedMobileTopupValue],
  selectedMobileTopupValue => Number(selectedMobileTopupValue.value),
);

const getSelectedMobileTopupFee = createSelector(
  [getSelectedMobileTopupValue],
  selectedMobileTopupValue => Number(selectedMobileTopupValue.fee),
);

const getSelectedMobileTopupTotalPrice = createSelector(
  [getSelectedMobileTopupValue, getSelectedMobileTopupPrice],
  (selectedMobileTopupValue, selectedMobileTopupPrice) =>
    selectedMobileTopupPrice + Number(selectedMobileTopupValue.fee),
);

const getMobileTopupName = createSelector(
  [getSelectedMobileTopupProvider],
  selectedMobileTopupProvider => selectedMobileTopupProvider.name || '',
);

const getMobileTopupBanner = createSelector(
  [getSelectedMobileTopupProvider],
  selectedMobileTopupProvider => selectedMobileTopupProvider.banner || '',
);

const getMobileTopupServiceCode = createSelector(
  [getSelectedMobileTopupProvider],
  selectedMobileTopupProvider => selectedMobileTopupProvider.serviceCode || '',
);

const getMobileTopupToService = createSelector(
  [getMobileTopupServiceCode, getTopupMSISDN, getSelectedMobileTopupPrice, getSelectedMobileTopupFee],
  (serviceCode, MSISDN, mobileTopupValue, mobileTopupFee) => ({
    serviceCode,
    MSISDN,
    mobileTopupValue,
    mobileTopupFee
  }),
);

const getSingleProduct = createSelector([getProducts], products => _.head(products));

const getPromotionSet = createSelector([getPromotionSets], promotionSets => _.head(promotionSets));

const getPromotionSetProducts = createSelector([getPromotionSet], promotionSet =>
  _.get(promotionSet, 'products', []),
);

const getSingleProductPrice = createSelector([getSingleProduct], singleProduct =>
  Number(_.get(singleProduct, 'price', '')),
);

const getSingleProductBgImage = createSelector([getSingleProduct], singleProduct => {
  const bgImage = _.get(singleProduct, 'imageBig', '');
  return bgImage !== '' ? bgImage : undefined;
});

const getPromotionSetPrice = createSelector([getPromotionSet], promotionSet =>
  Number(_.get(promotionSet, 'price', '')),
);

const getPromotionSetFirstProductPrice = createSelector([getPromotionSetProducts], products =>
  Number(_.head(products).price),
);

const getPromotionSetFirstProductBgImage = createSelector([getSingleProduct], (singleProduct) => {
  const bgImage = _.get(singleProduct, 'imageBig', '');
  return bgImage !== '' ? bgImage : undefined;
});

const getDroppedProducts = createSelector([getProducts], products =>
  _.filter(products, product => product.isDropped),
);

const getDroppedProductSummaryPrice = createSelector([getDroppedProducts], products =>
  _.sumBy(products, product => Number(product.price)),
);

const getProductToDrop = createSelector([getProducts], products =>
  _.find(products, product => !product.isDropped),
);

const getDropProductTargetPhysical = createSelector(
  [getProductToDrop],
  productToDrop => {
    const targetPhysical = _.find(productToDrop.physicals || [], physical => physical.isFree === false && physical.canDrop === true);
    appLog('DropProduct', '@getDropProductTargetPhysical productToDrop', productToDrop, '#FFEB3B');
    appLog('DropProduct', '@getDropProductTargetPhysical targetPhysical', targetPhysical, '#FFEB3B');
    return targetPhysical;
  }
);

const getDropProductTargetRowColumn = createSelector(
  [getDropProductTargetPhysical],
  targetPhysical => {
    appLog('DropProduct', '@getDropProductTargetRowColumn targetPhysical', targetPhysical, '#FFEB3B');
    if (!targetPhysical) return undefined;
    appLog('DropProduct', '@getDropProductTargetRowColumn PHYSICAL SLOT', `${targetPhysical.row}${targetPhysical.col}`, '#FFEB3B');
    return `${targetPhysical.row}${targetPhysical.col}`;
  }
);

const getFreeProduct = createSelector(
  [getProducts],
  products => {
    const freeProduct = _.find(products, product => product.price === 0);
    if (!freeProduct) return undefined;
    return freeProduct;
  }
);

const getFreeDropProductTargetPhysical = createSelector(
  [getProductToDrop],
  productToDrop => {
    const targetPhysical = _.find(productToDrop.physicals || [], physical => physical.isFree === true && physical.canDrop === true);
    appLog('DropFreeProduct', '@getFreeDropProductTargetPhysical productToDrop', productToDrop, '#FFEB3B');
    appLog('DropFreeProduct', '@getFreeDropProductTargetPhysical targetPhysical', targetPhysical, '#FFEB3B');
    return targetPhysical;
  }
);

const getFreeDropProductTargetRowColumn = createSelector(
  [getFreeDropProductTargetPhysical],
  targetPhysical => {
    appLog('DropFreeProduct', '@getFreeDropProductTargetRowColumn targetPhysical', targetPhysical, '#FFEB3B');
    if (!targetPhysical) return undefined;
    appLog('DropFreeProduct', '@getFreeDropProductTargetRowColumn PHYSICAL SLOT', `${targetPhysical.row}${targetPhysical.col}`, '#FFEB3B');
    return `${targetPhysical.row}${targetPhysical.col}`;
  }
);

const verifyProductToFreeDropHasAvailablePhysical = createSelector(
  [getFreeDropProductTargetPhysical],
  (targetPhysical) => targetPhysical !== undefined
);

const verifyProductToDropHasAvailablePhysical = createSelector(
  [getDropProductTargetPhysical],
  (targetPhysical) => {
    return targetPhysical !== undefined;
  }
);

const verifyOrderHasProduct = createSelector([getProducts], products => _.size(products) > 0);

const verifyHasDroppedProduct = createSelector([getProducts], products =>
  _.some(products, product => product.isDropped),
);

const verifyAllOrderDropped = createSelector([getProducts], products =>
  _.every(products, product => product.isDropped),
);

const verifyOrderHasPromotionSet = createSelector(
  [getPromotionSets],
  promotionSets => _.size(promotionSets) > 0,
);

const verifyMobileTopupOrder = createSelector(
  [getSelectedMobileTopupProvider],
  selectedMobileTopup => !_.isEmpty(selectedMobileTopup),
);

const verifyIsEventOrder = createSelector(
  [getSelectedEvent],
  selectedEvent => !_.isEmpty(selectedEvent),
);

const getOrderGrandTotalAmount = createSelector(
  [
    verifyOrderHasPromotionSet,
    verifyMobileTopupOrder,
    getSelectedMobileTopupTotalPrice,
    getSingleProductPrice,
    getPromotionSetPrice,
    getDiscountAmount,
  ],
  (
    hasPromotionSet,
    hasMobileTopup,
    selectedMobileTopupTotalPrice,
    singleProductPrice,
    promotionSetPrice,
    discountAmount,
  ) => {
    if (hasMobileTopup) return selectedMobileTopupTotalPrice - discountAmount;
    return hasPromotionSet ? promotionSetPrice - discountAmount : singleProductPrice - discountAmount;
  },
);

const getOrderType = createSelector(
  [
    verifyOrderHasPromotionSet,
    verifyMobileTopupOrder,
  ],
  (
    hasPromotionSet,
    hasMobileTopup,
  ) => {
    if (hasPromotionSet) return 'promotionSet';
    if (hasMobileTopup) return 'mobileTopup';
    return 'singleProduct';
  }
);

const getPaymentBgImage = createSelector(
  [
    getOrderType,
    getSingleProductBgImage,
    getPromotionSetFirstProductBgImage,
    getMobileTopupBanner
  ],
  (
    orderType,
    singleProductBgImage,
    promotionSetBgImage,
    mobileTopupBgImage
  ) => {
    if (orderType === 'promotionSet') return promotionSetBgImage;
    if (orderType === 'mobileTopup') return mobileTopupBgImage;
    return singleProductBgImage;
  }
);

const getOrderPoId = createSelector(
  [getOrderType, getPromotionSet, getSingleProduct, getMobileTopup],
  (orderType, promotionSet, singleProduct, mobileTopup) => {
    switch (orderType) {
      case 'promotionSet':
        return promotionSet.id || '';
      case 'singleProduct':
        return singleProduct.id || '';
      case 'mobileTopup':
        return mobileTopup.id || '';
      default:
    }
  }
);

const getOrderDiscountType = createSelector(
  [getOrderType],
  (orderType) => {
    return orderType === 'mobileTopup' ? 'topup' : 'product';
  }
);

const toSubmitOrder = createSelector(
  [
    getOrderType,
    verifyIsEventOrder,
    getSingleProduct,
    getPromotionSet,
    verifyOrderHasDiscount,
    getDiscount,
    getProducts,
    getSelectedEvent,
    getEventInputs
  ],
  (
    orderType,
    isEventOrder,
    singleProduct,
    promotionSet,
    hasDiscount,
    discount,
    products,
    selectedEvent,
    eventInputs
  ) => {
    let id;
    const poId = _.join(_.map(products, product => product.id), ',');
    let saleType;
    const qty = 1;
    const unitPrice = _.join(_.map(products, product => product.price), ',');
    const slotNo = _.join(_.map(products, product => getPhysicalUsedSlotNo(product)), ',');
    let barcode;
    let lineQrcode;
    let discountCode = '';
    let discountPrice = 0;
    switch (orderType) {
      case 'singleProduct':
        saleType = 'Normal';
        break;
      case 'promotionSet':
        id = promotionSet.id;
        const hasOnlyOneProduct = _.size(products) === 1;
        saleType = hasOnlyOneProduct ? 'Normal' : 'Promotion';
        discountCode = '';
        discountPrice = promotionSet.discountPrice;
        break;
      default:
        break;
    }
    if (isEventOrder) {
      id = selectedEvent.eventId;
      saleType = 'Activities';
      barcode = _.find(eventInputs, input => input.name === 'BARCODE' || input.name === 'QR_CODE').value || '';
      lineQrcode = _.find(eventInputs, input => input.name === 'LINE_QR_CODE').value || '';
    }
    if (hasDiscount) {
      discountCode = discount.code;
      discountPrice = discount.value;
    }
    return {
      id,
      poId,
      saleType,
      discountCode,
      discountPrice,
      qty,
      unitPrice,
      slotNo,
      barcode,
      lineQrcode
    };
  }
);

const verifyOrderHasFreeProduct = createSelector(
  [
    getProducts
  ],
  (
    products
  ) => {
    const freeProduct = _.find(products, product => product.price === 0);
    if (freeProduct) return true;
    return false;
  }
);

export default {
  // ======================================================
  // Event
  // ======================================================
  getEvent,
  getSelectedEvent,
  getEventId,
  getEventProduct,
  getEventRewards,
  getEventRewardInstantly,
  getEventNextReward,
  getEventNextRewardRoute,
  getEventInputs,
  getEventNextInput,
  getEventNextInputObject,
  getEventNextInputOrder,
  getEventBarcodeOrQrcodeInput,
  getEventWatches,
  getEventNextWatch,
  verifyEventShouldSendReward,
  verifyEventShouldUseRewardInstantly,
  // ======================================================
  // Mobile Topup
  // ======================================================
  getMobileTopup,
  getTopupMSISDN,
  getSelectedMobileTopupProvider,
  getSelectedMobileTopupValue,
  getSelectedMobileTopupTotalPrice,
  getMobileTopupName,
  getMobileTopupBanner,
  getMobileTopupServiceCode,
  getMobileTopupToService,
  // ======================================================
  // Single Product
  // ======================================================
  getProducts,
  getSingleProduct,
  getSingleProductPrice,
  getSingleProductBgImage,
  // ======================================================
  // PromotionSet
  // ======================================================
  getPromotionSet,
  getPromotionSetProducts,
  getPromotionSetPrice,
  getPromotionSetFirstProductPrice,
  getProductToDrop,
  getDropProductTargetPhysical,
  verifyProductToDropHasAvailablePhysical,
  getDropProductTargetRowColumn,
  getFreeProduct,
  getFreeDropProductTargetRowColumn,
  getFreeDropProductTargetPhysical,
  verifyProductToFreeDropHasAvailablePhysical,
  getDroppedProductSummaryPrice,
  getPromotionSetFirstProductBgImage,
  // ======================================================
  // Flag
  // ======================================================
  verifyOrderHasProduct,
  verifyHasDroppedProduct,
  verifyAllOrderDropped,
  verifyOrderHasPromotionSet,
  verifyMobileTopupOrder,
  verifyIsEventOrder,
  verifyOrderHasFreeProduct,
  // ======================================================
  // Payment
  // ======================================================
  getOrderGrandTotalAmount,
  getPaymentBgImage,
  // ======================================================
  // Discount
  // ======================================================
  getDiscounts,
  getDiscount,
  getDiscountAmount,
  verifyOrderHasDiscount,
  // ======================================================
  // Order
  // ======================================================
  getOrderType,
  getOrderDiscountType,
  getOrderPoId,
  toSubmitOrder
};
