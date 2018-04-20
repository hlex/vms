import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// ======================================================
// Containers
// ======================================================
import { FooterAction } from '../../Utils';
// ======================================================
// Components
// ======================================================
import { Layout, EventTitle, InputWithPad } from '../../../components';
// ======================================================
// Actions
// ======================================================
import * as ApplicationActions from '../../../actions/applicationActions';
import * as Actions from './actions';
// ======================================================
// Selectors
// ======================================================
import MasterappSelector from '../../../selectors/masterapp';
import OrderSelectors from '../../../selectors/order';
// ======================================================
// Helpers
// ======================================================
import { isEmpty } from '../../../helpers/global';

import lineId from '../../../images/qrcode.png';
import iconBarcode from '../../../images/icon-barcodebig.png';
import iconLineQrcode from '../../../images/icon-qrcode-scan-line.png';
import iconQrcode from '../../../images/icon-qrcode-scan.png';

const mapStateToProps = state => ({
  baseURL: MasterappSelector.getLocalURL(state.masterapp),
  selectedEvent: OrderSelectors.getSelectedEvent(state.order),
  nextInput: OrderSelectors.getEventNextInput(state.order),
  nextInputOrder: OrderSelectors.getEventNextInputOrder(state.order),
});

const actions = {
  ...ApplicationActions,
  ...Actions,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class EventPlayPage extends Component {
  static propTypes = {
    baseURL: PropTypes.string.isRequired,
    selectedEvent: PropTypes.shape({}),
    nextInput: PropTypes.string,
    submitPlayEvent: PropTypes.func.isRequired,
    updateEventInput: PropTypes.func.isRequired,
  };

  static defaultProps = {
    selectedEvent: {},
    nextInput: '',
  };

  componentWillReceiveProps = nextProps => {
    const { submitPlayEvent } = this.props;
    if (isEmpty(nextProps.nextInput)) submitPlayEvent();
  };

  handleSubmitPage = inputValue => {
    const { nextInput, updateEventInput } = this.props;
    // ======================================================
    // Update nextInput
    // ======================================================
    updateEventInput(nextInput, inputValue);
  };

  renderInputMSISDN = () => {
    const { nextInputOrder } = this.props;
    return (
      <div className="input-msisdn-box-wrapper">
        <div className="input-msisdn-box">
          <div className="content _center">
            <h2>{`${nextInputOrder} ใส่ เบอร์มือถือ ของคุณ`}</h2>
            <p className="sm">
              <small>กรุณาตรวจสอบ หมายเลขโทรศัพท์ ให้ถูกต้อง</small>
            </p>
            <InputWithPad
              type={'num'}
              rules={{
                required: 'กรุณาระบุหมายเลขโทรศัพท์',
                mobileNumber: 'รูปแบบหมายเลขโทรศัพท์ไม่ถูกต้อง',
              }}
              onConfirm={this.handleSubmitPage}
            />
          </div>
        </div>
      </div>
    );
  }

  renderInputEmail = () => {
    const { nextInputOrder } = this.props;
    return (
      <div className="input-msisdn-box-wrapper">
        <div className="input-msisdn-box">
          <div className="content _center">
            <h2>{`${nextInputOrder} ใส่ อีเมล ของคุณ`}</h2>
            <p className="sm">
              <small>กรุณาตรวจสอบ อีเมล ให้ถูกต้อง</small>
            </p>
            <InputWithPad
              type={'keyboard'}
              rules={{
                required: 'กรุณาระบุอีเมล',
                email: 'รูปแบบอีเมลไม่ถูกต้อง',
              }}
              isFixed
              onConfirm={this.handleSubmitPage}
            />
          </div>
        </div>
      </div>
    );
  }

  renderInputLineId = () => {
    const { nextInputOrder } = this.props;
    return (
      <div className="event-box">
        <div className="step-content">
          <img alt="lineId" src={lineId} />
          <div className="desc">
            <h2>{`${nextInputOrder} กรุณาแสกน LINE QR CODE`}</h2>
            <h3>เพื่อเพิ่มเพื่อนใน LINE ID และ ทำรายการต่อใน LINE</h3>
          </div>
        </div>
      </div>
    );
  };

  renderInputBarcode = () => {
    const { baseURL, nextInputOrder } = this.props;
    return (
      <div className="event-box">
        <div className="row">
          <div className="D-8">
            <div className="step-content">
              <img alt="iconBarcode" src={iconBarcode} />
              <div className="desc">
              <h2>{`${nextInputOrder} กรุณาแสกน BARCODE ที่ได้รับมา`}</h2>
              </div>
            </div>
          </div>
          <div className="D-4">
            <div
              className="payment-confirmation"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '500px'
              }}
            >
              <div className="insert-cash-box">
                <div className="insert-cash-sign">
                  <div className="animation-x bounce">
                    <img src={`${baseURL}/static/images/icon-point-left.png`} alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderInputQrcode = () => {
    const { baseURL, nextInputOrder } = this.props;
    const message = 'กรุณาแสกน QR CODE ที่ได้รับมา';
    return (
      <div className="event-box">
        <div className="row">
          <div className="D-8">
            <div className="step-content">
              <img alt="line" src={iconQrcode} />
              <div className="desc">
                <h2>{`${nextInputOrder} ${message}`}</h2>
              </div>
            </div>
          </div>
          <div className="D-4">
            <div
              className="payment-confirmation"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '500px'
              }}
            >
              <div className="insert-cash-box">
                <div className="insert-cash-sign">
                  <div className="animation-x bounce">
                    <img src={`${baseURL}/static/images/icon-point-left.png`} alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderInputLineQrcode = () => {
    const { baseURL, nextInputOrder } = this.props;
    const message = 'กรุณาแสกน LINE QR CODE ของท่าน';
    return (
      <div className="event-box">
        <div className="row">
          <div className="D-8">
            <div className="step-content">
              <img alt="lineId" src={iconLineQrcode} />
              <div className="desc">
                <h2>{`${nextInputOrder} ${message}`}</h2>
              </div>
            </div>
          </div>
          <div className="D-4">
            <div
              className="payment-confirmation"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '500px'
              }}
            >
              <div className="insert-cash-box">
                <div className="insert-cash-sign">
                  <div className="animation-x bounce">
                    <img src={`${baseURL}/static/images/icon-point-left.png`} alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderInputUI = () => {
    const { nextInput } = this.props;
    if (nextInput === 'EMAIL') {
      return this.renderInputEmail();
    } else if (nextInput === 'MSISDN') {
      return this.renderInputMSISDN();
    } else if (nextInput === 'LINE_ID') {
      return this.renderInputLineId();
    } else if (nextInput === 'BARCODE') {
      return this.renderInputBarcode();
    } else if (nextInput === 'QR_CODE') {
      return this.renderInputQrcode();
    } else if (nextInput === 'LINE_QR_CODE') {
      return this.renderInputLineQrcode();
    }
    return '';
  };

  render() {
    const { baseURL, selectedEvent, nextInput } = this.props;
    return (
      <div className="input-msisdn">
        <Layout.Title>
          <EventTitle title={'เล่นกิจกรรมรับส่วนลด'} item={selectedEvent} baseURL={baseURL} />
        </Layout.Title>
        <Layout.Content>
          {this.renderInputUI()}
          <FooterAction />
        </Layout.Content>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventPlayPage);
