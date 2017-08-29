import { createSelector } from 'reselect';
import _ from 'lodash';

import OrderSelector from './order';
import PaymentSelector from './payment';

const getPaymentSummaryList = (state) => {
  const singleProductPrice = OrderSelector.getSingleProductPrice(state.order);
  const currentAmount = PaymentSelector.getCurrentAmount(state.payment);
  return [
    {
      text: 'ยอดชำระสุทธิ',
      color: 'blue',
      amount: `${singleProductPrice}`,
    },
    {
      text: 'ใส่เงินแล้ว',
      color: 'green',
      amount: `${currentAmount}`,
    },
  ];
};

// ทอนเงินตามจริง
const getCashChangeAmount = (state) => {
  const singleProductPrice = OrderSelector.getSingleProductPrice(state.order);
  const currentAmount = PaymentSelector.getCurrentAmount(state.payment);
  return currentAmount - singleProductPrice;
};

// คืนเงินที่หยอดมา
const getCashReturnAmount = (state) => {
  const currentAmount = PaymentSelector.getCurrentAmount(state.payment);
  return currentAmount;
};


export default {
  getPaymentSummaryList,
  getCashChangeAmount,
  getCashReturnAmount,
};
