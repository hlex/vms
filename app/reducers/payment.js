import _ from 'lodash';
import cuid from 'cuid';

import {
  RECEIVED_CASH,
  RECEIVED_CASH_COMPLETELY,
  PRODUCT_DROP_SUCCESS,
  RESET_PAYMENT_REDUCER,
  CLEAR_PAYMENT_AMOUNT,
} from '../actions/actionTypes';

const initialState = {
  isLoading: false,
  isFinish: false,
  amount: 0,
};
const getInitialState = () => {
  return {
    ...initialState
  };
};


export default function products(state = getInitialState(), action: actionType) {
  switch (action.type) {
    case RESET_PAYMENT_REDUCER:
      return getInitialState();
    case RECEIVED_CASH:
      return {
        ...state,
        amount: state.amount + Number(action.data.msg),
      };
    case RECEIVED_CASH_COMPLETELY:
      return {
        ...state,
        isLoading: true,
      };
    case PRODUCT_DROP_SUCCESS:
      return {
        ...state,
        isFinish: true,
      };
    case CLEAR_PAYMENT_AMOUNT:
      return {
        ...state,
        amount: 0,
      };
    default:
      return state;
  }
}
