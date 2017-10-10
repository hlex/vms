import _ from 'lodash';

export const isEmpty = value => _.isUndefined(value) || _.isEmpty(value);

export const isNotEmpty = value => !isEmpty(value);

export const changeCoin = value => {
  const baht10 = Math.floor(value / 10);
  const baht5 = Math.floor((value - baht10 * 10) / 5);
  const baht1 = Math.floor((value - baht10 * 10 - baht5 * 5) / 1);
  return {
    baht1,
    baht5,
    baht10,
  };
};

export const createLog = (type = '', bgColor = 'green', color = '#fff') => {
  if (type === 'app') return 'background: #333; color: #fff';
  if (type === 'client') return 'background: green; color: #fff';
  return `background: ${bgColor}; color: ${color}`;
};

export const verifyLessThanThreshold = (remain, thresHold) => {
  const oneBahtRemaining = _.get(remain, 'baht1', 0);
  const fiveBahtRemaining = _.get(remain, 'baht5', 0);
  const tenBahtRemaining = _.get(remain, 'baht10', 0);
  return tenBahtRemaining * 10 + fiveBahtRemaining * 5 + oneBahtRemaining < thresHold;
};

export const verifyCanUseDiscount = (discounts, code) => {
  console.log('verifyCanUseDiscount', discounts, code);
  const discountAlreadyExist = _.find(discounts, discount => discount.code === code);
  if (discountAlreadyExist) return false;
  return true;
};
