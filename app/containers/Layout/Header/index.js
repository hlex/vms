import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Header extends Component {

  static propTypes = {
    backToHome: PropTypes.func.isRequired,
    baseURL: PropTypes.string.isRequired,
    switchLanguageTo: PropTypes.func.isRequired,
    lang: PropTypes.string,
  }

  static defaultProps = {
    lang: 'th'
  }

  renderLanguageButton = () => {
    const { lang, switchLanguageTo } = this.props;
    const oppositeLang = lang === 'th' ? 'en' : 'th';
    let buttonLang;
    switch (oppositeLang) {
      case 'th':
        buttonLang = 'Thai';
        break;
      case 'en':
        buttonLang = 'English';
        break;
      default:
        buttonLang = 'English';
        break;
    }
    return (
      <a className="button" onClick={() => switchLanguageTo(oppositeLang)}>{buttonLang}</a>
    );
  }

  render() {
    const { backToHome, baseURL } = this.props;
    return (
      <div className="vms-header">
        <div className="header">
          <div className="tooltip">
            <h2>
              <span>ยินดีต้อนรับ</span> ใช้นิ้วเดียวสัมผัสในการเลือก
            </h2>
            <i>
              <img src={`${baseURL}/images/icon-tuch.png`} />
            </i>
          </div>
          <div className="nav-button-group">
            <a className="button yellow" onClick={backToHome}>
              <i className="home">&nbsp;</i>หน้าหลัก
            </a>
            {this.renderLanguageButton()}
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
