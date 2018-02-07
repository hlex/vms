// @flow
import React, { Component } from 'react';
import type { Children } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setDebugMode } from 'api-jarvis';
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
import DevToolbar from './DevToolbar';

setDebugMode(true);

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
    localStaticURL: MasterappSelector.getLocalStaticURL(state.masterapp),
    baseURL: MasterappSelector.getBaseURL(state.masterapp),
    appReady: MasterappSelector.verifyAppReady(state.masterapp),
    isMaintenace: MasterappSelector.verifyIsMaintenanceMode(state.masterapp),
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

  renderMaintenanceMode = () => {
    setTimeout(() => {
      this.props.closeDoor()
    }, 3000);
    return (
      <div className='maintenance-box'>
        <h1><i className="fa fa-exclamation-triangle" aria-hidden="true"></i></h1>
        <h1>{'Happy is "Under-Construction"'}</h1>
        <h2>กรุณาเติมสินค้าและ Update ข้อมูลบน Cloud</h2>
        <h2>เมื่อทำรายการเสร็จแล้ว กรุณาปิดตู้ให้เรียบร้อย</h2>
      </div>
    );
  };

  renderApplicationStarting = () => {
    const { localStaticURL } = this.props;
    return (
      <div style={{ display: 'flex', width: '1080px', height: '1920px' }}>
        <img
          style={{ width: '100%' }}
          src={`${localStaticURL}/images/app-loading.gif`}
        />
      </div>
    );
  }

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
      isMaintenace,
      baseURL,
      location,
      appReady,
      scanCode,
      modal,
      switchLanguageTo,
      openDoor,
      closeDoor,
      lang
    } = this.props;
    return (
      <div className="smart-vending-machine-app">
        {!appReady && isMaintenace && this.renderMaintenanceMode()}
        {!appReady && !isMaintenace && this.renderApplicationStarting()}
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
            <Layout.Footer mediaRef={el => this.mediaPlayer = el} />
            {process.env.NODE_ENV !== 'production' && <DevToolbar />}
          </div>
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
