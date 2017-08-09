import _ from 'lodash';
import cuid from 'cuid';

import { RECEIVED_CASH, RECEIVED_CASH_COMPLETELY } from '../actions/actionTypes';

const initialState = {
  isLoading: false,
  isFinish: false,
};

export default function products(state = initialState, action: actionType) {
  switch (action.type) {
    case RECEIVED_CASH:
      return state;
    case RECEIVED_CASH_COMPLETELY:
      return {
        ...state,
        isLoading: true,
      };
    default:
      return state;
  }
}
