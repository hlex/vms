import { CLEAR_ORDER, ADD_DISCOUNT } from '../../actions/actionTypes';

const initialState = [];
const getInitialState = () => initialState;

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case CLEAR_ORDER:
      return getInitialState();
    case ADD_DISCOUNT:
      return [
        ...state,
        action.discount,
      ];
    default:
      return state;
  }
};
