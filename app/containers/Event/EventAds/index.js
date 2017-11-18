import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';

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
import OrderSelector from '../../../selectors/order';

const mapStateToProps = state => ({
  selectedEvent: OrderSelector.getSelectedEvent(state.order),
  nextWatch: OrderSelector.getEventNextWatch(state.order),
  baseURL: MasterappSelector.getBaseURL(state.masterapp),
});

const actions = {
  ...ApplicationActions,
  ...Actions,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class EventAds extends Component {
  static propTypes = {
    selectedEvent: PropTypes.shape({}).isRequired,
    nextWatch: PropTypes.shape({}).isRequired,
    eventInitGetReward: PropTypes.func.isRequired,
    backToHome: PropTypes.func.isRequired,
  };

  state = {
    count: 0,
    adFinished: false,
  };

  handleAdsEnd = () => {
    const { eventInitGetReward } = this.props;
    // ======================================================
    // POPUP 100%
    // ======================================================
    console.log('handleAdsEnd');
    // this.setState({
    //   adFinished: true,
    // });
    eventInitGetReward();
  };

  handleNext = () => {
    const { backToHome } = this.props;
    backToHome();
  };

  handleTicked = () => {
    this.setState({
      count: this.state.count + 1,
    });
    if (this.getRemainingCount() === 0) this.handleAdsEnd();
  };

  getRemainingCount = () => {
    const { count } = this.state;
    const { nextWatch } = this.props;
    const source = _.get(nextWatch, 'data', {}); // [_.head(stripAds)];
    const maxCount = _.get(source, 'duration', 0);
    const remainingCount = maxCount - count;
    return remainingCount;
  };

  renderChannelLabel = channelCode => channelCode === 'EMAIL' ? 'อีเมล' : 'SMS';

  renderDiscountUI = () => {
    const { selectedEvent } = this.props;
    const lang = 'th';
    const label = _.get(selectedEvent, `tag.label.${lang}`, '');
    const value = _.get(selectedEvent, 'tag.value', '');
    const unit = _.get(selectedEvent, `tag.unit.${lang}`, '');
    const channelCode = _.get(selectedEvent, 'rewards.0.channel', '');
    return (
      <div>
        <h2>
          รับรหัส <span className="highlight-red">{`${label} ${value} ${unit}`}</span>
        </h2>
        <h2>ทาง {`${this.renderChannelLabel(channelCode)}`}</h2>
        <p>
          ใช้ได้ภายใน{' '}
          <span className="highlight-red">{`${moment('2017-11-1', 'YYYY-MM-DD').format(
            'DD/MM/YYYY',
          )}`}</span>
        </p>
      </div>
    );
  };

  renderUI = () => this.renderDiscountUI();

  render() {
    const { adFinished } = this.state;
    const { nextWatch } = this.props;
    const source = _.get(nextWatch, 'data', {}); // [_.head(stripAds)];
    const remainingCount = this.getRemainingCount();
    const playlist = [source];
    return (
      <div className="event-ads">
        <Layout.FullScreen>
          {remainingCount > 0 && (
            <div className="count-time" style={{ position: 'fixed', zIndex: '99' }}>
              <span id="set_timer" className="style colorDefinition size_sm">
                {remainingCount} วินาที
              </span>
            </div>
          )}
          {remainingCount !== 0 && (
            <MediaPlayer
              playerKey={'eventAds'}
              width={1080}
              height={1920}
              sources={playlist}
              onTicked={this.handleTicked}
              onEnded={this.handleAdsEnd}
            />
          )}
          <Modal
            show={adFinished}
            options={{
              className: {
                margin: '0 auto',
                top: '50%',
                marginTop: '-200px',
              },
            }}
          >
            <div className="ads-confirm">
              {this.renderUI()}
              <a className="button purple M" onClick={this.handleNext}>
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
