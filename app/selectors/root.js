import { createSelector } from 'reselect';
import _ from 'lodash';

import OrderSelector from './order';
import PaymentSelector from './payment';

const getRouterState = state => state.router;

const getCurrentPage = createSelector(
  [getRouterState],
  router => {
    const pathname = _.get(router, 'location.pathname', '');
    switch (pathname) {
      case '/product/single':
        return 'singleProduct';
      case '/product/promotionSet':
        return 'promotionSet';
      case '/product':
        return 'productSelection';
      case '/event/ads':
        return 'eventAdvertisement';
      case '/event/play':
        return 'eventPlay';
      case '/event':
        return 'eventSelection';
      case '/topup/inputMSISDN':
        return 'topupInputMobileNumber';
      case '/topup/selectTopupValue':
        return 'topupSelectTopupValue';
      case '/topup/confirm':
        return 'topupConfirm';
        case '/topup':
        return 'topupSelection';
      case '/confirm':
        return 'paymentConfirm';
      case '/payment':
        return 'payment';
      case '/thankyou':
        return 'thankyou';
      case '/thankyou-with-free-product':
        return 'thankyouWithFreeProduct'
      case '/thankyou-mobile-topup':
        return 'thankyouMobileTopup';
      case '/salesman':
        return 'verifySalesman';
      default:
        return '';
    }
  }
)

const isCurrentPageCanReceivedCash = createSelector(
  [getCurrentPage],
  currentPage => {
    console.log('isCurrentPageCanReceivedCash', currentPage)
    return _.includes(['payment'], currentPage)
  }
)

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
  return PaymentSelector.getCurrentAmount(state.payment) - OrderSelector.getDroppedProductSummaryPrice(state.order);
};

export default {
  isCurrentPageCanReceivedCash,
  getCurrentPage,
  getPaymentSummaryList,
  getCashChangeAmount,
  getCashChangeFromOrderAmount,
  getCashChangeFromCurrentCash,
  getCashChangePromotionSetError
};
