import { createSelector } from 'reselect';
import _ from 'lodash';

const getTopupProviders = state => state.topupProviders;
const getProducts = state => state.products;
const getPromotionSets = state => state.promotionSets;
const getMobileTopupValues = state => state.mobileTopupValues;
const getEvents = state => state.events;
const getMainMenus = state => state.mainMenus;
const getProductSteps = state => state.productSteps;
const getEventSteps = state => state.eventSteps;
const getMobileTopupSteps = state => state.mobileTopupSteps;

const getActivityFreeProduct = createSelector([getProducts], products => {
  const targetProduct = _.find(products, product => {
    const hasFreePhysical = _.find(product.physicals, physical => physical.isFree === true);
    return hasFreePhysical;
  });
  if (targetProduct) {
    return {
      ...targetProduct,
      price: 0
    };
  }
  return undefined;
});

const getProductsNotFree = createSelector([getProducts], products =>
  _.filter(products, product => !product.everyPhysicalIsFree)
);

const getPromotionsThatSomeProductNotFree = createSelector([getPromotionSets], promotions =>
  _.filter(promotions, promotion => !promotion.hasSomeProductThatEveryPhysicalIsFree)
);

export default {
  getProductSteps,
  getEventSteps,
  getMobileTopupSteps,
  getMainMenus,
  getTopupProviders,
  getProducts,
  getPromotionSets,
  getMobileTopupValues,
  getEvents,
  getActivityFreeProduct,
  getProductsNotFree,
  getPromotionsThatSomeProductNotFree
};
