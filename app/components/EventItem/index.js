import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cuid from 'cuid';
import _ from 'lodash';

class EventItem extends Component {
  static propTypes = {
    baseURL: PropTypes.string.isRequired,
    item: PropTypes.shape({}).isRequired,
    handleClick: PropTypes.func.isRequired,
  };

  getRibbonColor = () => {
    const rand = _.random(1, 6);
    let color = '';
    switch (rand) {
      case 1:
        color = 'red';
        break;
      case 2:
        color = 'blue';
        break;
      case 3:
        color = 'green';
        break;
      case 4:
        color = 'yellow';
        break;
      case 5:
        color = 'purple';
        break;
      case 6:
        color = 'mint';
        break;
      default:
        color = 'red';
    }
    return color;
  };

  getRibbonType = () => _.random(1, 2) === 1 ? 'one' : 'two';

  renderRibbon = () => `${this.getRibbonType()}-${this.getRibbonColor()}`;

  render() {
    const { baseURL, item, handleClick } = this.props;
    // console.log('EventItem', this.props);
    return (
      <a className="box" key={cuid()} onClick={() => handleClick('/event/play', item)}>
        <div className={`ribbon-less ribbon-${this.renderRibbon()}`}>
          <p>
            <span>
              เติมเงินฟรี<br />5 บาท
            </span>
          </p>
        </div>
        <div className="photo-item">
          <img src={`${baseURL}/images/product-1.png`} />
          <div className="price">
            <span>35</span> <b>฿</b>
          </div>
        </div>
        <div className="requirements">
          <p>
            1. ใส่{' '}
            <span className="color-orange">
              เบอร์มือถือ{' '}
              <img
                className="icon middle-line"
                src={`${baseURL}/images/icon-phone.png`}
                height="30"
              />
            </span>
          </p>
          <p>2. ชมโฆษณา 15 วินาที</p>
          <p>
            3. <span className="color-red">เติมเงินฟรี 5 บาท</span> ทาง SMS
          </p>
          <div className="box-play-event">
            <span className="play-event">
              <i className="play">&nbsp;</i>เล่นกิจกรรมนี้
            </span>
          </div>
        </div>
      </a>
    );
  }
}

export default EventItem;
