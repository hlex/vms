import _ from 'lodash';

import { SHOW_MODAL, HIDE_MODAL, HIDE_ALL_MODAL } from '../actions/actionTypes';

const initModal = () => {
  return {
    collectPoint: false,
    cashChangeError: false,
    productDropError: false,
  };
};

const initialState = {
  type: initModal(),
  data: {},
};
const getInitialState = () => ({
  ...initialState,
});

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case SHOW_MODAL:
      return {
        ...state,
        type: {
          ...state.type,
          [action.name]: true,
        },
        data: _.get(action, 'data', {}),
      };
    case HIDE_MODAL:
      return {
        ...state,
        type: {
          ...state.type,
          [action.name]: false,
        },
        data: {},
      };
    case HIDE_ALL_MODAL:
      return {
        ...state,
        type: initModal(),
        data: {},
      };
    default:
      return state;
  }
};
