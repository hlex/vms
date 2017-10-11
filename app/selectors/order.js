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

const getEventRewards = createSelector(
  [getSelectedEvent],
  (event) => {
    return event.rewards || [];
  }
);

const getEventInputs = createSelector(
  [getSelectedEvent],
  (selectedEvent) => {
    return selectedEvent.inputs || [];
  }
);

const getEventNextInput = createSelector(
  [getEventInputs],
  (eventInputs) => {
    if (_.size(eventInputs) <= 0) return '';
    const nextInput = _.find(eventInputs, input => input.completed === false);
    return nextInput ? nextInput.name.toUpperCase() : '';
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
    const nextWatch = _.find(eventWatches, input => input.completed === false);
    return nextWatch;
  }
);

const verifyEventShouldSendReward = createSelector(
  [getEventRewards],
  (eventRewards) => {
    const foundChannel = _.some(eventRewards, reward => _.includes(['SMS', 'MOBILE'], reward.channel.toUpperCase()));
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

const getPromotionSetPrice = createSelector([getPromotionSet], promotionSet =>
  Number(_.get(promotionSet, 'price', '')),
);

const getPromotionSetFirstProductPrice = createSelector([getPromotionSetProducts], products =>
  Number(_.head(products).price),
);

const getDroppedProducts = createSelector([getProducts], products =>
  _.filter(products, product => product.isDropped),
);

const getDroppedProductSummaryPrice = createSelector([getDroppedProducts], products =>
  _.sumBy(products, product => Number(product.price)),
);

const getProductToDrop = createSelector([getProducts], products =>
  _.find(products, product => !product.isDropped),
);

const getDropProductTargetRowColumn = createSelector(
  [getProductToDrop],
  productToDrop => `${productToDrop.row}${productToDrop.col}`,
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
    if (hasMobileTopup) return selectedMobileTopupTotalPrice;
    return hasPromotionSet ? promotionSetPrice - discountAmount : singleProductPrice - discountAmount;
  },
);

export default {
  // ======================================================
  // Event
  // ======================================================
  getEvent,
  getSelectedEvent,
  getEventInputs,
  getEventNextInput,
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
  // ======================================================
  // PromotionSet
  // ======================================================
  getPromotionSet,
  getPromotionSetProducts,
  getPromotionSetPrice,
  getPromotionSetFirstProductPrice,
  getProductToDrop,
  getDropProductTargetRowColumn,
  getDroppedProductSummaryPrice,
  // ======================================================
  // Flag
  // ======================================================
  verifyOrderHasProduct,
  verifyHasDroppedProduct,
  verifyAllOrderDropped,
  verifyOrderHasPromotionSet,
  verifyMobileTopupOrder,
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
