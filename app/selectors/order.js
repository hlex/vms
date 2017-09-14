import { createSelector } from 'reselect';
import _ from 'lodash';

const getProducts = state => state.products;
const getPromotionSets = state => state.promotionSets;
const getMobileTopup = state => state.mobileTopup;

const getTopupMSISDN = createSelector(
  [getMobileTopup],
  (mobileTopup) => {
    return mobileTopup.MSISDN || '';
  }
);

const getSelectedMobileTopupProvider = createSelector(
  [getMobileTopup],
  (mobileTopup) => {
    return mobileTopup.selectedMobileTopupProvider || {};
  }
);

const getSelectedMobileTopupValue = createSelector(
  [getMobileTopup],
  (mobileTopup) => {
    return mobileTopup.selectedMobileTopupValue || {};
  }
);

const getSelectedMobileTopupPrice = createSelector(
  [getSelectedMobileTopupValue],
  (selectedMobileTopupValue) => {
    return Number(selectedMobileTopupValue.value);
  }
);

const getSelectedMobileTopupTotalPrice = createSelector(
  [getSelectedMobileTopupValue, getSelectedMobileTopupPrice],
  (selectedMobileTopupValue, selectedMobileTopupPrice) => {
    return selectedMobileTopupPrice + Number(selectedMobileTopupValue.fee);
  }
);

const getMobileTopupName = createSelector(
  [getSelectedMobileTopupProvider],
  (selectedMobileTopupProvider) => {
    return selectedMobileTopupProvider.name || '';
  }
);

const getMobileTopupBanner = createSelector(
  [getSelectedMobileTopupProvider],
  (selectedMobileTopupProvider) => {
    return selectedMobileTopupProvider.banner || '';
  }
);

const getMobileTopupServiceCode = createSelector(
  [getSelectedMobileTopupProvider],
  (selectedMobileTopupProvider) => {
    return selectedMobileTopupProvider.serviceCode || '';
  }
);

const getSingleProduct = createSelector(
  [getProducts],
  (products) => {
    return _.head(products);
  }
);

const getPromotionSet = createSelector(
  [getPromotionSets],
  (promotionSets) => {
    return _.head(promotionSets);
  }
);

const getPromotionSetProducts = createSelector(
  [getPromotionSet],
  (promotionSet) => {
    return _.get(promotionSet, 'products', []);
  }
);

const getSingleProductPrice = createSelector(
  [getSingleProduct],
  (singleProduct) => {
    return Number(_.get(singleProduct, 'price', ''));
  }
);

const getPromotionSetPrice = createSelector(
  [getPromotionSet],
  (promotionSet) => {
    return Number(_.get(promotionSet, 'price', ''));
  }
);

const getPromotionSetFirstProductPrice = createSelector(
  [getPromotionSetProducts],
  (products) => {
    return Number(_.head(products).price);
  }
);

const getDroppedProducts = createSelector(
  [getProducts],
  (products) => {
    return _.filter(products, product => product.isDropped);
  }
);

const getDroppedProductSummaryPrice = createSelector(
  [getDroppedProducts],
  (products) => {
    return _.sumBy(products, product => Number(product.price));
  }
);

const getProductToDrop = createSelector(
  [getProducts],
  (products) => {
    return _.find(products, product => !product.isDropped);
  }
);

const getDropProductTargetRowColumn = createSelector(
  [getProductToDrop],
  (productToDrop) => {
    return `${productToDrop.row}${productToDrop.col}`;
  }
);

const verifyOrderHasProduct = createSelector(
  [getProducts],
  (products) => {
    return _.size(products) > 0;
  }
);

const verifyHasDroppedProduct = createSelector(
  [getProducts],
  (products) => {
    return _.some(products, product => product.isDropped);
  }
);

const verifyAllOrderDropped = createSelector(
  [getProducts],
  (products) => {
    return _.every(products, product => product.isDropped);
  }
);

const verifyOrderHasPromotionSet = createSelector(
  [getPromotionSets],
  (promotionSets) => {
    return _.size(promotionSets) > 0;
  }
);

const verifyMobileTopupOrder = createSelector(
  [getSelectedMobileTopupProvider],
  (selectedMobileTopup) => {
    return !_.isEmpty(selectedMobileTopup);
  }
);

const getOrderGrandTotalAmount = createSelector(
  [
    verifyOrderHasPromotionSet,
    verifyMobileTopupOrder,
    getSelectedMobileTopupTotalPrice,
    getSingleProductPrice,
    getPromotionSetPrice
  ],
  (
    hasPromotionSet,
    hasMobileTopup,
    selectedMobileTopupTotalPrice,
    singleProductPrice,
    promotionSetPrice
  ) => {
    if (hasMobileTopup) return selectedMobileTopupTotalPrice;
    return hasPromotionSet ? promotionSetPrice : singleProductPrice;
  }
);

export default {
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
};
