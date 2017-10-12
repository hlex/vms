import _ from 'lodash';

import {
  OPEN_ALERT_MESSAGE,
  CLOSE_ALERT_MESSAGE,
} from '../actions/actionTypes';

const initialState = {
  show: false,
  messages: {
    th: '',
    en: '',
  },
  technical: {
    message: '',
    code: '',
  },
};
const getInitialState = () => ({
  ...initialState,
});

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case OPEN_ALERT_MESSAGE:
      return {
        ...state,
        show: true,
        // messages: action.messages,
      };
    case CLOSE_ALERT_MESSAGE:
      return getInitialState();
    default:
      return state;
  }
};
