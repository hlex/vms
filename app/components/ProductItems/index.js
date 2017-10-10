import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import cuid from 'cuid';
import _ from 'lodash';

import ProductCardItem from '../ProductCardItem';
import PromotionSetCardItem from '../PromotionSetCardItem';
import EventItem from '../EventItem';
import TopUpProviderItem from '../TopUpProviderItem';

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
                        handleClick={() => console.log('!!!!!!!! EventItem')}
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
                        handleClick={() => console.log('!!!!!!!! TopUpProviderItem')}
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
      promotionSets,
      products,
      events,
      mobileTopupProviders,
      promotionSetPerPage,
      productPerPage,
      eventPerPage,
      mobileTopupProviderPerPage,
    } = this.props;
    console.log('>>>>>>>>>>>', this.props);
    let pages = [];
    // ======================================================
    // Products
    // ======================================================
    const promotionTotalPage = Math.ceil(_.size(promotionSets) / promotionSetPerPage);
    const productTotalPage = Math.ceil(_.size(products) / productPerPage);
    const productsToTalPage = _.max([0, promotionTotalPage, productTotalPage]);
    const promotionItems = _.map(
      _.range(productsToTalPage),
      index => getPaginatedItems(promotionSets, index + 1, promotionSetPerPage).data,
    );
    const productItems = _.map(
      _.range(productsToTalPage),
      index => getPaginatedItems(products, index + 1, productPerPage).data,
    );
    for (let i = 0; i < productsToTalPage; i += 1) {
      pages.push({
        type: 'product',
        item: {
          promotionItems: promotionItems[i],
          productItems: productItems[i],
        }
      });
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

    console.log('ProductItems:promotionItems', promotionItems);
    console.log('ProductItems:productItems', productItems);
    console.log('ProductItems:promotionItems', promotionItems);
    console.log('ProductItems:productItems', productItems);
    console.log('ProductItems:pages', pages);

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
