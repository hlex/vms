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
import * as ApplicationActions from '../../actions/applicationActions';

const mapStateToProps = (state) => {
  return {
    baseURL: MasterappSelector.getBaseURL(state.masterapp),
  };
};

const actions = {
  ...ApplicationActions
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

export default withAudio({ src: `http://localhost:${process.env.NODE_ENV !== 'production' ? '8888' : '81'}/vms/static/voice/6.m4a` }, actions)(connect(mapStateToProps, mapDispatchToProps)(TopupProviderSelectionPage));
