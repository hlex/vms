import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
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
  events: MasterdataSelector.getEvents(state.masterdata),
  baseURL: MasterappSelector.getBaseURL(state.masterapp),
});

const actions = {
  ...ApplicationActions,
  ...Actions,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class EventSelectionPage extends Component {
  static propTypes = {
    events: PropTypes.arrayOf(PropTypes.shape({})),
    back: PropTypes.func.isRequired,
    baseURL: PropTypes.string.isRequired,
  };

  static defaultProps = {
    events: [],
  };

  renderItem = (renderItem, handleClick) => {
    const { baseURL } = this.props;
    return <EventItem key={cuid()} baseURL={baseURL} item={renderItem} handleClick={handleClick} />;
  };

  render() {
    const { events, back, baseURL } = this.props;
    return (
      <div>
        <Layout.Subheader>
          <div className="title-section">
            <div className="title">
              <span>เล่นกิจกรรมรับส่วนลด</span>
            </div>
            <hr />
            <div className="how-to-box">
              <h2>ขั้นตอน</h2>
              <ul className="item how-to-list">
                <li>
                  <span className="num-list">1</span>
                  <span>เลือกกิจกรรมโดยสัมผัสหน้าจอ</span>
                </li>
                <li>
                  <span className="num-list">2</span>
                  <span>เล่นกิจกรรมตามที่กำหนด</span>
                </li>
                <li>
                  <span className="num-list">3</span>
                  <span>รับรหัสส่วนลดในช่องทางที่แจ้ง</span>
                </li>
                <li>
                  <span className="num-list">4</span>
                  <span>ใช้ซื้อทันทีหรือครั้งต่อไป</span>
                </li>
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
          onClickItem={(a, b) => console.log(a, b)}
          baseURL={baseURL}
          renderComponent={this.renderItem}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventSelectionPage);
