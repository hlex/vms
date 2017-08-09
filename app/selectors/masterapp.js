import { createSelector } from 'reselect';

const getBaseURL = state => state.baseURL;
const getTcp = state => state.tcp;
const getTemp = state => state.temp;

export default {
  getBaseURL,
  getTcp,
  getTemp
};
