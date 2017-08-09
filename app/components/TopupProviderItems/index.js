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

class TopupProviderItems extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({})),
    itemPerPage: PropTypes.number,
    height: PropTypes.number,
    onClickItem: PropTypes.func,
    baseURL: PropTypes.string.isRequired,
  };

  static defaultProps = {
    items: [],
    itemPerPage: 6,
    height: 842,
    onClickItem: context => console.log('Please send any onClickItem function', context),
  };

  handleClickItem = (context, itemId) => {
    const { onClickItem } = this.props;
    onClickItem(context, itemId);
  };

  render() {
    const {
      items,
      itemPerPage,
      height,
      baseURL,
    } = this.props;
    // ======================================================
    // Items
    // ======================================================
    const itemTotalPage = Math.ceil(_.size(items) / itemPerPage);
    const slickTotalPage = _.max([0, itemTotalPage]);
    const pageRange = _.range(slickTotalPage);
    const topupProviderItems = _.map(pageRange, index => getPaginatedItems(items, index + 1, itemPerPage).data);
    // console.log('>>>>>>>', itemTotalPage, slickTotalPage, pageRange, topupProviderItems);
    return (
      <div style={{ position: 'relative' }}>
        <Slider ref={c => (this.slider = c)} {...productSettings}>
          {pageRange.map(index => (
            <div className="product-items" key={cuid()} style={{ height: `${height}px` }}>
              <div className="box-wrapper">
                <div className="box-slick">
                  {
                    _.map(_.get(topupProviderItems, index, []), (topupProviderItem) => {
                      return (
                        <a
                          className="box"
                          key={cuid()}
                          onClick={() =>
                                this.handleClickItem('/product/promotionSet', topupProviderItem.id)}
                        >
                          <div className="item">
                            <div className="photo-item">
                              <img alt="" src="images/operation-ais.png" />
                            </div>
                          </div>
                        </a>
                      );
                    })
                  }
                </div>
              </div>
            </div>
            ))}
        </Slider>
      </div>
    );
  }
}

export default TopupProviderItems;

