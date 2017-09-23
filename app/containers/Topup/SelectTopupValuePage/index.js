import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import cuid from 'cuid';
// ======================================================
// Components
// ======================================================
import {
  Layout,
  Jumbotron,
} from '../../../components';
// ======================================================
// Actions
// ======================================================
import * as ApplicationActions from '../../../actions/applicationActions';
import * as Actions from './actions';
// ======================================================
// Selectors
// ======================================================
import MasterdataSelectors from '../../../selectors/masterdata';
import OrderSelectors from '../../../selectors/order';

const mapStateToProps = (state) => {
  return {
    mobileTopupValues: MasterdataSelectors.getMobileTopupValues(state.masterdata),
    topupProviderName: OrderSelectors.getMobileTopupName(state.order),
    MSISDN: OrderSelectors.getTopupMSISDN(state.order),
    // selectedMobileTopupValue: OrderSelectors.getSelectedMobileTopupValue(state.order),
  };
};

const actions = {
  ...ApplicationActions,
  ...Actions,
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(actions, dispatch);
};


class SelectTopupValuePage extends Component {

  static propTypes = {
    mobileTopupValues: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    topupProviderName: PropTypes.string.isRequired,
    submitMobileTopupValue: PropTypes.func.isRequired,
    back: PropTypes.func.isRequired,
    MSISDN: PropTypes.string.isRequired,
    // selectedMobileTopupValue: PropTypes.shape({}).isRequired,
  }

  state = {
    selectedMobileTopupValue: {
      cuid: ''
    },
  }

  componentDidMount = () => {
    const { clearMobileTopupValue } = this.props;
    clearMobileTopupValue();
  }

  selectMobileTopupValue = (mobileTopupValue) => {
    // const { selectMobileTopupValue } = this.props;
    // selectMobileTopupValue(mobileTopupValue);
    this.setState({
      selectedMobileTopupValue: mobileTopupValue,
    });
  }

  renderMobileTopupValue = (mobileTopupValue) => {
    const { selectedMobileTopupValue } = this.state;
    const value = mobileTopupValue.value;
    const feeText = mobileTopupValue.fee === '0' || mobileTopupValue.fee === 0 ? 'ไม่มีค่าบริการ' : `ค่าบริการ ${mobileTopupValue.fee} บาท`;
    return (
      <li key={cuid()}>
        <a
          className={`select-pack ${selectedMobileTopupValue.cuid === mobileTopupValue.cuid ? 'current' : ''}`}
          onClick={() => this.selectMobileTopupValue(mobileTopupValue)}
        ><span>{`${value} บาท`}</span><small>{`${feeText}`}</small>
        </a>
      </li>
    );
  }

  handleSubmit = () => {
    const { selectedMobileTopupValue } = this.state;
    const { submitMobileTopupValue } = this.props;
    if (selectedMobileTopupValue.cuid !== '') {
      submitMobileTopupValue(this.state.selectedMobileTopupValue);
    }
  }

  render() {
    const { mobileTopupValues, topupProviderName, MSISDN, back } = this.props;
    let displayMSISDN = '';
    for (let i = 0; i < MSISDN.length; i += 1) {
      if (i === 3 || i === 6) displayMSISDN += '-';
      displayMSISDN += MSISDN[i];
    }
    return (
      <div className="select-mobile-topup-value">
        <Layout.ContentLong>
          <div className="_center">
            <h1>เติมเงินมือถือ</h1>
            <hr />
          </div>
          <div className="page-container">
            <Jumbotron>
              <p>ท่านเลือกเครือข่าย {topupProviderName}</p>
              <h2>ใส่เบอร์มือถือที่ต้องการเติมเงิน</h2>
              <div className="msisdn">{displayMSISDN}</div>
            </Jumbotron>
            <div className="topup-packages">
              <div className="_center">
                <p>เลือกมูลค่าที่ต้องการเติมเงิน</p>
              </div>
              <ul>
                {
                  _.map(mobileTopupValues, (mobileTopupValue) => {
                    return this.renderMobileTopupValue(mobileTopupValue);
                  })
                }
              </ul>
            </div>
          </div>
          <div className="_center">
            <a
              className="button blue submit-button"
              onClick={this.handleSubmit}
            >
              <p className="fade-flash">ยืนยัน</p>
            </a>
          </div>
          <div className="action-back">
            <a
              className="button purple M"
              onClick={back}
            >
              <i className="fa fa-chevron-left" />ย้อนกลับ
            </a>
          </div>
        </Layout.ContentLong>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectTopupValuePage);
