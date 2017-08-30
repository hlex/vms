// @flow
import { combineReducers } from 'redux';
import products from './products';
import promotionSets from './promotionSets';

const order = combineReducers({
  products,
  promotionSets,
});

export default order;
