// @flow
import { combineReducers } from 'redux';
import products from './products';
import promotionSets from './promotionSets';
import mobileTopup from './mobileTopup';
import event from './event';
import discounts from './discounts';

const order = combineReducers({
  products,
  promotionSets,
  mobileTopup,
  event,
  discounts
});

export default order;
