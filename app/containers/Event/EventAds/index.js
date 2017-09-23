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
    count: 0,
    adFinished: false,
  }

  handleAdsEnd = () => {
    this.setState({
      adFinished: true
    });
  }

  handleNext = () => {
    const { backToHome } = this.props;
    backToHome();
  }

  handleTicked = () => {
    this.setState({
      count: this.state.count + 1,
    });
  }

  render() {
    const { adFinished, count } = this.state;
    const { baseURL, stripAds } = this.props;
    const sources = [_.head(stripAds)];
    const maxCount = _.get(sources, '0.duration', 0);
    const remainingCount = maxCount - count;
    return (
      <div className="event-ads">
        <Layout.FullScreen>
          { remainingCount > 0 && <div className="count-time"><span id="set_timer" className="style colorDefinition size_sm">{maxCount - count} วินาที</span></div> }
          <MediaPlayer
            width={1080}
            height={1920}
            sources={sources}
            onTicked={this.handleTicked}
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
