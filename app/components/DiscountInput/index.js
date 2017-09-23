import React, { Component } from 'react';
import PropTypes from 'prop-types';

import InputWithPad from '../InputWithPad';

class DiscountInput extends Component {
  render() {
    return (
      <div className="discount-input">
        <div className="discount-input-box">
          <div className="content _center">
            <p>
              ใส่รหัสส่วนลด <small>(กรณีมีรหัสส่วนลดและต้องการใช้)</small>
            </p>
            <InputWithPad type={'keyboard'} onConfirm={() => console.log('!!!!')} />
            <p className="_unpadding">
              <small>สัมผัสช่องว่างแป้นพิมพ์จะปรากฏ</small>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default DiscountInput;
