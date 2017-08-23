// @flow
import React, { Component } from 'react';
import type { Children } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Layout, Modal } from '../components';
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
import { createTcpClient } from '../apis/tcp';

const mapStateToProps = state => ({
  location: state.router.location,
  baseURL: MasterappSelector.getBaseURL(state.masterapp),
  tcp: MasterappSelector.getTcp(state.masterapp),
  modal: state.modal,
});

const actions = {
  ...ApplicationActions,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class App extends Component {
  props: {
    children: Children,
    tcp: Object,
    baseURL: string,
    location: Object,
    backToHome: Function,
    initTcpClient: Function
  };

  componentWillMount = () => {
    const { tcp: { ip, port }, initTcpClient } = this.props;
    initTcpClient(createTcpClient(ip, port));
  };

  render() {
    const { backToHome, baseURL, location, insetCoin, modal } = this.props;
    console.log('App@render', this.props);
    return (
      <div className="smart-vending-machine-app">
        {location.pathname}
        <Layout.Header backToHome={backToHome} baseURL={baseURL} />
        {this.props.children}
        <Layout.Footer />
        {
          process.env.NODE_ENV !== 'production' &&
          <div className="development-toolbar">
            <ul>
              <li><a onClick={() => insetCoin(1)}>1B</a></li>
              <li><a onClick={() => insetCoin(5)}>5B</a></li>
              <li><a onClick={() => insetCoin(10)}>10B</a></li>
              <li><a onClick={() => insetCoin(20)}>20B</a></li>
              <li><a onClick={() => insetCoin(50)}>50B</a></li>
              <li><a onClick={() => insetCoin(100)}>100B</a></li>
            </ul>
          </div>
        }
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
