import { createSelector } from 'reselect';
import _ from 'lodash';

const getTopupProviders = state => state.topupProviders;
const getProducts = state => state.products;
const getPromotionSets = state => state.promotionSets;
const getMobileTopupValues = state => state.mobileTopupValues;
const getEvents = state => state.events;
const getMainMenus = state => state.mainMenus;
const getActivityFreeProduct = createSelector(
  [
    getProducts
  ],
  (
    products => {
      const targetProduct = _.find(products, (product) => {
        const hasFreePhysical = _.find(product.physicals, physical => physical.isFree === true);
        return hasFreePhysical;
      });
      if (targetProduct) {
        return {
          ...targetProduct,
          price: 0,
        };
      }
      return undefined;
    }
  )
);

export default {
  getMainMenus,
  getTopupProviders,
  getProducts,
  getPromotionSets,
  getMobileTopupValues,
  getEvents,
  getActivityFreeProduct
};
