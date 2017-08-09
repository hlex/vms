// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import products from './products';
import promotionSets from './promotionSets';
import payment from './payment';
import masterapp from './masterapp';
import masterdata from './masterdata';

const rootReducer = combineReducers({
  router,
  masterapp,
  masterdata,
  products,
  promotionSets,
  payment,
});

export default rootReducer;
