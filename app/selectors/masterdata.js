import { createSelector } from 'reselect';

const getTopupProviders = state => state.topupProviders;
const getProducts = state => state.products;
const getPromotionSets = state => state.promotionSets;
const getMobileTopupValues = state => state.mobileTopupValues;

export default {
  getTopupProviders,
  getProducts,
  getPromotionSets,
  getMobileTopupValues,
};
