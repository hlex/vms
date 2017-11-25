import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import cuid from 'cuid';
import _ from 'lodash';
// ======================================================
// Selectors
// ======================================================
import MasterappSelector from '../../selectors/masterapp'

const mapStateToProps = state => {
  return {
    lang: MasterappSelector.getLanguage(state.masterapp)
  };
};

const actions = {};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class PromotionSetCardItem extends PureComponent {
  static propTypes = {
    lang: PropTypes.string.isRequired,
    baseURL: PropTypes.string,
    promotion: PropTypes.shape({}),
    onClick: PropTypes.func,
  };

  static defaultProps = {
    baseURL: '',
    promotion: {},
    onClick: context => console.log('Please send any onClick function', context),
  };

  renderSoldout = () => {
    const { lang } = this.props;
    if (lang === 'th') {
      return 'หมด';
    }
    return 'OUT';
  }

  render = () => {
    const { lang, promotion, baseURL, onClick } = this.props;
    const someProductSoldout = _.some(
      promotion.products,
      product => product.isSoldout,
    );
    const normalPrice = _.sumBy(
      promotion.products,
      product => product.price,
    );
    const comboPrice = promotion.price;
    return (
      <a
        className={`box ${someProductSoldout ? 'outstock' : ''}`}
        key={cuid()}
        onClick={() =>
          !someProductSoldout &&
          onClick()}
      >
        {someProductSoldout && (
          <div className="product-outstock">
            <span>{this.renderSoldout()}</span>
          </div>
        )}
        <div className="item">
          <div className="combo">
            <img alt="" src={`${baseURL}/${_.get(promotion, 'products.0.image')}`} />
            <span>&nbsp;</span>
            <img alt="" src={`${baseURL}/${_.get(promotion, 'products.1.image')}`} />
          </div>
          <div className="price">
            <span>{`${lang === 'th' ? 'พิเศษ' : 'Combo'}`}</span>
            <span style={{ margin: '0px 5px', textDecoration: 'line-through' }}>{`${normalPrice}฿`}</span>
            <span>{`${comboPrice}฿`}</span>
          </div>
        </div>
      </a>
    );
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PromotionSetCardItem);
