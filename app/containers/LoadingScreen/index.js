import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// ======================================================
// Selectors
// ======================================================
import MasterappSelector from '../../selectors/masterapp';

// ======================================================
// Actions
// ======================================================
import * as ApplicationActions from '../../actions/applicationActions';

// ======================================================
// Components
// ======================================================
import { Loading, Modal } from '../../components';

const mapStateToProps = (state) => {
  return {
    ...state.masterapp.loading,
    baseURL: MasterappSelector.getBaseURL(state.masterapp),
  };
};

const actions = {
  ...ApplicationActions,
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(actions, dispatch);
};

class LoadingScreen extends Component {

  static propTypes = {
    show: PropTypes.bool.isRequired,
    messages: PropTypes.shape({}).isRequired,
    baseURL: PropTypes.string.isRequired,
  }

  render() {
    const { show, messages, baseURL } = this.props;
    const lang = 'th';
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
        <Loading baseURL={baseURL} text={messages[lang]} />
      </Modal>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadingScreen);
