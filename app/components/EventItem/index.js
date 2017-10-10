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

  convertToRibbonType = (ribbonType) => {
    return ribbonType === 'A' ? 'one' : 'two';
  }

  convertToRibbonColor = (ribbonColor) => {
    return ribbonColor.toLowerCase();
  }

  renderRibbon = () => `${this.getRibbonType()}-${this.getRibbonColor()}`;

  renderHowToParagraph = (howTo, order) => {
    const { baseURL } = this.props;
    const orderLabel = `${order}. `;
    const shouldRenderGetReward = howTo.indexOf('รับ') >= 0 || howTo.indexOf('Get') >= 0;
    const shouldRenderIconPhone = howTo.indexOf('หมายเลข') >= 0 || howTo.indexOf('phone') >= 0;
    const shouldRenderIconEmail = howTo.indexOf('อีเมล') >= 0 || howTo.indexOf('email') >= 0;
    const shouldRenderIconLineId = howTo.indexOf('ไลน์') >= 0 || howTo.indexOf('LINE') >= 0;
    const shouldRenderIconBarCode = howTo.indexOf('บาร์') >= 0 || howTo.indexOf('Bar') >= 0;
    const shouldRenderIconQRCode = howTo.indexOf('คิวอาร์') >= 0 || howTo.indexOf('QR') >= 0;
    if (shouldRenderGetReward) {
      return (
        <p key={cuid()}>
          {orderLabel}<span className="color-red">{`${howTo}`}</span>
        </p>
      );
    } else if (shouldRenderIconPhone) {
      return (
        <p key={cuid()}>
          {orderLabel}
          <span className="color-orange">
            {`${howTo} `}
          </span>
          <img
            className="icon middle-line"
            src={`${baseURL}/images/icon-phone.png`}
            height="30"
          />
        </p>
      );
    } else if (shouldRenderIconEmail) {
      return (
        <p key={cuid()}>
          {orderLabel}
          <span className="color-blue">
            เบอร์มือถือ{' '}
          </span>
          <img
            className="icon middle-line"
            src={`${baseURL}/images/icon-phone.png`}
            height="30"
          />
        </p>
      );
    } else if (shouldRenderIconLineId) {
      return (
        <p key={cuid()}>
          {orderLabel}
          <span className="color-green">
            เบอร์มือถือ{' '}
          </span>
          <img
            className="icon middle-line"
            src={`${baseURL}/images/icon-phone.png`}
            height="30"
          />
        </p>
      );
    } else if (shouldRenderIconBarCode) {
      return (
        <p key={cuid()}>
          {orderLabel}
          <span className="color-purple">
            เบอร์มือถือ{' '}
          </span>
          <img
            className="icon middle-line"
            src={`${baseURL}/images/icon-phone.png`}
            height="30"
          />
        </p>
      );
    } else if (shouldRenderIconQRCode) {
      return (
        <p key={cuid()}>
          {orderLabel}
          <span className="color-pink">
            เบอร์มือถือ{' '}
          </span>
          <img
            className="icon middle-line"
            src={`${baseURL}/images/icon-phone.png`}
            height="30"
          />
        </p>
      );
    }
    return (
      <p key={cuid()}>{`${orderLabel} ${howTo}`}</p>
    );
  }

  render() {
    const { baseURL, item, handleClick } = this.props;
    console.log('EventItem', this.props);
    const lang = 'th';
    // ======================================================
    // Ribbon
    // ======================================================
    const ribbonType = this.convertToRibbonType(item.tag.name);
    const ribbonColor = this.convertToRibbonColor(item.tag.color);
    const ribbonLabel = item.tag.label;
    const ribbonValue = item.tag.value;
    const ribbonUnit = item.tag.unit;

    return (
      <a className="box" key={cuid()} onClick={() => handleClick('/event/play', item)}>
        <div className={`ribbon-less ribbon-${ribbonType}-${ribbonColor}`}>
          <p>
            <span>
              {ribbonLabel}<br />{ribbonValue} {ribbonUnit}
            </span>
          </p>
        </div>
        <div className="photo-item">
          <img src={`${baseURL}/${item.product.image || ''}`} />
          <div className="price">
            <span>{item.product.price || ''}</span> <b>฿</b>
          </div>
        </div>
        <div className="requirements">
          {
            _.map(item.howTo, (instruction, index) => {
              return this.renderHowToParagraph(instruction[lang], index + 1);
            })
          }
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

/*

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
*/
