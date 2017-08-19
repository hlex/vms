import _ from 'lodash';

export const verifyServerResponseData = (data) => {
  /*
    "{
      "action: 0,
      "sensor: "temp,
      "msg: {
        "temp: 4.3
      }
    }"
  */
  return true;
};

export const isInsertCash = (data) => {
  const action = _.get(data, 'action');
  const amount = Number(_.get(data, 'msg', ''));
  if (!action) return false;
  if (action !== 2 || amount <= 0) return false;
  return true;
};

export const isProductDropSuccess = (data) => {
  const action = _.get(data, 'action');
  const result = _.get(data, 'result', '').toUpperCase();
  if (!action) return false;
  if (action !== 1 || result !== 'SUCCESS') return false;
  return true;
};

export const isGetCashRemaining = (data) => {
  const action = _.get(data, 'action');
  const result = _.get(data, 'result', '').toUpperCase();
  const remain = _.get(data, 'remain');
  if (!action || !remain) return false;
  if (action !== 2 || result !== 'SUCCESS') return false;
  return true;
};
