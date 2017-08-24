import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// ======================================================
// Components
// ======================================================
import { Layout, ProductSummary, ProductTitle } from '../../../components';

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

const mapStateToProps = (state) => {
  return {
    baseURL: MasterappSelector.getBaseURL(state.masterapp),
    product: OrderSelector.getSingleProduct(state.order),
    productPrice: OrderSelector.getSingleProductPrice(state.order),
  };
};

const actions = {
  ...ApplicationActions,
  ...Actions,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class SingleProductPage extends Component {

  static propTypes = {
    baseURL: PropTypes.string.isRequired,
    product: PropTypes.shape({}),
    productPrice: PropTypes.number,
    back: PropTypes.func,
    submitProduct: PropTypes.func,
  }

  static defaultProps = {
    product: {},
    productPrice: 0,
    back: () => console.log('back'),
    submitProduct: () => console.log('submitProduct'),
  }

  render() {
    const {
      baseURL,
      product,
      productPrice,
      back,
      submitProduct,
    } = this.props;
    return (
      <div>
        <Layout.Title>
          <ProductTitle
            baseURL={baseURL}
          />
        </Layout.Title>
        <Layout.Content>
          <ProductSummary
            productPrice={productPrice}
            discountAmount={0}
            back={back}
            onSubmit={submitProduct}
          />
        </Layout.Content>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleProductPage);
