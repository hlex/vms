// @flow
import React, { Component } from 'react';
import type { Children } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import connectivity from 'connectivity'
import moment from 'moment';
// ======================================================
// Analytics
// ======================================================
import Analytics from '../analytics/thep';
// ======================================================
// Components
// ======================================================
import Modal from '../components/Modal';
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
    modal: state.modal,
    location: state.router.location,
    localStaticURL: MasterappSelector.getLocalStaticURL(state.masterapp),
    baseURL: MasterappSelector.getBaseURL(state.masterapp),
    appReady: MasterappSelector.verifyAppReady(state.masterapp),
    isMaintenance: MasterappSelector.verifyIsMaintenanceMode(state.masterapp),
    isHardwareMalfunction: MasterappSelector.verifyIsHardwareMalfunction(state.masterapp),
    isPaymentSystemMalfunction: MasterappSelector.verifyIsPaymentSystemMalfunction(state.masterapp),
    modal: state.modal,
    lang: MasterappSelector.getLanguage(state.masterapp),
    verifiedSalesman: MasterappSelector.getVerifiedSalesman(state.masterapp)
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
    appReady: boolean,
    startRecordEvent: Function
  };

  state = {
    isOnline: true
  }

  componentWillMount = () => {
    const { initApplication } = this.props;
    initApplication();
  };

  componentDidMount = () => {
    setInterval(() => {
      connectivity((online) => {
        const { isOnline } = this.state;
        if (isOnline !== online) {
          console.log('[connectivity] prev', isOnline, 'curr', online);
          if (isOnline === false && online === true) {
            this.props.startRecordEvent('INTERNET_LOST', {
              localTime: moment().format('YYYY-MM-DD HH:mm:ss')
            });
          }
          this.setState({
            isOnline: online
          });
        }
      });
    }, 5000);
  }

  renderHardwareMalfunctionMode = () => {
    return (
      <div className='maintenance-box'>
        <h1><i className="fa fa-exclamation-triangle" aria-hidden="true"></i></h1>
        <h1>{'Happy Box is "Closed"'}</h1>
          <div style={{ textAlign: 'center' }}>
            <h2>ไม่สามารถเชื่อมต่อระบบ Hardware ได้</h2>
            <h2>กรุณาติดต่อ 065-552-4352</h2>
          </div>
      </div>
    );
  }

  renderMaintenanceMode = () => {
    const { verifiedSalesman, closeDoor } = this.props
    if (process.env.NODE_ENV !== 'production') {
      setTimeout(() => {
        this.props.closeDoor()
      }, 3000);
    }
    return (
      <div className='maintenance-box'>
        <h1><i className="fa fa-exclamation-triangle" aria-hidden="true"></i></h1>
        <h1>{'Happy Box is "Under-Construction"'}</h1>
        {
          verifiedSalesman
          ?
          <div style={{ textAlign: 'center' }}>
            <h2>กรุณาเติมสินค้าและ Update ข้อมูลบน Cloud</h2>
            <h2>เมื่อทำรายการเสร็จแล้ว กรุณาปิดตู้ให้เรียบร้อย</h2>
          </div>
          :
          <div style={{ textAlign: 'center' }}>
            <h2>ท่านกำลังเปิดตู้โดยไม่ได้รับอนุญาติ</h2>
            <h2>กรุณาปิดตู้ให้เรียบร้อย และทำรายการใหม่ให้ถูกต้อง</h2>
          </div>
        }
      </div>
    );
  };

  renderApplicationStarting = () => {
    const { localStaticURL } = this.props;
    return (
      <div style={{ display: 'flex', width: '1080px', height: '1920px' }}>
        <AlertMessage />
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
    if (this.mediaPlayer && this.mediaPlayer !== null) this.mediaPlayer.handleTouchMedia();
  };

  handleSwitchLanguage = oppositeLang => {
    const { switchLanguageTo } = this.props;
    switchLanguageTo(oppositeLang);
    if (this.mediaPlayer && this.mediaPlayer !== null) this.mediaPlayer.handleTouchMedia();
  };

  renderApplication = () => {
    const { isOnline } = this.state
    const { modal, cancelPayment, lang, baseURL, localStaticURL, appReady, isMaintenance, isHardwareMalfunction, isPaymentSystemMalfunction } = this.props;
    if (appReady) {
      return (
        <div className="smart-vending-machine-app-connected">
          <Modal
            show={modal.type.cashChangeError}
            options={{
              className: {
                margin: '0 auto',
                top: '50%',
                transform: 'translateY(-50%)'
              },
            }}
          >
            <div className="app-error">
              <h2>ขออภัย ไม่สามารถทอนเงินได้</h2>
              <small>เนื่องจากมีเหรียญไม่เพียงพอให้บริการ</small>
              <p>กรุณาใส่เงินให้พอดีราคาสินค้า</p>
              <button onClick={cancelPayment} className="button purple">ทำรายการใหม่</button>
              <p className="or">หรือ</p>
              <button onClick={cancelPayment} className="button purple" style={{ width: '250px' }}>กดเพื่อเลือกสินค้าชนิดอื่น</button>
            </div>
          </Modal>
          <Modal
            show={!isOnline}
            options={{
              overlay: false,
              className: {
                margin: '0 auto',
                top: '50%',
                transform: 'translateY(-50%)'
              },
            }}
          >
            <div className="app-error">
              <div>
                <h1 className='color-purple'><i className="fa fa-exclamation-triangle" aria-hidden="true"></i></h1>
                <h2 className='color-red'>ระบบไม่ได้เชื่อมต่ออินเทอร์เน็ต</h2>
                <h3>ไม่สามารถทำรายการได้</h3>
                <h3>กรุณารอสักครู่ หรือ ติดต่อ 065-552-4352</h3>
                <br />
                <br />
              </div>
            </div>
          </Modal>
          <Modal
            show={isPaymentSystemMalfunction}
            options={{
              overlay: false,
              className: {
                margin: '0 auto',
                top: '50%',
                transform: 'translateY(-50%)'
              },
            }}
          >
            <div className="app-error">
              <div>
                <h1 className='color-purple'><i className="fa fa-exclamation-triangle" aria-hidden="true"></i></h1>
                <h2 className='color-red'>ระบบ ไม่สามารถ จำหน่ายสินค้าได้ชั่วคราว</h2>
                <h3>กรุณารอสักครู่ หรือ ติดต่อ 065-552-4352</h3>
                <br />
                <br />
              </div>
            </div>
          </Modal>
          <AlertMessage />
          <LoadingScreen />
          <Layout.Header
            lang={lang}
            switchLanguageTo={this.handleSwitchLanguage}
            backToHome={this.handleClickHome}
            baseURL={localStaticURL}
          />
          {this.props.children}
          <Layout.Footer mediaRef={el => this.mediaPlayer = el} />
          {process.env.NODE_ENV !== 'production' && <DevToolbar />}
        </div>
      )
    }
    if (isHardwareMalfunction) return this.renderHardwareMalfunctionMode()
    if (isMaintenance)  return this.renderMaintenanceMode()
    return this.renderApplicationStarting()
  }

  render() {
    const {
      setResetTimer,
      backToHome,
      isMaintenance,
      isHardwareMalfunction,
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
      <div className="smart-vending-machine-app" onClick={setResetTimer}>
        {this.renderApplication()}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
