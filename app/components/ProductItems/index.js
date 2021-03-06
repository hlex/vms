import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import cuid from 'cuid';
import _ from 'lodash';

import ProductCardItem from '../ProductCardItem';
import PromotionSetCardItem from '../PromotionSetCardItem';
import EventItem from '../EventItem';
import TopUpProviderItem from '../TopUpProviderItem';

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
    autoplayTime: PropTypes.number.isRequired,
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
    mobileTopupProviders: [],
    promotionSetPerPage: 1,
    productPerPage: 1,
    eventPerPage: 1,
    mobileTopupProviderPerPage: 1,
    height: 815,
    onClickItem: context => console.log('Please send any onClickItem function', context),
  };

  handleClickItem = (context, item, module) => {
    const { onClickItem } = this.props;
    onClickItem(context, item, module);
  };

  renderProductPage = (page) => {
    const { baseURL, height } = this.props;
    return (
      <div className="product-items" key={cuid()} style={{ height: `${height}px` }}>
        <div className="box-wrapper">
          <div className="promotion-item-list">
            <div className="product-row-big">
              <div className="flex-rows">
                {_.map(page.promotionItems, (promotion, i) => {
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
                {_.map(page.productItems, (product, j) => (
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
    );
  }

  renderEventPage = (page) => {
    const { baseURL, height } = this.props;
    return (
      <div className="product-items" key={cuid()} style={{ height: `${height}px` }}>
        <div className="box-wrapper">
          <div className="box-slick">
            <div className="event-row">
              <div className="flex-rows">
                {
                  _.map(page.eventItems, (event) => {
                    return (
                      <EventItem
                        key={cuid()}
                        baseURL={baseURL}
                        item={event}
                        handleClick={(context, item) => this.handleClickItem(context, item, 'event')}
                      />
                    );
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderMobileTopupProviderPage = (page) => {
    const { baseURL, height } = this.props;
    return (
      <div className="product-items" key={cuid()} style={{ height: `${height}px` }}>
        <div className="box-wrapper">
          <div className="box-slick">
            <div className="topup-row">
              <div className="flex-rows">
                {
                  _.map(page.mobileTopupProviderItems, (mobileTopupProviderItem) => {
                    return (
                      <TopUpProviderItem
                        key={cuid()}
                        baseURL={baseURL}
                        item={mobileTopupProviderItem}
                        handleClick={(context, item) => this.handleClickItem(context, item, 'mobileTopup')}
                      />
                    );
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {
      autoplayTime,
      promotionSets,
      products,
      events,
      mobileTopupProviders,
      promotionSetPerPage,
      productPerPage,
      eventPerPage,
      mobileTopupProviderPerPage,
    } = this.props;
    const pages = [];
    // console.log(this);
    // ======================================================
    // Amount
    // ======================================================
    const promotionSetAmount = _.size(promotionSets);
    const productAmount = _.size(products);
    // ======================================================
    // Flag
    // ======================================================
    const hasPromotionSet = promotionSetAmount > 0
    // ======================================================
    // PerPage
    // ======================================================
    const finalPromotionSetPerPage = promotionSetPerPage;
    const finalProductPerPage = hasPromotionSet ? productPerPage : productPerPage + 5;
    // ======================================================
    // Pages
    // ======================================================
    const promotionTotalPage = Math.ceil(promotionSetAmount / finalPromotionSetPerPage);
    const productTotalPage = Math.ceil(productAmount / finalProductPerPage);
    const productsToTalPage = _.max([0, promotionTotalPage, productTotalPage]);
    // ======================================================
    // Calculate and duplicate item to fullfill UI
    // ======================================================
    let fullfilledPromotionSet = promotionSets;
    let fullfilledProduct = products;

    const differentPage = Math.abs(productTotalPage - promotionTotalPage);
    // console.log('>>>>>>>', productTotalPage, promotionTotalPage);
    if (promotionTotalPage < productTotalPage) {
      // console.log('promotionTotalPage < productTotalPage', differentPage, 'boost', differentPage * finalPromotionSetPerPage);
      const totalFullFillAmount = promotionSetAmount + (differentPage * finalPromotionSetPerPage);
      fullfilledPromotionSet = _.map(_.range(totalFullFillAmount), (index) => {
        const promotionSetIndex = index % promotionSetAmount;
        return promotionSets[promotionSetIndex];
      });
    } else if (promotionTotalPage > productTotalPage) {
      // console.log('promotionTotalPage > productTotalPage', differentPage, 'boost', differentPage * finalProductPerPage);
      const totalFullFillAmount = productAmount + (differentPage * finalProductPerPage);
      fullfilledProduct = _.map(_.range(totalFullFillAmount), (index) => {
        const productIndex = index % productAmount;
        return products[productIndex];
      });
    }

    const fullfilledPromotionSetAmount = _.size(fullfilledPromotionSet);
    if (fullfilledPromotionSetAmount < finalPromotionSetPerPage) {
      const totalFullFillAmount = fullfilledPromotionSetAmount + (finalPromotionSetPerPage - fullfilledPromotionSetAmount);
      fullfilledPromotionSet = _.map(_.range(totalFullFillAmount), (index) => {
        const promotionSetIndex = index % promotionSetAmount;
        return promotionSets[promotionSetIndex];
      });
    }

    const fullfilledProductAmount = _.size(fullfilledProduct);
    if (fullfilledProductAmount < finalProductPerPage) {
      const totalFullFillAmount = fullfilledProductAmount + (finalProductPerPage - fullfilledProductAmount);
      fullfilledProduct = _.map(_.range(totalFullFillAmount), (index) => {
        const productIndex = index % productAmount;
        return products[productIndex];
      });
    }

    const promotionItems = _.map(
      _.range(productsToTalPage),
      index => getPaginatedItems(fullfilledPromotionSet, index + 1, finalPromotionSetPerPage).data,
    );
    const productItems = _.map(
      _.range(productsToTalPage),
      index => getPaginatedItems(fullfilledProduct, index + 1, finalProductPerPage).data,
    );

    if (hasPromotionSet) {
      for (let i = 0; i < productsToTalPage; i += 1) {
        pages.push({
          type: 'product',
          item: {
            promotionItems: promotionItems[i],
            productItems: productItems[i],
          }
        });
      }
    } else {
      for (let i = 0; i < productsToTalPage; i += 1) {
        pages.push({
          type: 'product',
          item: {
            productItems: productItems[i],
          }
        });
      }
    }
    // ======================================================
    // Events
    // ======================================================
    const eventTotalPage = Math.ceil(_.size(events) / eventPerPage);
    const eventItems = _.map(
      _.range(eventTotalPage),
      index => getPaginatedItems(events, index + 1, eventPerPage).data,
    );
    for (let i = 0; i < eventTotalPage; i += 1) {
      pages.push({
        type: 'event',
        item: {
          eventItems: eventItems[i],
        }
      });
    }
    // ======================================================
    // MobileTopupProviders
    // ======================================================
    const mobileTopupProviderTotalPage = Math.ceil(_.size(mobileTopupProviders) / mobileTopupProviderPerPage);
    const mobileTopupProviderItems = _.map(
      _.range(mobileTopupProviderTotalPage),
      index => getPaginatedItems(mobileTopupProviders, index + 1, mobileTopupProviderPerPage).data,
    );
    for (let i = 0; i < mobileTopupProviderTotalPage; i += 1) {
      pages.push({
        type: 'mobileTopup',
        item: {
          mobileTopupProviderItems: mobileTopupProviderItems[i],
        }
      });
    }
    // ======================================================
    // Slick
    // ======================================================
    const productSettings = {
      initialSlide: 0,
      dots: false,
      speed: 500,
      autoplay: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplaySpeed: autoplayTime * 1000 || 5000,
      nextArrow: false,
      prevArrow: false,
    };

    return (
      <div style={{ position: 'relative' }}>
        <Slider ref={c => (this.slider = c)} {...productSettings}>
          {pages.map((page) => {
            if (page.type === 'product') {
              return this.renderProductPage(page.item);
            } else if (page.type === 'event') {
              return this.renderEventPage(page.item);
            } else if (page.type === 'mobileTopup') {
              return this.renderMobileTopupProviderPage(page.item);
            }
          }
        )}
        </Slider>
      </div>
    );
  }
}

export default ProductItems;
