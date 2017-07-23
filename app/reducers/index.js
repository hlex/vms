// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import products from './products';
import promotionSets from './promotionSets';
import masterapp from './masterapp';
import masterdata from './masterdata';

const rootReducer = combineReducers({
  router,
  masterapp,
  masterdata,
  products,
  promotionSets,
});

export default rootReducer;
