import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// ======================================================
// Components
// ======================================================
import { Layout, TopupProviderItems } from '../../../components';
// ======================================================
// Selectors
// ======================================================
import MasterappSelector from '../../../selectors/masterapp';
// ======================================================
// Actions
// ======================================================
import * as ApplicationActions from '../../../actions/applicationActions';
import * as Actions from './actions';

const mapStateToProps = (state) => {
  return {
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


class TopupProviderSelectionPage extends Component {
  render() {
    const { baseURL } = this.props;
    const topupProviderItems = [
      {
        id: 1,
        src: 'images/operation-ais.png',
        name: 'AIS',
      },
      {
        id: 2,
        src: 'images/operation-ais.png',
        name: 'AIS',
      }
    ];
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
                <li><span className="num-list">1</span><span>เลือกเครือข่ายโดยสัมผัสหน้าจอ</span></li>
                <li><span className="num-list">2</span><span>ใส่เบอร์มือถือที่ต้องการจะเติมเงิน</span></li>
                <li><span className="num-list">3</span><span>เลือกมูลค่าเติมเงิน</span></li>
                <li><span className="num-list">4</span><span>ใส่รหัสส่วนลด กรณีมีรหัสและต้องการใช้</span></li>
              </ul>
              <ul className="item how-to-list">
                <li><span className="num-list">5</span><span>ใส่ธนบัตร 20, 50, 100 บาท หรือ เหรียญ 1, 5, 10 บาท</span></li>
                <li><span className="num-list">6</span><span>รอรับ SMS ยืนยัน</span></li>
                <li><span className="num-list">7</span><span>รับเงินทอน</span></li>
              </ul>
            </div>
          </div>
        </Layout.Subheader>
        <TopupProviderItems
          items={topupProviderItems}
          itemPerPage={6}
          height={792}
          onClick={() => console.log('!')}
          baseURL={baseURL}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopupProviderSelectionPage);
