import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// ======================================================
// Components
// ======================================================
import { Layout, ProductItems } from '../../../components';

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
  products: MasterdataSelector.getProducts(state.masterdata),
  promotionSets: MasterdataSelector.getPromotionSets(state.masterdata),
  baseURL: MasterappSelector.getBaseURL(state.masterapp),
});

const actions = {
  ...ApplicationActions,
  ...Actions,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class ProductSelectionPage extends Component {
  static propTypes = {
    products: PropTypes.arrayOf(PropTypes.shape({})),
    promotionSets: PropTypes.arrayOf(PropTypes.shape({})),
    selectProduct: PropTypes.func.isRequired,
    back: PropTypes.func.isRequired,
    baseURL: PropTypes.string.isRequired,
  };

  static defaultProps = {
    products: [],
    promotionSets: [],
  };

  render() {
    const { products, promotionSets, selectProduct, back, baseURL } = this.props;
    return (
      <div>
        <Layout.Subheader>
          <div className="title-section">
            <div className="title">
              <span>ซื้อเครื่องดื่ม/ขนม</span>
            </div>
            <hr />
            <div className="how-to-box">
              <h2>ขั้นตอน</h2>
              <ul className="item how-to-list">
                <li><span className="num-list">1</span><span>เลือกสินค้าโดยสัมผัสหน้าจอ</span></li>
                <li><span className="num-list">2</span><span>ใส่เบอร์มือถือเพื่อสะสมแต้ม (ข้ามขั้นตอนนี้ได้)</span></li>
                <li><span className="num-list">3</span><span>ใส่รหัสส่วนลด กรณีมีรหัสและต้องการใช้</span></li>
              </ul>
              <ul className="item">
                <li><span>ดูวิดิโอการกดซื้อ</span></li>
              </ul>
            </div>
          </div>
        </Layout.Subheader>
        <ProductItems
          promotionSets={promotionSets}
          products={products}
          promotionSetPerPage={3}
          productPerPage={20}
          onClickItem={selectProduct}
          height={1450}
          hasBackButton
          back={back}
          baseURL={baseURL}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductSelectionPage);
