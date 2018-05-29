import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// ======================================================
// Hoc
// ======================================================
// import withAudio from '../../hoc/withAudio';
// ======================================================
// Containers
// ======================================================
import { FooterAction } from '../Utils';
// Components
// ======================================================
import { ProductTitle, Layout } from '../../components';
// ======================================================
// Selectors
// ======================================================
import MasterappSelector from '../../selectors/masterapp';
// ======================================================
// Actions
// ======================================================

import iconQrcode from '../../images/icon-qrcode-scan.png';

const mapStateToProps = (state) => {
  return {
    baseURL: MasterappSelector.getLocalURL(state.masterapp),
  };
};

const actions = {
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(actions, dispatch);
};


class TopupProviderSelectionPage extends Component {
  static propTypes = {
    baseURL: PropTypes.string.isRequired,
  }
  render() {
    const { baseURL } = this.props;
    return (
      <div className="">
        <Layout.Title>
          <ProductTitle
            title={'Salesman'}
            baseURL={baseURL}
            bgImage={'static/images/cover-staff.png'}
          />
        </Layout.Title>
        <Layout.Content>
          <div className="row">
            <div className="D-8">
              <div className="event-box" style={{ height: '500px', alignItems: 'center' }}>
                <img style={{ maxWidth: '150px' }} alt="line" src={iconQrcode} />
                <div className="desc">
                  <h2>{'กรุณา Scan QR CODE (รหัสพนักงาน)'}</h2>
                  <h3>{'เพื่อตรวจสอบรหัส และปลดล็อคตู้'}</h3>
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
          <FooterAction />
        </Layout.Content>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopupProviderSelectionPage);
