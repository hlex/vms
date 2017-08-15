import { createSelector } from 'reselect';
import _ from 'lodash';

const getCurrentAmount = state => Number(state.amount);

export default {
  getCurrentAmount,
};
