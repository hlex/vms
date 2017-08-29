import _ from 'lodash';
import cuid from 'cuid';

import {
  CLEAR_ORDER,
  SELECT_PRODUCT,
} from '../../actions/actionTypes';

const initialState = [];

const getInitialState = () => {
  return initialState;
};


export default function products(state = getInitialState(), action: actionType) {
  switch (action.type) {
    case CLEAR_ORDER:
      return [];
    case SELECT_PRODUCT:
      return [
        action.item
      ];
    default:
      return state;
  }
}
