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

import lineId from '../../../images/line-id.png';

const mapStateToProps = state => ({
  baseURL: MasterappSelector.getBaseURL(state.masterapp),
  selectedEvent: OrderSelectors.getSelectedEvent(state.order),
  nextInput: OrderSelectors.getEventNextInput(state.order),
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

  renderInputMSISDN = () => (
    <div className="input-msisdn-box-wrapper">
      <div className="input-msisdn-box">
        <div className="content _center">
          <h2>ใส่ เบอร์มือถือ ของคุณ</h2>
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

  renderInputEmail = () => (
    <div className="input-msisdn-box-wrapper">
      <div className="input-msisdn-box">
        <div className="content _center">
          <h2>ใส่ อีเมล ของคุณ</h2>
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

  renderInputLineId = () => {
    const { submitPlayEvent } = this.props;
    return (
      <div className="event-lineid-box">
        <img alt="line" src={lineId} />
        <div className="desc">
          <h2>กรุณาแสกน LINE QR CODE</h2>
          <p>เมื่อได้รับรหัสส่วนลดแล้ว กดปุ่มทำรายการต่อ</p>
        </div>
        <a className="button blue submit-button _hidden" onClick={submitPlayEvent}>
          <p className="fade-flash">ทำรายการต่อ </p>
        </a>
      </div>
    );
  };

  renderInputBarcode = () => {
    const { baseURL } = this.props;
    return (
      <div className="event-lineid-box">
        <img alt="line" src={`${baseURL}/images/icon-barcode.png`} />
        <div className="desc">
          <h2>กรุณาแสกน BARCODE ที่ได้รับมา</h2>
        </div>
      </div>
    );
  };

  renderInputQrcode = () => {
    const { nextInput } = this.props;
    const { baseURL } = this.props;
    const message = nextInput === 'LINE_QR_CODE'
    ? 'กรุณาแสกน LINE QR CODE ของท่าน'
    : 'กรุณาแสกน QR CODE ที่ได้รับมา';
    return (
      <div className="event-lineid-box">
        <img alt="line" src={`${baseURL}/images/icon-qrcode.png`} />
        <div className="desc">
          <h2>{message}</h2>
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
    } else if (nextInput === 'LINE_QR_CODE' || 'QR_CODE') {
      return this.renderInputQrcode();
    }
    return '';
  };

  render() {
    console.log(this);
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
