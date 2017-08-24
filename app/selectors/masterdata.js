import { createSelector } from 'reselect';

const getTopupProviders = state => state.topupProviders;
const getProducts = state => state.products;
const getPromotionSets = state => state.promotionSets;

export default {
  getTopupProviders,
  getProducts,
  getPromotionSets
};
