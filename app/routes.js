/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
// ======================================================
// Containers
// ======================================================
import App from './containers/App';
import HomePage from './containers/HomePage';
import End from './containers/End';
import Event from './containers/Event';
import Payment from './containers/Payment';
import Product from './containers/Product';
import Topup from './containers/Topup';
import Salesman from './containers/Salesman';

export default () =>
  (<App>
    <Switch>
      <Route exact path="/product/single" component={Product.SingleProductPage} />
      <Route exact path="/product/promotionSet" component={Product.PromotionSetPage} />
      <Route exact path="/product" component={Product.ProductSelectionPage} />
      <Route path="/event/ads" component={Event.EventAds} />
      <Route path="/event/play" component={Event.EventPlayPage} />
      <Route path="/event" component={Event.EventSelectionPage} />
      <Route path="/topup/inputMSISDN" component={Topup.InputMSISDNPage} />
      <Route path="/topup/selectTopupValue" component={Topup.SelectTopupValuePage} />
      <Route path="/topup/confirm" component={Topup.MobileTopupPage} />
      <Route path="/topup" component={Topup.TopupProviderSelectionPage} />
      <Route path="/confirm" component={Payment.ConfirmToPayPage} />
      <Route path="/payment" component={Payment.PaymentPage} />
      <Route path="/thankyou" component={End.ThankyouPage} />
      <Route path="/thankyou-with-free-product" component={End.ThankyouPageWithFreeProduct} />
      <Route path="/thankyou-mobile-topup" component={End.ThankyouPageWIthMobileTopup} />
      <Route path="/salesman" component={Salesman} />
      <Route path="/" component={HomePage} />
    </Switch>
  </App>);
