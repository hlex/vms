// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import products from './products';
import promotionSets from './promotionSets';
import payment from './payment';
import masterapp from './masterapp';
import masterdata from './masterdata';
import mobileTopup from './mobileTopup';
import order from './order';

const rootReducer = combineReducers({
  router,
  masterapp,
  masterdata,
  products,
  promotionSets,
  payment,
  mobileTopup,
  order,
});

export default rootReducer;
