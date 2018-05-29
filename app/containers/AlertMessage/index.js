import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

// ======================================================
// Actions
// ======================================================
import * as ApplicationActions from '../../actions/applicationActions';

// ======================================================
// Components
// ======================================================
import Modal from '../../components/Modal';

// ======================================================
// Selectors
// ======================================================
import MasterappSelector from '../../selectors/masterapp';

const mapStateToProps = (state) => {
  return {
    ...state.alertMessage,
    lang: MasterappSelector.getLanguage(state.masterapp),
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
    messages: PropTypes.shape({}).isRequired,
    lang: PropTypes.string.isRequired,
    closeAlertMessage: PropTypes.func.isRequired,
  }

  render() {
    const { show, messages, lang, closeAlertMessage, shutdownApplication } = this.props;
    const hasTitle = messages && messages.title && messages.title !== '';
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
          {
            hasTitle &&
            <div>
              <h2>{_.get(messages, 'title', '')}</h2>
              <h3>{_.get(messages, lang, '')}</h3>
              <br />
              <br />
            </div>
          }
          {
            !hasTitle && <h2>{_.get(messages, lang, '')}</h2>
          }
          {
            _.get(messages, 'title', '') !== 'Happy Box is "Under-Construction"' &&
            <button onClick={closeAlertMessage} className="button purple">ตกลง</button>
          }
        </div>
      </Modal>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AlertMessage);
