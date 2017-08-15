import { createSelector } from 'reselect';
import _ from 'lodash';

const getProducts = state => state.products;

const getSingleProduct = createSelector(
  [getProducts],
  (products) => {
    return _.head(products);
  }
);

const getSingleProductPrice = createSelector(
  [getSingleProduct],
  (singleProduct) => {
    return Number(_.get(singleProduct, 'price', ''));
  }
);

const getOrderTotalAmount = createSelector(
  [getSingleProductPrice],
  (singleProductPrice) => {
    return singleProductPrice;
  }
);

export default {
  getProducts,
  getSingleProduct,
  getSingleProductPrice,
  getOrderTotalAmount,
};
