import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// ======================================================
// Hoc
// ======================================================
import withAudio from '../../hoc/withAudio';
// ======================================================
// Components
// ======================================================
import { Thankyou } from '../../components';
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
      <Thankyou baseURL={baseURL} />
    );
  }
}

export default withAudio({ src: 'http://localhost:8888/vms/html-v2/voice/5.m4a' })(connect(mapStateToProps, mapDispatchToProps)(TopupProviderSelectionPage));
