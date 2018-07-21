import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ApplicationActions from '../../actions/applicationActions';

const mapStateToProps = state => state;

const actions = {
  ...ApplicationActions
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class DevToolbar extends Component {
  render() {
    const { resetApplication, insertCoin, scanCode, openDoor, closeDoor } = this.props;
    return (
      <div className="development-toolbar">
        <ul>
          <li>
            <a onClick={() => resetApplication()}>RESET</a>
          </li>
          <li>
            <a onClick={() => insertCoin(1)}>1B</a>
          </li>
          <li>
            <a onClick={() => insertCoin(5)}>5B</a>
          </li>
          <li>
            <a onClick={() => insertCoin(10)}>10B</a>
          </li>
          <li>
            <a onClick={() => insertCoin(20)}>20B</a>
          </li>
          <li>
            <a onClick={() => insertCoin(50)}>50B</a>
          </li>
          <li>
            <a onClick={() => insertCoin(100)}>100B</a>
          </li>
          <li>
            <a onClick={() => scanCode('10RV59E')}>QR</a>
          </li>
          <li>
            <a onClick={() => scanCode('2048486920593')}>BC</a>
          </li>
          <li>
            <a onClick={() => scanCode(`http://line.me/th/q/_${Date.now()}`)}>LINE</a>
          </li>
        </ul>
        <br />
        <ul>
          <li>
            <a onClick={() => openDoor()}>OPEN DOOR</a>
          </li>
          <li>
            <a onClick={() => closeDoor()}>CLOSE DOOR</a>
          </li>
        </ul>
      </div>
    );
  }
}

DevToolbar.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(DevToolbar);
