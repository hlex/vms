import _ from 'lodash';
import cuid from 'cuid';

import {
  CLEAR_ORDER,
  SELECT_PRODUCT,
  PRODUCT_DROP_SUCCESS,
} from '../../actions/actionTypes';

const initialState = [];

const getInitialState = () => {
  return initialState;
};


export default function products(state = getInitialState(), action: actionType) {
  switch (action.type) {
    case CLEAR_ORDER:
      return getInitialState();
    case SELECT_PRODUCT:
      return [
        ...state,
        action.item
      ];
    case PRODUCT_DROP_SUCCESS:
      return _.map(state, (product) => {
        if (product.cuid === action.product.cuid) {
          return {
            ...product,
            isDropped: true,
          };
        }
        return {
          ...product,
        };
      });
    default:
      return state;
  }
}
