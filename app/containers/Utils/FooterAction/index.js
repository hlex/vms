// @flow
import React, { Component } from 'react';
import type { Children } from 'react';
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

class App extends Component {
  props: {
    children: Children,
    back: Function
  };

  render() {
    const { back } = this.props;
    return (
      <div className="action-back">
        <a
          className="button purple M"
          onClick={back}
        >
          <i className="fa fa-chevron-left" />ย้อนกลับ
        </a>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
