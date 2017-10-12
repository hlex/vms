import _ from 'lodash';

import {
  OPEN_ALERT_MESSAGE,
  CLOSE_ALERT_MESSAGE,
} from '../actions/actionTypes';

const initialState = {
  show: false,
  title: {
    th: '',
    en: ''
  },
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
        title: action.data.title,
        messages: action.data.messages,
        technical: action.data.technical,
      };
    case CLOSE_ALERT_MESSAGE:
      return getInitialState();
    default:
      return state;
  }
};
