import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cuid from 'cuid';

import EventItem from '../EventItem';

class EventTitle extends Component {
  static propTypes = {
    baseURL: PropTypes.string.isRequired,
    title: PropTypes.string,
    item: PropTypes.shape({}),
  };

  static defaultProps = {
    title: 'ซื้อเครื่องดื่ม/ขนม',
    bgImage: 'images/product-full.png',
    item: {},
  };

  render() {
    const { title, baseURL, item } = this.props;
    return (
      <div className="promotion-title">
        <div className="_center">
          <h1>{title}</h1>
        </div>
        <div className="event-detail">
          <EventItem
            key={cuid()}
            baseURL={baseURL}
            item={item}
            handleClick={() => console.log('')}
            hasButton={false}
          />;
        </div>
      </div>
    );
  }
}

export default EventTitle;
