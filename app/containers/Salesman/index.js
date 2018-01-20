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
const mapStateToProps = (state) => {
  return {
    baseURL: MasterappSelector.getBaseURL(state.masterapp),
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
          />
        </Layout.Title>
        <Layout.Content>
          <div className="event-box">
            <img alt="line" src={`${baseURL}/images/icon-qrcode.png`} />
            <div className="desc">
              <h2>{'กรุณา Scan QR CODE (รหัสพนักงาน)'}</h2>
              <h3>{'เพื่อตรวจสอบรหัส และปลดล็อคตู้'}</h3>
            </div>
          </div>
          <FooterAction />
        </Layout.Content>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopupProviderSelectionPage);
