import { createSelector } from 'reselect';
import _ from 'lodash';

import OrderSelector from './order';
import PaymentSelector from './payment';

const getPaymentSummaryList = (state) => {
  return [
    {
      text: 'ยอดชำระสุทธิ',
      color: 'blue',
      amount: `${OrderSelector.getOrderGrandTotalAmount(state.order)}`,
    },
    {
      text: 'ใส่เงินแล้ว',
      color: 'green',
      amount: `${PaymentSelector.getCurrentAmount(state.payment)}`,
    },
  ];
};

// ทอนเงินตามจริง
const getCashChangeAmount = (state) => {
  return PaymentSelector.getCurrentAmount(state.payment) - OrderSelector.getOrderGrandTotalAmount(state.order);
};

// คืนเงินเท่ากับราคาออเดอร์
const getCashChangeFromOrderAmount = (state) => {
  return OrderSelector.getOrderGrandTotalAmount(state.order);
};

// คืนเงินที่หยอดมา
const getCashChangeFromCurrentCash = (state) => {
  return PaymentSelector.getCurrentAmount(state.payment);
};

const getCashChangePromotionSetError = (state) => {
  return OrderSelector.getOrderGrandTotalAmount(state.order) - OrderSelector.getDroppedProductSummaryPrice(state.order);
};

export default {
  getPaymentSummaryList,
  getCashChangeAmount,
  getCashChangeFromOrderAmount,
  getCashChangeFromCurrentCash,
  getCashChangePromotionSetError
};
