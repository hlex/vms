import React, { Component } from 'react';
import PropTypes from 'prop-types';

class EventTitle extends Component {

  static propTypes = {
    baseURL: PropTypes.string.isRequired,
    title: PropTypes.string,
    bgImage: PropTypes.string,
  }

  static defaultProps = {
    title: 'ซื้อเครื่องดื่ม/ขนม',
    bgImage: 'images/product-full.png',
  }

  render() {
    const { title, baseURL, bgImage } = this.props;
    return (
      <div className="promotion-title">
        <div className="_center">
          <h1>{title}</h1>
        </div>
        <div className="event-detail">
          <div className="box">
            <div className="ribbon-less ribbon-one-blue">
              <p><span>เติมเงินฟรี<br />
                5 บาท</span></p>
            </div>
            <div className="photo-item"><img src="images/product-1.png" />
              <div className="price"><span>35</span> <b>฿</b></div>
            </div>
            <div className="requirements">
              <p>1. ใส่ <span className="color-orange">เบอร์มือถือ <img className="icon middle-line" src="images/icon-phone.png" height="60" /></span></p>
              <p>2. ชมโฆษณา 15 วินาที</p>
              <p>3. <span className="color-red">เติมเงินฟรี 5 บาท</span> ทาง SMS</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EventTitle;
