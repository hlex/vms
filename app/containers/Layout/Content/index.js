import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// ======================================================
// Components
// ======================================================
import { InputWithPad, Modal } from '../../../components';

// ======================================================
// Actions
// ======================================================
import * as ApplicationActions from '../../../actions/applicationActions';

const mapStateToProps = state => ({
  modal: state.modal,
});

const actions = {
  ...ApplicationActions,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class Content extends Component {

  static propTypes = {
    modal: PropTypes.shape({}).isRequired,
    cancelPayment: PropTypes.func.isRequired,
  }

  render() {
    const { modal, cancelPayment } = this.props;
    return (
      <div className="content-wrapper">
        {
          this.props.children
        }
        <Modal show={modal.type.collectPoint}>
          <div className="collect-point">
            <h2>ใส่เบอร์มือถือเพื่อสะสมแต้ม</h2>
            <InputWithPad onConfirm={() => console.log('MSISDN to confirm add point')} />
            <small>กรุณาตรวจสอบเบอร์มือถือให้ถูกต้อง</small>
            <small>สัมผัสช่องว่างแป้นพิมพ์จะปรากฎ</small>
            <p className="or">หรือ</p>
            <button className="button purple">ไม่สะสมแต้ม</button>
          </div>
        </Modal>
        <Modal show={modal.type.contentError}>
          <div className="app-error">
            <h2>ขออภัย ไม่สามารถทอนเงินได้</h2>
            <small>เนื่องจากมีเหรียญไม่เพียงพอให้บริการ</small>
            <p>กรุณาใส่เงินให้พอดีราคาสินค้า</p>
            <button onClick={cancelPayment} className="button purple">ทำรายการใหม่</button>
            <p className="or">หรือ</p>
            <button onClick={cancelPayment} className="button purple">ยกเลิกรายการ</button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Content);
