import _ from 'lodash';
import cuid from 'cuid';

import {
  SELECT_PRODUCT,
} from '../../actions/actionTypes';

const initialState = [];

const getInitialState = () => {
  return initialState;
};


export default function products(state = getInitialState(), action: actionType) {
  switch (action.type) {
    case SELECT_PRODUCT:
      return [
        action.item
      ];
    default:
      return state;
  }
}
