// @flow
import React, { Component } from 'react';
import type { Children } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Header, Footer } from '../components';

// ======================================================
// Actions
// ======================================================
import * as ApplicationActions from '../actions/applicationActions';

// ======================================================
// Selectors
// ======================================================
import MasterappSelector from '../selectors/masterapp';

const mapStateToProps = state => ({
  baseURL: MasterappSelector.getBaseURL(state.masterapp),
});

const actions = {
  ...ApplicationActions,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class App extends Component {
  props: {
    children: Children
  };

  render() {
    const { changePage, baseURL } = this.props;
    return (
      <div className="smart-vending-machine-app">
        <Header backToHome={() => changePage('')} baseURL={baseURL} />
        {this.props.children}
        <Footer />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
