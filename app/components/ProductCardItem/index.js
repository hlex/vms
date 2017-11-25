import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import cuid from 'cuid';

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

class ProductCardItem extends PureComponent {
  static propTypes = {
    lang: PropTypes.string.isRequired,
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

  renderSoldout = () => {
    const { lang } = this.props;
    if (lang === 'th') {
      return 'หมด';
    }
    return 'OUT';
  }

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
              <span>{this.renderSoldout()}</span>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductCardItem);
