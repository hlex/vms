// @flow
import { combineReducers } from 'redux';
import products from './products';

const order = combineReducers({
  products,
});

export default order;
