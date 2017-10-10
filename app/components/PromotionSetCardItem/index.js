import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cuid from 'cuid';
import _ from 'lodash';

export default class PromotionSetCardItem extends PureComponent {
  static propTypes = {
    baseURL: PropTypes.string,
    promotion: PropTypes.shape({}),
    onClick: PropTypes.func,
  };

  static defaultProps = {
    baseURL: '',
    promotion: {},
    onClick: context => console.log('Please send any onClick function', context),
  };

  render = () => {
    const { promotion, baseURL, onClick } = this.props;
    const someProductSoldout = _.some(
      promotion.products,
      product => product.isSoldout,
    );
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
            <span>หมด</span>
          </div>
        )}
        <div className="item">
          <div className="combo">
            <img alt="" src={`${baseURL}/${_.get(promotion, 'products.0.image')}`} />
            <span>&nbsp;</span>
            <img alt="" src={`${baseURL}/${_.get(promotion, 'products.1.image')}`} />
          </div>
          <div className="price">
            <span>{`ปกติ ${_.sumBy(
              promotion.products,
              product => product.price,
            )}฿ พิเศษ ${promotion.price}฿`}</span>
          </div>
        </div>
      </a>
    );
  };
}
