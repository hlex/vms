import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// ======================================================
// Actions
// ======================================================
import * as ApplicationActions from '../../../actions/applicationActions';

const mapStateToProps = state => ({});

const actions = {
  ...ApplicationActions,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class FullScreen extends Component {

  static propTypes = {
  }

  render() {
    return (
      <div className="fullscreen-wrapper">
        {
          this.props.children
        }
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FullScreen);
