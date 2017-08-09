import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Header extends Component {

  static propTypes = {
    backToHome: PropTypes.func.isRequired,
    baseURL: PropTypes.string.isRequired,
  }

  render() {
    const { backToHome, baseURL } = this.props;
    return (
      <div className="vms-header">
        <div className="header">
          <div className="tooltip">
            <h2>
              <span>ยินดีต้อนรับ</span> ใช้ระบบสัมผัสในการเลือก
            </h2>
            <i>
              <img src={`${baseURL}/images/icon-tuch.png`} />
            </i>
          </div>
          <div className="nav-button-group">
            <a className="button yellow" onClick={backToHome}>
              <i className="home">&nbsp;</i>หน้าหลัก
            </a>
            <a className="button">English</a>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
