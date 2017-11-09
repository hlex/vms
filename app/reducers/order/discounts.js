import _ from 'lodash';
import {
  CLEAR_ORDER,
  ADD_DISCOUNT,
  CLEAR_INSTANTLY_DISCOUNT,
} from '../../actions/actionTypes';

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
    case CLEAR_INSTANTLY_DISCOUNT:
      return _.filter(state, (discount) => {
        return !discount.instantly;
      });
    default:
      return state;
  }
};
