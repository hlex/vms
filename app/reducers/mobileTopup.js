import {
  SELECT_MOBILE_TOPUP_PROVIDER,
  CONFIRM_MOBILE_TOPUP_MSISDN,
} from '../actions/actionTypes';

const initialState = {
  selectedMobileTopupProvider: {},
  MSISDN: '',
};
const getInitialState = () => {
  return {
    ...initialState
  };
};

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case SELECT_MOBILE_TOPUP_PROVIDER:
      return {
        ...state,
        selectedMobileTopupProvider: action.topupProvider,
      };
    case CONFIRM_MOBILE_TOPUP_MSISDN:
      return {
        ...state,
        MSISDN: action.MSISDN
      };
    default:
      return state;
  }
};
