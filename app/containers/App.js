// @flow
import React, { Component } from 'react';
import type { Children } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// ======================================================
// Helpers
// ======================================================
import {
  getCashRemainingAmount,
} from '../helpers/global';
// ======================================================
// Actions
// ======================================================
import * as ApplicationActions from '../actions/applicationActions';
// ======================================================
// Selectors
// ======================================================
import MasterappSelector from '../selectors/masterapp';
// ======================================================
// APIs
// ======================================================
// ======================================================
// Containers
// ======================================================
import Layout from './Layout';
import AlertMessage from './AlertMessage';
import LoadingScreen from './LoadingScreen';

const mapStateToProps = state => {
  console.log('%c App@state:', 'color: #4CAF50; font-weight: 700;', state, state.masterapp.tcpClient.histories);
  console.log('%c เงินทอนคงเหลือ:', 'color: #307DFC; font-weight: 700;', getCashRemainingAmount(state.payment.remain));
  return {
    location: state.router.location,
    baseURL: MasterappSelector.getBaseURL(state.masterapp),
    appReady: MasterappSelector.verifyAppReady(state.masterapp),
    modal: state.modal,
  };
};

const actions = {
  ...ApplicationActions,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class App extends Component {
  props: {
    children: Children,
    baseURL: string,
    location: Object,
    backToHome: Function,
    initApplication: Function,
    appReady: boolean
  };

  componentWillMount = () => {
    const { initApplication } = this.props;
    initApplication();
  };

  render() {
    const { backToHome, baseURL, location, appReady, insertCoin, scanCode, modal, switchLanguageTo } = this.props;
    return (
      <div className="smart-vending-machine-app">
        {
          appReady &&
          <div className="smart-vending-machine-app-connected">
            <AlertMessage />
            <LoadingScreen />
            <Layout.Header switchLanguageTo={switchLanguageTo} backToHome={backToHome} baseURL={baseURL} />
            {this.props.children}
            <Layout.Footer />
            {process.env.NODE_ENV !== 'production' && (
              <div className="development-toolbar">
                <ul>
                  <li>
                    <a onClick={() => backToHome()}>HOME</a>
                  </li>
                  <li>
                    <a onClick={() => insertCoin(1)}>1B</a>
                  </li>
                  <li>
                    <a onClick={() => insertCoin(5)}>5B</a>
                  </li>
                  <li>
                    <a onClick={() => insertCoin(10)}>10B</a>
                  </li>
                  <li>
                    <a onClick={() => insertCoin(20)}>20B</a>
                  </li>
                  <li>
                    <a onClick={() => insertCoin(50)}>50B</a>
                  </li>
                  <li>
                    <a onClick={() => insertCoin(100)}>100B</a>
                  </li>
                  <li>
                    <a onClick={() => scanCode('B12345')}>QR</a>
                  </li>
                  <li>
                    <a onClick={() => scanCode('1234567')}>BC</a>
                  </li>
                  <li>
                    <a onClick={() => scanCode('http://line.me/th/q/_hlexpond')}>LINE</a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        }
        {
          !appReady && <div>Loading...</div>
        }
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
