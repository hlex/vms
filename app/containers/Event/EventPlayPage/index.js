import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// ======================================================
// Containers
// ======================================================
import {
  FooterAction
} from '../../Utils';
// ======================================================
// Components
// ======================================================
import {
  Layout,
  EventTitle,
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


class EventPlayPage extends Component {

  static propTypes = {
    baseURL: PropTypes.string.isRequired,
    submitPlayEvent: PropTypes.func.isRequired,
  }

  render() {
    console.log('EventPlayPage', this.props);
    const { baseURL, submitPlayEvent } = this.props;
    return (
      <div className="input-msisdn">
        <Layout.Title>
          <EventTitle
            title={'เล่นกิจกรรมรับส่วนลด'}
            baseURL={baseURL}
          />
        </Layout.Title>
        <Layout.Content>
          <div className="input-msisdn-box-wrapper">
            <div className="input-msisdn-box">
              <div className="content _center">
                <h2>ใส่เบอร์มือถือของคุณ</h2>
                <p className="sm"><small>กรุณาตรวจสอบหมายเลขโทรศัพท์ให้ถูกต้อง</small></p>
                <InputWithPad
                  show
                  type={'num'}
                  rules={{
                    required: 'กรุณาระบุหมายเลขโทรศัพท์',
                    mobileNumber: 'รูปแบบหมายเลขโทรศัพท์ไม่ถูกต้อง'
                  }}
                  onConfirm={submitPlayEvent}
                />
              </div>
            </div>
          </div>
          <FooterAction />
        </Layout.Content>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventPlayPage);
