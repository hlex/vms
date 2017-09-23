import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// ======================================================
// Containers
// ======================================================
import Layout from '../../Layout';
// ======================================================
// Components
// ======================================================
import { MediaPlayer, Modal } from '../../../components';
// ======================================================
// Actions
// ======================================================
import * as ApplicationActions from '../../../actions/applicationActions';
import * as Actions from './actions';
// ======================================================
// Selectors
// ======================================================
import MasterappSelector from '../../../selectors/masterapp';
import OrderSelectors from '../../../selectors/order';

const mapStateToProps = (state) => {
  return {
    stripAds: state.masterdata.stripAds,
    baseURL: MasterappSelector.getBaseURL(state.masterapp),
  };
};

const actions = {
  ...ApplicationActions,
  ...Actions,
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(actions, dispatch);
};


class EventAds extends Component {

  static propTypes = {
    baseURL: PropTypes.string.isRequired,
  }

  state = {
    adFinished: false,
  }

  handleAdsEnd = () => {
    console.log('handleAdsEnd');
    this.setState({
      adFinished: true
    });
  }

  handleNext = () => {
    const { backToHome } = this.props;
    console.log('handleNext !!!');
    backToHome();
  }

  render() {
    console.log('EventAds', this.props);
    const { adFinished } = this.state;
    const { baseURL, stripAds } = this.props;
    const sources = [_.head(stripAds)];
    return (
      <div className="event-ads">
        <Layout.FullScreen>
          <div className="count-time"><span id="set_timer" className="style colorDefinition size_sm">06 วินาที</span></div>
          <MediaPlayer
            width={1080}
            height={1920}
            sources={sources}
            onEnded={this.handleAdsEnd}
          />
          <Modal show={adFinished}>
            <div className="ads-confirm">
              <h2>รับรหัส <span className="highlight-red">เติมเงินฟรี 5 บาท</span></h2>
              <p>รับรหัสส่วนลดทาง SMS</p>
              <a
                className="button purple M"
                onClick={this.handleNext}
              >
                <i className="fa fa-check" />ยืนยัน
              </a>
            </div>
          </Modal>
        </Layout.FullScreen>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventAds);
