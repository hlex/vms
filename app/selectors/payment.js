import { createSelector } from 'reselect';
import _ from 'lodash';

const getCurrentAmount = state => Number(state.amount);
const getCashRemaining = state => state.remain;
const getCashChangeAmount = state => Number(state.cashChangeAmount);

const verifyCashChangeAmountMoreThanZero = createSelector(
  [getCashChangeAmount],
  cashChangeAmount => cashChangeAmount > 0
);

const verifyCurrentAmountMoreThanZero = createSelector(
  [getCurrentAmount],
  currentAmount => currentAmount > 0
);

export default {
  getCurrentAmount,
  getCashRemaining,
  getCashChangeAmount,
  verifyCashChangeAmountMoreThanZero,
  verifyCurrentAmountMoreThanZero
};
