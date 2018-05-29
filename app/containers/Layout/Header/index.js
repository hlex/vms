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

  renderHeader = () => {
    const { lang } = this.props;
    if (lang === 'th') {
      return (
        <h2>
        <span>ยินดีต้อนรับ</span> กรุณาใช้นิ้วเดียวสัมผัสหน้าจอ
      </h2>
      );
    }
    return (
      <h2>
        <span>Welome</span> Use a single touch to select
      </h2>
    );
  }

  renderHomeButton = () => {
    const { lang } = this.props;
    if (lang === 'th') {
      return 'หน้าหลัก';
    }
    return 'Home';
  }

  render() {
    const { backToHome, baseURL } = this.props;
    return (
      <div className="vms-header">
        <div className="header">
          <div className="tooltip">
            {
              this.renderHeader()
            }
            <i>
              <img src={`${baseURL}/images/icon-tuch.png`} />
            </i>
          </div>
          <div className="nav-button-group">
            <a className="button yellow" onClick={backToHome}>
              <i className="home">&nbsp;</i>{this.renderHomeButton()}
            </a>
            {this.renderLanguageButton()}
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
