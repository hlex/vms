// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import payment from './payment';
import masterapp from './masterapp';
import masterdata from './masterdata';
import order from './order';
import modal from './modal';

const rootReducer = combineReducers({
  router,
  masterapp,
  masterdata,
  payment,
  order,
  modal,
});

export default rootReducer;
