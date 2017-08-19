import { createSelector } from 'reselect';
import _ from 'lodash';

const getCurrentAmount = state => Number(state.amount);
const getCashRemaining = state => state.remain;

export default {
  getCurrentAmount,
  getCashRemaining,
};
