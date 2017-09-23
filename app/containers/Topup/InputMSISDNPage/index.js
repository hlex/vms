import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// ======================================================
// Components
// ======================================================
import {
  Layout,
  ProductTitle,
  InputWithPad,
} from '../../../components';
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

const mapStateToProps = (state) => {
  return {
    MSISDN: OrderSelectors.getTopupMSISDN(state.order),
    topupProviderName: OrderSelectors.getMobileTopupName(state.order),
    banner: OrderSelectors.getMobileTopupBanner(state.order),
    baseURL: MasterappSelector.getBaseURL(state.masterapp),
  };
};

const actions = {
  ...ApplicationActions,
  ...Actions,
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(actions, dispatch);
};


class InputMSISDNPage extends Component {

  static propTypes = {
    baseURL: PropTypes.string.isRequired,
    banner: PropTypes.string.isRequired,
    MSISDN: PropTypes.string.isRequired,
    topupProviderName: PropTypes.string.isRequired,
    confirmMobileTopupMSISDN: PropTypes.func.isRequired,
    back: PropTypes.func.isRequired,
  }

  render() {
    console.log('InputMSISDNPage', this.props);
    const { baseURL, banner, topupProviderName, confirmMobileTopupMSISDN, MSISDN, back } = this.props;
    return (
      <div className="input-msisdn">
        <Layout.Title>
          <ProductTitle
            title={'เติมเงินมือถือ'}
            bgImage={banner}
            baseURL={baseURL}
          />
        </Layout.Title>
        <Layout.Content>
          <div className="input-msisdn-box-wrapper">
            <div className="input-msisdn-box">
              <div className="content _center">
                <p>ท่านเลือกเครือข่าย {topupProviderName}</p>
                <h2>ใส่เบอร์มือถือที่ต้องการเติมเงิน</h2>
                <p className="sm"><small>กรุณาตรวจสอบหมายเลขโทรศัพท์ให้ถูกต้อง</small></p>
                <InputWithPad
                  show
                  type={'num'}
                  rules={{
                    required: 'กรุณาระบุหมายเลขโทรศัพท์',
                    mobileNumber: 'รูปแบบหมายเลขโทรศัพท์ไม่ถูกต้อง'
                  }}
                  value={MSISDN}
                  onConfirm={confirmMobileTopupMSISDN}
                />
              </div>
            </div>
          </div>
          <div className="action-back">
            <a
              className="button purple M"
              onClick={back}
            >
              <i className="fa fa-chevron-left" />ย้อนกลับ
            </a>
          </div>
        </Layout.Content>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InputMSISDNPage);
