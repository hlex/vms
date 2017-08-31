// @flow
import { combineReducers } from 'redux';
import products from './products';
import promotionSets from './promotionSets';
import mobileTopup from './mobileTopup';

const order = combineReducers({
  products,
  promotionSets,
  mobileTopup,
});

export default order;
