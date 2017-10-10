import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cuid from 'cuid';

export default class ProductCardItem extends PureComponent {
  static propTypes = {
    imageURL: PropTypes.string,
    isSoldout: PropTypes.bool,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onClick: PropTypes.func,
  };

  static defaultProps = {
    imageURL: '',
    isSoldout: false,
    price: 0,
    onClick: context => console.log('Please send any onClickItem function', context),
  };

  render = () => {
    const { imageURL, isSoldout, price, onClick } = this.props;
    return (
      <a
        className={`box ${isSoldout ? 'outstock' : ''}`}
        key={cuid()}
        onClick={() => !isSoldout && onClick()}
      >
        <div className="item">
          {isSoldout && (
            <div className="product-outstock">
              <span>หมด</span>
            </div>
          )}
          <img className="" alt="" src={`${imageURL}`} />
          <div className="price">
            <span>{price}</span>
            <b>฿</b>
          </div>
        </div>
      </a>
    );
  };
}
