import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

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
import MobileTopupSelectors from '../../../selectors/mobileTopup';

const mapStateToProps = (state) => {
  return state;
};

const actions = {
  ...ApplicationActions,
  ...Actions,
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(actions, dispatch);
};


class SelectTopupValuePage extends Component {

  renderMobileTopupValue = (mobileTopupValue) => {
    const value = mobileTopupValue.value;
    const feeText = mobileTopupValue.fee === '0' || mobileTopupValue.fee === 0 ? 'ไม่มีค่าบริการ' : `ค่าบริการ ${mobileTopupValue.fee} บาท`;
    return (
      <li>
        <a><span>{`${value} บาท`}</span><small>{`${feeText}`}</small></a>
      </li>
    );
  }

  render() {
    const mobileTopupValues = [
      {
        id: 1,
        value: '20',
        fee: '2',
      },
      {
        id: 2,
        value: '50',
        fee: '1',
      },
      {
        id: 3,
        value: '100',
        fee: '0',
      },
      {
        id: 4,
        value: '150',
        fee: '0',
      },
      {
        id: 1,
        value: '200',
        fee: '0',
      },
      {
        id: 1,
        value: '250',
        fee: '0',
      },
      {
        id: 1,
        value: '300',
        fee: '0',
      },
      {
        id: 1,
        value: '350',
        fee: '0',
      },
      {
        id: 1,
        value: '400',
        fee: '0',
      },
      {
        id: 1,
        value: '500',
        fee: '0',
      },
    ];
    return (
      <div className="select-mobile-topup-value">
        <Layout.ContentLong>
          <div className="_center">
            <h1>เติมเงินมือถือ</h1>
            <hr />
          </div>
          <div className="page-container">
            <Jumbotron>
              <p>ท่านเลือกเครือข่าย AIS one2call</p>
              <h2>ใส่เบอร์มือถือที่ต้องการเติมเงิน</h2>
              <div className="msisdn">088-185-9067</div>
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
          <a
            style={{ position: 'absolute', bottom: '240px', left: '40px' }}
            className="button purple M"
            onClick={this.handleBack}
          >
            <i className="fa fa-chevron-left" />ย้อนกลับ
          </a>
          <div className="_center">
            <a
              className="button blue submit-button"
              onClick={this.handleSubmit}
            >
              <p className="fade-flash">ยืนยัน</p>
            </a>
          </div>
        </Layout.ContentLong>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectTopupValuePage);
