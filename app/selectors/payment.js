import { createSelector } from 'reselect';
import _ from 'lodash';

const getCurrentAmount = state => Number(state.amount);
const getCashRemaining = state => state.remain;
const getCashChangeAmount = state => Number(state.cashChangeAmount);

export default {
  getCurrentAmount,
  getCashRemaining,
  getCashChangeAmount,
};
