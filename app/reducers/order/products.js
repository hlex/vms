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
    case 'PRODUCT_MARK_CANNOT_USE_PHYSICAL':
      return _.map(state, (product) => {
        if (product.cuid === action.product.cuid) {
          return {
            ...product,
            physicals: _.map(product.physicals, (physical) => {
              if (physical.cuid === action.physical.cuid) {
                return {
                  ...physical,
                  canDrop: false
                };
              }
              return physical;
            })
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
