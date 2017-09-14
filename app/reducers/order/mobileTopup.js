import {
  CLEAR_ORDER,
  SELECT_MOBILE_TOPUP_PROVIDER,
  CONFIRM_MOBILE_TOPUP_MSISDN,
  SELECT_MOBILE_TOPUP_VALUE,
  SUBMIT_MOBILE_TOPUP_VALUE,
  CLEAR_MOBILE_TOPUP_VALUE,
  CLEAR_MOBILE_TOPUP_MSISDN,
} from '../../actions/actionTypes';

const initialState = {
  selectedMobileTopupProvider: {},
  MSISDN: '',
  selectedMobileTopupValue: {},
};
const getInitialState = () => {
  return {
    ...initialState
  };
};

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case CLEAR_ORDER:
      return getInitialState();
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
    case SELECT_MOBILE_TOPUP_VALUE:
    case SUBMIT_MOBILE_TOPUP_VALUE:
      return {
        ...state,
        selectedMobileTopupValue: action.item,
      };
    case CLEAR_MOBILE_TOPUP_VALUE:
      return {
        ...state,
        selectedMobileTopupValue: {},
      }
    case CLEAR_MOBILE_TOPUP_MSISDN:
      return {
        ...state,
        MSISDN: '',
      }
    default:
      return state;
  }
};
