import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import _ from 'lodash';
// ======================================================
// Components
// ======================================================
import { MediaPlayer } from '../../../components';
// ======================================================
// Selectors
// ======================================================
import MasterappSelector from '../../../selectors/masterapp';

const mapStateToProps = state => ({
  footerAds: state.ads.footerAds,
  baseURL: MasterappSelector.getBaseURL(state.masterapp)
});

const actions = {};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class Footer extends PureComponent {
  static propTypes = {
    location: PropTypes.shape({}).isRequired,
    footerAds: PropTypes.arrayOf(PropTypes.shape({})).isRequired
  };

  shouldComponentUpdate = nextProps => {
    const { location } = this.props;
    const currentPageIsPayment = location.pathname === '/payment';
    const nextPageIsPayment = nextProps.location.pathname === '/payment';
    const currentPageIsMobileTopupProviderSelection = '/topup';
    const currentPageIsMobileTopupGroup = /topup/.test(nextProps.location.pathname);
    const nextPageIsMobileTopupGroup = /topup/.test(nextProps.location.pathname);
    if (currentPageIsPayment && nextPageIsPayment) return false;
    if (location.pathname === '/product/single' && nextPageIsPayment) return false;
    if (location.pathname === '/product/promotionSet' && nextPageIsPayment) return false;
    if (
      !currentPageIsMobileTopupProviderSelection &&
      currentPageIsMobileTopupGroup &&
      nextPageIsMobileTopupGroup
    ) { return false; }
    if (currentPageIsMobileTopupGroup && nextPageIsPayment) return false;
    return true;
  };

  shouldMuted = () => {
    const { location } = this.props;
    const url = location.pathname;
    const currentPageIsHome = url === '/';
    const muted = !currentPageIsHome;
    return muted;
  };

  shouldHideSignage = () => {
    const { location } = this.props;
    const blacklist = ['/event', '/product', '/event/ads'];
    return _.includes(blacklist, location.pathname);
  };

  render() {
    console.log(this);
    const { ref, footerAds } = this.props;
    return (
      <div className="footer-section">
        <div className="copy">
          <p>© 2017 ใจดี มินิมาร์ท</p>
        </div>
        {!this.shouldHideSignage() && (
          <div className="signage">
            <MediaPlayer
              ref={this.props.inputRef}
              width={1080}
              height={610}
              sources={footerAds}
              muted={this.shouldMuted()}
            />
          </div>
        )}
      </div>
    );
  }
}

const connectedContainer = connect(mapStateToProps, mapDispatchToProps)(Footer);
export default withRouter(connectedContainer);
