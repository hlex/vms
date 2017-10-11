// @flow
import React, { Component } from 'react';
import type { Children } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal } from '../components';
import Layout from '../containers/Layout';
// ======================================================
// Actions
// ======================================================
import * as ApplicationActions from '../actions/applicationActions';
// ======================================================
// Selectors
// ======================================================
import MasterappSelector from '../selectors/masterapp';
// ======================================================
// APIs
// ======================================================

const mapStateToProps = state => ({
  location: state.router.location,
  baseURL: MasterappSelector.getBaseURL(state.masterapp),
  isConnectionEstablish: MasterappSelector.verifyConnectionEstablish(state.masterapp),
  modal: state.modal,
});

const actions = {
  ...ApplicationActions,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class App extends Component {
  props: {
    children: Children,
    baseURL: string,
    location: Object,
    backToHome: Function,
    initApplication: Function,
    isConnectionEstablish: boolean
  };

  componentWillMount = () => {
    const { initApplication } = this.props;
    initApplication();
  };

  render() {
    const { backToHome, baseURL, location, isConnectionEstablish, insetCoin, modal } = this.props;
    console.log('App@render', this.props, location.pathname);
    return (
      <div className="smart-vending-machine-app">
        {
          isConnectionEstablish &&
          <div className="smart-vending-machine-app-connected">
            <Layout.Header backToHome={backToHome} baseURL={baseURL} />
            {this.props.children}
            <Layout.Footer />
            {process.env.NODE_ENV !== 'production' && (
              <div className="development-toolbar">
                <ul>
                  <li>
                    <a onClick={() => insetCoin(1)}>1B</a>
                  </li>
                  <li>
                    <a onClick={() => insetCoin(5)}>5B</a>
                  </li>
                  <li>
                    <a onClick={() => insetCoin(10)}>10B</a>
                  </li>
                  <li>
                    <a onClick={() => insetCoin(20)}>20B</a>
                  </li>
                  <li>
                    <a onClick={() => insetCoin(50)}>50B</a>
                  </li>
                  <li>
                    <a onClick={() => insetCoin(100)}>100B</a>
                  </li>
                  <li>
                    <a onClick={() => insetCoin(500)}>500B</a>
                  </li>
                  <li>
                    <a onClick={() => insetCoin(1000)}>1000B</a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        }
        {
          !isConnectionEstablish && <div>Loading...</div>
        }
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
