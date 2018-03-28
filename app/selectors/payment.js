import { createSelector } from 'reselect';
import _ from 'lodash';

const getCurrentAmount = state => Number(state.amount);
const getCashRemaining = state => state.remain;
const getCashChangeAmount = state => Number(state.cashChangeAmount);
const verifyIsReceivedPaidInFull = state => state.isReceivedPaidInFull;

const verifyCashChangeAmountMoreThanZero = createSelector(
  [getCashChangeAmount],
  cashChangeAmount => cashChangeAmount > 0
);

const verifyCurrentAmountMoreThanZero = createSelector(
  [getCurrentAmount],
  currentAmount => currentAmount > 0
);

const getCashRemainingCoinsString = createSelector(
  [getCashRemaining],
  remain => {
    const remainArray = _.reduce(remain, (result, amount, type) => {
      if (type === 'baht1') return [...result, `1|${amount}`];
      if (type === 'baht5') return [...result, `5|${amount}`];
      if (type === 'baht10') return [...result, `10|${amount}`];
      return result;
    }, [])
    return _.join(remainArray, ',');
  }
);

export default {
  getCurrentAmount,
  getCashRemaining,
  getCashChangeAmount,
  verifyCashChangeAmountMoreThanZero,
  verifyCurrentAmountMoreThanZero,
  verifyIsReceivedPaidInFull,
  getCashRemainingCoinsString
};
