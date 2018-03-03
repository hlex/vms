import _ from 'lodash';
import cuid from 'cuid';

import {
  RECEIVED_CASH,
  RECEIVED_CASH_COMPLETELY,
  PRODUCT_DROP_PROCESS_COMPLETELY,
  RESET_PAYMENT_REDUCER,
  CLEAR_PAYMENT_AMOUNT,
  RECEIVED_CASH_REMAINING,
  SET_CASH_CHANGE_AMOUNT,
  RECEIVED_PAID_IN_FULL,
  CLEAR_RECEIVED_PAID_IN_FULL
} from '../actions/actionTypes';

const initialState = {
  isLoading: false,
  isFinish: false,
  amount: 0,
  remain: {},
  cashChangeAmount: 0,
  isReceivedPaidInFull: false
};
const getInitialState = () => {
  return {
    ...initialState
  };
};


export default function products(state = getInitialState(), action: actionType) {
  switch (action.type) {
    case RESET_PAYMENT_REDUCER:
      return {
        ...getInitialState(),
        amount: state.amount,
        remain: state.remain,
        cashChangeAmount: state.cashChangeAmount,
      };
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
    case PRODUCT_DROP_PROCESS_COMPLETELY:
      return {
        ...state,
        isFinish: true,
      };
    case CLEAR_PAYMENT_AMOUNT:
      return {
        ...state,
        amount: 0,
      };
    case RECEIVED_CASH_REMAINING:
      return {
        ...state,
        remain: action.data.remain
      }
    case SET_CASH_CHANGE_AMOUNT:
      return {
        ...state,
        cashChangeAmount: action.cashChangeAmount
      };
    case RECEIVED_PAID_IN_FULL:
      return {
        ...state,
        isReceivedPaidInFull: true
      };
    case CLEAR_RECEIVED_PAID_IN_FULL:
      return {
        ...state,
        isReceivedPaidInFull: false
      };
    default:
      return state;
  }
}
