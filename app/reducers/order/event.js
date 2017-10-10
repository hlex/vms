import _ from 'lodash';

import {
  CLEAR_ORDER,
  SELECT_EVENT,
  EVENT_UPDATE_INPUT_VALUE
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
      }
    default:
      return state;
  }
};
