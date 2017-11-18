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

export const getCashRemaining = (remain) => {
  return {
    oneBahtCount: _.get(remain, 'baht1', 0),
    fiveBahtCount: _.get(remain, 'baht5', 0),
    tenBahtCount: _.get(remain, 'baht10', 0),
  };
};

export const verifyLessThanThreshold = (remain, thresHold) => {
  return getCashRemainingAmount(remain) < thresHold;
};

export const verifyDuplicatedDiscount = (discounts, code) => {
  console.log('verifyDuplicatedDiscount', discounts, code);
  const discountAlreadyExist = _.find(discounts, discount => discount.code === code);
  if (discountAlreadyExist) return true;
  return false;
};

export const getCashRemainingAmount = (remain) => {
  const { oneBahtCount, fiveBahtCount, tenBahtCount } = getCashRemaining(remain);
  return ((tenBahtCount * 10) + (fiveBahtCount * 5) + oneBahtCount);
};

export const getEventInputByChannel = (eventInputs, channel) => {
  const channelToInput = channel === 'SMS' ? 'MSISDN' : 'EMAIL';
  return _.find(eventInputs, input => input.name === channelToInput);
};

export const getPhysicalUsedSlotNo = (product) => {
  const physicals = product.physicals || [];
  const usedPhysical = _.find(physicals, physical => physical.canDrop === true);
  return usedPhysical.slotNo;
};
