import { createSelector } from 'reselect';

const getTopupProviders = state => state.topupProviders;
const getProducts = state => state.products;
const getPromotionSets = state => state.promotionSets;
const getMobileTopupValues = state => state.mobileTopupValues;
const getEvents = state => state.events;

export default {
  getTopupProviders,
  getProducts,
  getPromotionSets,
  getMobileTopupValues,
  getEvents,
};
