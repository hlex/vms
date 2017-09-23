import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import cuid from 'cuid';
import _ from 'lodash';

// ======================================================
// Slick
// ======================================================
const SlickSettings = {
  dots: false,
  speed: 500,
  autoplay: false,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplaySpeed: 10000,
  nextArrow: false,
  prevArrow: false,
  arrows: false,
};

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

class ListWithTwoColumnItems extends Component {
  static propTypes = {
    className: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({})),
    itemPerPage: PropTypes.number,
    height: PropTypes.number,
    onClickItem: PropTypes.func,
    baseURL: PropTypes.string.isRequired,
    renderComponent: PropTypes.func.isRequired,
  };

  static defaultProps = {
    className: 'topup-row',
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
      className,
      items,
      itemPerPage,
      height,
      renderComponent,
    } = this.props;
    // ======================================================
    // Items
    // ======================================================
    const itemTotalPage = Math.ceil(_.size(items) / itemPerPage);
    const slickTotalPage = _.max([0, itemTotalPage]);
    const pageRange = _.range(slickTotalPage);
    const renderItems = _.map(pageRange, index => getPaginatedItems(items, index + 1, itemPerPage).data);
    // console.log('>>>>>>>', itemTotalPage, slickTotalPage, pageRange, topupProviderItems);
    return (
      <div style={{ position: 'relative' }}>
        <Slider ref={c => (this.slider = c)} {...SlickSettings}>
          {pageRange.map(index => (
            <div className="product-items" key={cuid()} style={{ height: `${height}px` }}>
              <div className="box-wrapper">
                <div className="box-slick">
                  <div className={`${className}`}>
                    <div className="flex-rows">
                      {
                        _.map(_.get(renderItems, index, []), (renderItem) => {
                          return renderComponent(renderItem, this.handleClickItem);
                        })
                      }
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

export default ListWithTwoColumnItems;

