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

const mapStateToProps = state => state;

const actions = {
  ...ApplicationActions,
  ...Actions,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class SingleProductPage extends Component {

  static propTypes = {
    back: PropTypes.func,
    submitProduct: PropTypes.func,
  }

  static defaultProps = {
    back: () => console.log('back'),
    submitProduct: () => console.log('submitProduct'),
  }

  render() {
    const { back, submitProduct } = this.props;
    return (
      <div>
        <Layout.Title>
          <ProductTitle />
        </Layout.Title>
        <Layout.Content>
          <ProductSummary
            productPrice={'30'}
            discountAmount={'15'}
            back={back}
            onSubmit={submitProduct}
          />
        </Layout.Content>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleProductPage);
