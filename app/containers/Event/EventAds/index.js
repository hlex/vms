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
import { MediaPlayer } from '../../../components';
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

  render() {
    console.log('EventAds', this.props);
    const { baseURL, stripAds } = this.props;
    const sources = [_.head(stripAds)];
    return (
      <div className="event-ads">
        <Layout.FullScreen>
          <MediaPlayer
            width={1080}
            height={1920}
            sources={sources}
          />
        </Layout.FullScreen>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventAds);
