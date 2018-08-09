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
  moneyBoxActive: state.masterapp.moneyBoxActive,
});

const actions = {
  ...ApplicationActions,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class Content extends Component {

  static propTypes = {
    moneyBoxActive: PropTypes.bool.isRequired,
    modal: PropTypes.shape({}).isRequired,
    cancelPayment: PropTypes.func.isRequired,
    confirmWarningSystemWillNotChangeCash: PropTypes.func.isRequired,
  }

  render() {
    const { modal, moneyBoxActive, cancelPayment, confirmWarningSystemWillNotChangeCash } = this.props;
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
        <Modal show={modal.type.productDropError}>
          <div className="app-error">
            <h2>ขออภัย ไม่สามารถจำหน่ายสินค้าได้</h2>
            <small>เนื่องจากระบบขัดช้องหรือสินค้าหมด</small>
            <p>กรุณาเลือกสินค้าชนิดอื่น</p>
            {
              moneyBoxActive
              ? <h2>ระบบกำลังทอนเงิน</h2>
              : <button onClick={cancelPayment} className="button purple" style={{ width: '250px' }}>กดเพื่อเลือกสินค้าชนิดอื่น</button>
            }
          </div>
        </Modal>
        <Modal show={modal.type.warningSystemWillNotChangeCash}>
          <div className="app-error">
            <h2>ขณะนี้ระบบมีเงินทอนไม่เพียงพอ</h2>
            <p>กรุณาใส่เหรียญให้พอดีกับมูลค่าสินค้า เครื่องจะไม่ทอนเงิน</p>
            <button onClick={confirmWarningSystemWillNotChangeCash} className="button purple">รับทราบ</button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Content);
