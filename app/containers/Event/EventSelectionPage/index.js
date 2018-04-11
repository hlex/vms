import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import cuid from 'cuid';
// ======================================================
// Components
// ======================================================
import { Layout, ListWithTwoColumnItems, EventItem } from '../../../components';

// ======================================================
// Actions
// ======================================================
import * as ApplicationActions from '../../../actions/applicationActions';
import * as Actions from './actions';

// ======================================================
// Selectors
// ======================================================
import MasterappSelector from '../../../selectors/masterapp';
import MasterdataSelector from '../../../selectors/masterdata';

const mapStateToProps = state => ({
  lang: MasterappSelector.getLanguage(state.masterapp),
  mainMenus: MasterdataSelector.getMainMenus(state.masterdata),
  eventSteps: MasterdataSelector.getEventSteps(state.masterdata),
  events: MasterdataSelector.getEvents(state.masterdata),
  baseURL: MasterappSelector.getLocalURL(state.masterapp),
});

const actions = {
  ...ApplicationActions,
  ...Actions,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class EventSelectionPage extends Component {
  static propTypes = {
    lang: PropTypes.string.isRequired,
    mainMenus: PropTypes.arrayOf(PropTypes.shape({})),
    eventSteps: PropTypes.arrayOf(PropTypes.shape({})),
    events: PropTypes.arrayOf(PropTypes.shape({})),
    baseURL: PropTypes.string.isRequired,
    back: PropTypes.func.isRequired,
    selectEvent: PropTypes.func.isRequired,
  };

  static defaultProps = {
    mainMenus: [],
    eventSteps: [],
    events: [],
  };

  renderItem = (renderItem, handleClick) => {
    const { baseURL } = this.props;
    return <EventItem key={cuid()} baseURL={baseURL} item={renderItem} handleClick={handleClick} />;
  };

  renderTitle = () => {
    const { mainMenus, lang, location: { pathname } } = this.props;
    const targetLocation = pathname.substring(1);
    const currMenu = _.find(mainMenus, menu => menu.linkTo === targetLocation);
    return currMenu.title[lang];
  }

  renderStepTitle = () => {
    const { lang } = this.props;
    if (lang === 'th') {
      return 'ขั้นตอน';
    }
    return 'Steps';
  }

  render() {
    const { events, baseURL, eventSteps, lang, selectProduct } = this.props;
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
                  _.map(eventSteps, (step, index) => {
                    return (
                      <li key={`num-list-${index}`}><span className="num-list">{index + 1}</span><span>{step[lang]}</span></li>
                    );
                  })
                }
              </ul>
              <ul className="item" />
            </div>
          </div>
        </Layout.Subheader>
        <ListWithTwoColumnItems
          className='event-row'
          items={events}
          itemPerPage={10}
          height={1450}
          onClickItem={(context, item) => selectProduct(context, item, 'event')}
          baseURL={baseURL}
          renderComponent={this.renderItem}
        />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EventSelectionPage));
