// @flow
import { combineReducers } from 'redux';
import products from './products';
import promotionSets from './promotionSets';
import mobileTopup from './mobileTopup';
import event from './event';

const order = combineReducers({
  products,
  promotionSets,
  mobileTopup,
  event,
});

export default order;
