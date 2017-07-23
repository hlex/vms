import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// ======================================================
// Components
// ======================================================
import ProductItems from '../../../components/ProductItems';

// ======================================================
// Actions
// ======================================================
import * as ApplicationActions from '../../../actions/applicationActions';
import * as Actions from './actions';

// ======================================================
// Selectors
// ======================================================
import MasterappSelector from '../../../selectors/masterapp';

const mapStateToProps = state => ({
  products: state.products,
  promotionSets: state.promotionSets,
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
        ProductSelectionPage
        <ProductItems
          promotionSets={promotionSets}
          products={products}
          promotionSetPerPage={3}
          productPerPage={20}
          onClickItem={(context, itemId) => selectProduct(context, itemId)}
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
