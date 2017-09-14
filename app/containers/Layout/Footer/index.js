import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MediaPlayer from '../../../components/MediaPlayer';

// ======================================================
// Selectors
// ======================================================
import MasterappSelector from '../../../selectors/masterapp';

const mapStateToProps = state => ({
  stripAds: state.masterdata.stripAds,
  baseURL: MasterappSelector.getBaseURL(state.masterapp),
});

const actions = {
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class Footer extends Component {

  static propTypes = {
    stripAds: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }

  render() {
    const {
      stripAds
    } = this.props;
    return (
      <div className="footer-section">
        <div className="copy">
          <p>© 2017 ใจดี มินิมาร์ท</p>
        </div>
        <div className="signage">
          <MediaPlayer
            width={1080}
            height={860}
            sources={stripAds}
          />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
