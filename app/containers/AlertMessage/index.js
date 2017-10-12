import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// ======================================================
// Actions
// ======================================================
import * as ApplicationActions from '../../actions/applicationActions';

// ======================================================
// Components
// ======================================================
import Modal from '../../components/Modal';

const mapStateToProps = (state) => {
  return {
    ...state.alertMessage
  };
};

const actions = {
  ...ApplicationActions,
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(actions, dispatch);
};

class AlertMessage extends Component {

  static propTypes = {
    show: PropTypes.bool.isRequired,
    closeAlertMessage: PropTypes.func.isRequired,
  }

  render() {
    const { show, closeAlertMessage } = this.props;
    return (
      <Modal
        show={show}
        options={{
          className: {
            margin: '0 auto',
            top: '50%',
            marginTop: '-200px'
          },
        }}
      >
        <div className="app-error">
          <h2>ไม่สามารถใช้รหัสส่วนลดนี้ได้</h2>
          <p>กรุณาใส่รหัสส่วนลดที่ถูกต้องใหม่อีกครั้ง</p>
          <button onClick={closeAlertMessage} className="button purple">ตกลง</button>
        </div>
      </Modal>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AlertMessage);
