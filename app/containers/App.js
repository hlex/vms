// @flow
import React, { Component } from 'react';
import type { Children } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setDebugMode } from 'api-jarvis';

setDebugMode(true);

// ======================================================
// Helpers
// ======================================================
import { getCashRemainingAmount } from '../helpers/global';
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
  console.log(
    '%c App@state:',
    'color: #4CAF50; font-weight: 700;',
    state,
    state.masterapp.tcpClient.histories
  );
  console.log(
    '%c เงินทอนคงเหลือ:',
    'color: #307DFC; font-weight: 700;',
    getCashRemainingAmount(state.payment.remain)
  );
  return {
    location: state.router.location,
    baseURL: MasterappSelector.getBaseURL(state.masterapp),
    appReady: MasterappSelector.verifyAppReady(state.masterapp),
    modal: state.modal,
    lang: MasterappSelector.getLanguage(state.masterapp)
  };
};

const actions = {
  ...ApplicationActions
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

  handleClickHome = () => {
    const { backToHome } = this.props;
    backToHome();
    this.mediaPlayer.handleTouchMedia();
  };

  handleSwitchLanguage = oppositeLang => {
    const { switchLanguageTo } = this.props;
    switchLanguageTo(oppositeLang);
    this.mediaPlayer.handleTouchMedia();
  };

  render() {
    const {
      backToHome,
      baseURL,
      location,
      appReady,
      insertCoin,
      scanCode,
      modal,
      switchLanguageTo,
      lang
    } = this.props;
    return (
      <div className="smart-vending-machine-app">
        {appReady && (
          <div className="smart-vending-machine-app-connected">
            <AlertMessage />
            <LoadingScreen />
            <Layout.Header
              lang={lang}
              switchLanguageTo={this.handleSwitchLanguage}
              backToHome={this.handleClickHome}
              baseURL={baseURL}
            />
            {this.props.children}
            <Layout.Footer inputRef={el => this.mediaPlayer = el} />
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
                    <a onClick={() => scanCode('Q12345R')}>QR</a>
                  </li>
                  <li>
                    <a onClick={() => scanCode('2048486920593')}>BC</a>
                  </li>
                  <li>
                    <a onClick={() => scanCode('http://line.me/th/q/_hlexpond')}>LINE</a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
        {!appReady && (
          <div style={{ display: 'flex', width: '1080px', height: '1920px' }}>
            <img
              style={{ width: '100%' }}
              src={'http://localhost:8888/vms/html-v2/images/app-loading.gif'}
            />
          </div>
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
