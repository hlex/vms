import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// ======================================================
// Components
// ======================================================
import { MediaPlayer } from '../../../components';
// ======================================================
// Selectors
// ======================================================
import MasterappSelector from '../../../selectors/masterapp';

const mapStateToProps = (state) => {
  return {
    footerAds: state.ads.footerAds,
    baseURL: MasterappSelector.getBaseURL(state.masterapp),
  };
};

const actions = {
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class Footer extends Component {

  static propTypes = {
    location: PropTypes.shape({}).isRequired,
    footerAds: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }

  shouldHideSignage = () => {
    const { location } = this.props;
    const blacklist = ['/event', '/product'];
    return _.includes(blacklist, location.pathname);
  }

  render() {
    console.log(this);
    const {
      footerAds
    } = this.props;
    return (
      <div className="footer-section">
        <div className="copy">
          <p>© 2017 ใจดี มินิมาร์ท</p>
        </div>
        {
          !this.shouldHideSignage() &&
          <div className="signage">
            <MediaPlayer
              width={1080}
              height={610}
              sources={footerAds}
            />
          </div>
        }
      </div>
    );
  }
}

const connectedContainer = connect(mapStateToProps, mapDispatchToProps)(Footer);
export default withRouter(connectedContainer);
