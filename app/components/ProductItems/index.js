import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import cuid from 'cuid';
import _ from 'lodash';

import ProductCardItem from '../ProductCardItem';
import PromotionSetCardItem from '../PromotionSetCardItem';

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

class ProductItems extends PureComponent {
  static propTypes = {
    promotionSets: PropTypes.arrayOf(PropTypes.shape({})),
    products: PropTypes.arrayOf(PropTypes.shape({})),
    events: PropTypes.arrayOf(PropTypes.shape({})),
    mobileTopupProviders: PropTypes.arrayOf(PropTypes.shape({})),
    promotionSetPerPage: PropTypes.number,
    productPerPage: PropTypes.number,
    eventPerPage: PropTypes.number,
    mobileTopupProviderPerPage: PropTypes.number,
    onClickItem: PropTypes.func,
    height: PropTypes.number,
    baseURL: PropTypes.string.isRequired,
  };

  static defaultProps = {
    promotionSets: [],
    products: [],
    events: [],
    promotionSetPerPage: 1,
    productPerPage: 1,
    eventPerPage: 1,
    height: 815,
    onClickItem: context => console.log('Please send any onClickItem function', context),
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
      mobileTopupProviders,
      promotionSetPerPage,
      productPerPage,
      eventPerPage,
      mobileTopupProviderPerPage,
      height,
      baseURL,
    } = this.props;
    // ======================================================
    // Items
    // ======================================================
    const promotionTotalPage = Math.ceil(_.size(promotionSets) / promotionSetPerPage);
    const productTotalPage = Math.ceil(_.size(products) / productPerPage);
    const slickTotalPage = _.max([0, promotionTotalPage, productTotalPage]);
    const pageRange = _.range(slickTotalPage);
    const promotionItems = _.map(
      pageRange,
      index => getPaginatedItems(promotionSets, index + 1, promotionSetPerPage).data,
    );
    const productItems = _.map(
      pageRange,
      index => getPaginatedItems(products, index + 1, productPerPage).data,
    );
    return (
      <div style={{ position: 'relative' }}>
        <Slider ref={c => (this.slider = c)} {...productSettings}>
          {pageRange.map(index => (
            <div className="product-items" key={cuid()} style={{ height: `${height}px` }}>
              <div className="box-wrapper">
                <div className="promotion-item-list">
                  <div className="product-row-big">
                    <div className="flex-rows">
                      {_.map(_.get(promotionItems, index, []), (promotion, i) => {
                        return (
                          <PromotionSetCardItem
                            key={`promotionset-${i}`}
                            promotion={promotion}
                            baseURL={baseURL}
                            onClick={() => this.handleClickItem(
                              '/product/promotionSet',
                              promotion,
                              'promotionSet',
                            )}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="promotion-item-list">
                  <div className="product-row-mini">
                    <div className="flex-rows">
                      {_.map(_.get(productItems, index, []), (product, j) => (
                        <ProductCardItem
                          key={`promotionset-${j}`}
                          imageURL={`${baseURL}/${product.image}`}
                          isSoldout={product.isSoldout}
                          price={product.price}
                          onClick={() => this.handleClickItem('/product/single', product, 'singleProduct')}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    );
  }
}

export default ProductItems;
