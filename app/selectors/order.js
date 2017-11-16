import { createSelector } from 'reselect';
import _ from 'lodash';

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
    console.log('getEventNextReward', nextItem);
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
  [getMobileTopupServiceCode, getTopupMSISDN, getSelectedMobileTopupPrice],
  (serviceCode, MSISDN, mobileTopupValue) => ({
    serviceCode,
    MSISDN,
    mobileTopupValue,
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
    const targetPhysical = _.find(productToDrop.physicals || [], physical => physical.canDrop === true);
    console.log('getDropProductTargetRowColumn', targetPhysical);
    return targetPhysical;
  }
);

const getDropProductTargetRowColumn = createSelector(
  [getDropProductTargetPhysical],
  targetPhysical => {
    console.log('=== PHYSICAL SLOT ====', `${targetPhysical.row}${targetPhysical.col}`);
    return `${targetPhysical.row}${targetPhysical.col}`;
  }
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
  // ======================================================
  // Payment
  // ======================================================
  getOrderGrandTotalAmount,
  // ======================================================
  // Discount
  // ======================================================
  getDiscounts,
  getDiscount,
  getDiscountAmount,
  verifyOrderHasDiscount
};
