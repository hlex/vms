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
import MobileTopupSelectors from '../../../selectors/mobileTopup';

const mapStateToProps = (state) => {
  return {
    banner: MobileTopupSelectors.getBannerSrc(state.mobileTopup),
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
    banner: PropTypes.string.isRequired,
    confirmMobileTopupMSISDN: PropTypes.func.isRequired,
  }

  render() {
    console.log('InputMSISDNPage', this.props);
    const { banner, confirmMobileTopupMSISDN } = this.props;
    return (
      <div className="input-msisdn">
        <Layout.Title>
          <ProductTitle
            title={'เติมเงินมือถือ'}
            bgImage={banner}
          />
        </Layout.Title>
        <Layout.Content>
          <div className="input-msisdn-box">
            <div className="content">
              <p>ท่านเลือกเครือข่าย AIS one2call</p>
              <h2>ใส่เบอร์มือถือที่ต้องการเติมเงิน</h2>
              <div className="input-box">
                <InputWithPad
                  type={'num'}
                  onConfirm={confirmMobileTopupMSISDN}
                />
                <p className="sm"><small>กรุณาตรวจสอบหมายเลขโทรศัพท์ให้ถูกต้อง</small></p>
                <p className="sm _unpadding"><small>สัมผัสช่องว่างแป้นพิมพ์จะปรากฏ</small></p>
              </div>
            </div>
          </div>
          <a
            style={{ position: 'absolute', bottom: '40px', left: '80px' }}
            className="button purple M"
            onClick={this.handleBack}
          >
            <i className="fa fa-chevron-left" />ย้อนกลับ
          </a>
        </Layout.Content>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InputMSISDNPage);
