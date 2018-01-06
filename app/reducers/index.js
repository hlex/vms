// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import payment from './payment';
import masterapp from './masterapp';
import masterdata from './masterdata';
import order from './order';
import modal from './modal';
import alertMessage from './alertMessage';
import ads from './ads';
import audio from './audio';

const rootReducer = combineReducers({
  router,
  audio,
  ads,
  alertMessage,
  masterapp,
  masterdata,
  payment,
  order,
  modal,
});

export default rootReducer;
