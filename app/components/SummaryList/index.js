import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SummaryList extends Component {

  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({

    })),
  }

  static defaultProps = {
    items: [
      {
        text: 'ราคาสินค้า',
        color: 'blue',
        amount: '40',
      },
      {
        text: 'ส่วนลด',
        color: 'purple',
        amount: '10',
      },
    ],
  }

  render() {
    const { items } = this.props;
    return (
      <div className="summary-list">
        {
          items.map((item, index) => {
            return (
              <div className="item" key={`summary-list-item-${index}`}>
                <p>{item.text}</p>
                <div className={`circle ${item.color}`}>
                  <span className="pt">{item.amount}</span>
                  <span className="currency"> ฿</span>
                </div>
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default SummaryList;
