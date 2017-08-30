import { createSelector } from 'reselect';
import _ from 'lodash';

const getProducts = state => state.products;
const getPromotionSets = state => state.promotionSets;

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

const getOrderGrandTotalAmount = createSelector(
  [verifyOrderHasPromotionSet, getSingleProductPrice, getPromotionSetPrice],
  (hasPromotionSet, singleProductPrice, promotionSetPrice) => {
    return hasPromotionSet ? promotionSetPrice : singleProductPrice;
  }
);

export default {
  getProducts,
  getSingleProduct,
  getSingleProductPrice,
  getPromotionSet,
  getPromotionSetProducts,
  getPromotionSetPrice,
  getProductToDrop,
  getDropProductTargetRowColumn,
  verifyAllOrderDropped,
  verifyOrderHasPromotionSet,
  getOrderGrandTotalAmount,
};
