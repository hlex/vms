import _ from 'lodash';

import {
  CLEAR_ORDER,
  SELECT_EVENT,
  EVENT_UPDATE_INPUT_VALUE,
  EVENT_UPDATE_REWARD_DISCOUNT
} from '../../actions/actionTypes';

const initialState = {
  selectedEvent: {},
};
const getInitialState = () => ({
  ...initialState,
});

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case CLEAR_ORDER:
      return getInitialState();
    case SELECT_EVENT:
      return {
        ...state,
        selectedEvent: action.event,
      };
    case EVENT_UPDATE_INPUT_VALUE:
      return {
        ...state,
        selectedEvent: {
          ...state.selectedEvent,
          inputs: _.map(state.selectedEvent.inputs, (input) => {
            if (input.name === action.key) {
              return {
                ...input,
                value: action.value,
                completed: true
              };
            }
            return input;
          })
        }
      };
    case EVENT_UPDATE_REWARD_DISCOUNT:
      return {
        ...state,
        selectedEvent: {
          ...state.selectedEvent,
          rewards: _.map(state.selectedEvent.rewards, (reward) => {
            if (reward.cuid === action.cuid) {
              return {
                ...reward,
                code: action.discount.code,
                value: action.discount.value,
                expireDate: action.discount.expireDate
              };
            }
            return reward;
          })
        }
      }
    default:
      return state;
  }
};
