import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import _ from 'lodash';
import cuid from 'cuid';
// ======================================================
// Hoc
// ======================================================
import withAudio from '../../../hoc/withAudio';
// ======================================================
// Components
// ======================================================
import { Layout, TopUpProviderItem, ListWithTwoColumnItems } from '../../../components';
// ======================================================
// Selectors
// ======================================================
import MasterappSelector from '../../../selectors/masterapp';
import MasterdataSelector from '../../../selectors/masterdata';
// ======================================================
// Actions
// ======================================================
import * as ApplicationActions from '../../../actions/applicationActions';
import * as Actions from './actions';

const mapStateToProps = (state) => {
  return {
    mainMenus: MasterdataSelector.getMainMenus(state.masterdata),
    mobileTopupSteps: MasterdataSelector.getMobileTopupSteps(state.masterdata),
    baseURL: MasterappSelector.getLocalURL(state.masterapp),
    topupProviders: MasterdataSelector.getTopupProviders(state.masterdata),
    lang: MasterappSelector.getLanguage(state.masterapp),
  };
};

const actions = {
  ...ApplicationActions,
  ...Actions,
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(actions, dispatch);
};


class TopupProviderSelectionPage extends Component {

  static propTypes = {
    lang: PropTypes.string.isRequired,
    mainMenus: PropTypes.arrayOf(PropTypes.shape({})),
    mobileTopupSteps: PropTypes.arrayOf(PropTypes.shape({})),
    baseURL: PropTypes.string.isRequired,
    topupProviders: PropTypes.arrayOf(PropTypes.shape({})),
    selectProduct: PropTypes.func.isRequired,
    initMobileTopupProviderSelectionPage: PropTypes.func.isRequired,
  }

  static defaultProps = {
    mobileTopupSteps: [],
    mainMenus: [],
    topupProviders: [],
  }

  componentDidMount = () => {
    const { initMobileTopupProviderSelectionPage } = this.props;
    initMobileTopupProviderSelectionPage();
  }

  renderItem = (renderItem, handleClick) => {
    const { baseURL } = this.props;
    return (
      <TopUpProviderItem
        key={cuid()}
        baseURL={baseURL}
        item={renderItem}
        handleClick={handleClick}
      />
    );
  }

  renderStepTitle = () => {
    const { lang } = this.props;
    if (lang === 'th') {
      return 'ขั้นตอน';
    }
    return 'Steps';
  }

  renderTitle = () => {
    const { mainMenus, lang, location: { pathname } } = this.props;
    const targetLocation = pathname.substring(1);
    const currMenu = _.find(mainMenus, menu => menu.linkTo === targetLocation);
    return currMenu.title[lang];
  }

  render() {
    const { baseURL, topupProviders, mobileTopupSteps, lang, selectProduct } = this.props;
    return (
      <div>
        <Layout.Subheader>
          <div className="title-section">
            <div className="title">
              <span>{this.renderTitle()}</span>
            </div>
            <hr />
            <div className="how-to-box">
              <h2>{this.renderStepTitle()}</h2>
              <ul className="item how-to-list">
                {
                  _.map(mobileTopupSteps, (step, index) => {
                    if (index <= 3) {
                      return (
                        <li key={`num-list-${index}`}><span className="num-list">{index + 1}</span><span>{step[lang]}</span></li>
                      );
                    }
                    return '';
                  })
                }
              </ul>
              <ul className="item how-to-list">
                {
                  _.map(mobileTopupSteps, (step, index) => {
                    if (index > 3 && index < 8) {
                      return (
                        <li key={`num-list-${index}`}><span className="num-list">{index + 1}</span><span>{step[lang]}</span></li>
                      );
                    }
                    return '';
                  })
                }
              </ul>
            </div>
          </div>
        </Layout.Subheader>
        <ListWithTwoColumnItems
          className="topup-row"
          items={topupProviders}
          itemPerPage={6}
          height={842}
          onClickItem={(context, item) => selectProduct(context, item, 'mobileTopup')}
          baseURL={baseURL}
          renderComponent={this.renderItem}
        />
      </div>
    );
  }
}

export default withRouter(withAudio({ src: `http://localhost:${process.env.NODE_ENV !== 'production' ? '8888' : '81'}/vms/static/voice/6.mp3` }, actions)(connect(mapStateToProps, mapDispatchToProps)(TopupProviderSelectionPage)))
