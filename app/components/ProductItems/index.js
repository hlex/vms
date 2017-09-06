import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import cuid from 'cuid';
import _ from 'lodash';

// ======================================================
// Slick
// ======================================================
const productSettings = {
  dots: false,
  speed: 500,
  autoplay: false,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplaySpeed: 10000,
  nextArrow: false,
  prevArrow: false,
};

const path = 'http://localhost:8888/vms/html-v2';

const getPaginatedItems = (items, page = 1, perPage) => {
  const offset = (page - 1) * perPage;
  const paginatedItems = items.slice(offset, offset + perPage);
  return {
    page,
    perPage,
    total: items.length,
    totalPages: Math.ceil(items.length / perPage),
    data: paginatedItems,
  };
};

class ProductItems extends Component {
  static propTypes = {
    promotionSets: PropTypes.arrayOf(PropTypes.shape({})),
    products: PropTypes.arrayOf(PropTypes.shape({})),
    events: PropTypes.arrayOf(PropTypes.shape({})),
    promotionSetPerPage: PropTypes.number,
    productPerPage: PropTypes.number,
    eventPerPage: PropTypes.number,
    onClickItem: PropTypes.func,
    height: PropTypes.number,
    hasBackButton: PropTypes.bool,
    back: PropTypes.func,
    baseURL: PropTypes.string.isRequired,
  };

  static defaultProps = {
    promotionSets: [],
    products: [],
    events: [],
    promotionSetPerPage: 1,
    productPerPage: 1,
    eventPerPage: 1,
    height: 842,
    onClickItem: context => console.log('Please send any onClickItem function', context),
    hasBackButton: false,
    back: () => console.log('Please send any back function')
  };

  handleClickItem = (context, item, module) => {
    const { onClickItem } = this.props;
    onClickItem(context, item, module);
  };

  render() {
    const {
      promotionSets,
      products,
      events,
      promotionSetPerPage,
      productPerPage,
      eventPerPage,
      height,
      hasBackButton,
      back,
      baseURL,
    } = this.props;
    // ======================================================
    // Items
    // ======================================================
    const promotionTotalPage = Math.ceil(_.size(promotionSets) / promotionSetPerPage);
    const productTotalPage = Math.ceil(_.size(products) / productPerPage);
    const slickTotalPage = _.max([0, promotionTotalPage, productTotalPage]);
    const pageRange = _.range(slickTotalPage);
    const promotionItems = _.map(pageRange, index => getPaginatedItems(promotionSets, index + 1, promotionSetPerPage).data);
    const productItems = _.map(pageRange, index => getPaginatedItems(products, index + 1, productPerPage).data);
    return (
      <div style={{ position: 'relative' }}>
        <Slider ref={c => (this.slider = c)} {...productSettings}>
          {pageRange.map(index => (
            <div className="product-items" key={cuid()} style={{ height: `${height}px` }}>
              <div className="box-wrapper">
                <div className="promotion-item-list">
                  <div className="product-row-big">
                    <div className="flex-rows">
                      {_.map(_.get(promotionItems, index, []), (promotion) => {
                        const someProductSoldout = _.some(promotion.products, product => product.isSoldout);
                        return (
                            <a
                              className={`box ${someProductSoldout ? 'outstock' : ''}`}
                              key={cuid()}
                              onClick={() =>
                                    !someProductSoldout && this.handleClickItem('/product/promotionSet', promotion, 'promotionSet')}
                            >
                            {
                              someProductSoldout && <div className="product-outstock"><span>หมด</span></div>
                            }
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
                        }
                      )}
                    </div>
                  </div>
                </div>
                <div className="promotion-item-list">
                  <div className="product-row-mini">
                    <div className="flex-rows">
                      {_.map(_.get(productItems, index, []), product => (
                        <a
                          className={`box ${product.isSoldout ? 'outstock' : ''}`}
                          key={cuid()}
                          onClick={() => !product.isSoldout && this.handleClickItem('/product/single', product, 'singleProduct')}
                        >
                          <div className="item">
                            {
                              product.isSoldout &&
                              <div className="product-outstock"><span>หมด</span></div>
                            }
                            <img className="" alt="" src={`${baseURL}/${product.image}`} />
                            <div className="price">
                                <span>
                                  {product.price}
                                </span>
                                <b>฿</b>
                              </div>
                          </div>
                        </a>
                          ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            ))}
        </Slider>
        {
          hasBackButton &&
          <a
            style={{ position: 'absolute', bottom: '25px', left: '40px' }}
            className="button purple M"
            onClick={back}
          >
            <i className="fa fa-chevron-left" />ย้อนกลับ
          </a>
        }
      </div>
    );
  }
}

export default ProductItems;
