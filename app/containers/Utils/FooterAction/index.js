// @flow
import React, { Component } from 'react';
import type { Children } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// ======================================================
// Actions
// ======================================================
import * as ApplicationActions from '../../../actions/applicationActions';
// ======================================================
// Selectors
// ======================================================
import * as OrderSelector from '../../../selectors/order';

const mapStateToProps = state => {
  return {
    isEventOrder: OrderSelector.verifyIsEventOrder(state.order)
  };
};

const actions = {
  ...ApplicationActions,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class App extends Component {
  props: {
    children: Children,
    back: Function,
    isEventOrder: boolean
  };

  render() {
    const { isEventOrder, back } = this.props;
    return (
      <div className="action-back">
        {
          !isEventOrder &&
          <a
            className="button purple M"
            onClick={back}
          >
            <i className="fa fa-chevron-left" />ย้อนกลับ
          </a>
        }
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
