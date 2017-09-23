import { CLEAR_ORDER, SELECT_EVENT } from '../../actions/actionTypes';

const initialState = {
  event: {},
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
        event: action.event,
      };
    default:
      return state;
  }
};
