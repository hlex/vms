import {
  INIT_TCP_CLIENT,
  RECEIVED_SENSOR_INFORMATION,
  READY_TO_DROP_PRODUCT,
  NOT_READY_TO_DROP_PRODUCT
} from '../actions/actionTypes';

const initialTcp = process.env.NODE_ENV !== 'production'
? {
  ip: '127.0.0.1',
  port: 1337,
}
: {
  ip: '192.168.1.41',
  port: 8080,
};

const initialState = {
  navMenus: [
    {
      title: 'ซื้อเครื่องดื่ม/ขนม',
      src: 'images/bg-nav-one.png',
      linkTo: 'product',
    },
    {
      title: 'เล่นกิจกรรมรับส่วนลด',
      src: 'images/bg-nav-two.png',
      linkTo: 'event',
    },
    {
      title: 'เติมเงินมือถือ',
      src: 'images/bg-nav-three.png',
      linkTo: 'topup',
    },
    {
      title: 'สแกน QR Code,Barcode',
      src: 'images/bg-nav-four.png',
      linkTo: 'play',
    },
  ],
  baseURL: 'http://localhost:8888/vms/html-v2',
  tcp: initialTcp,
  tcpClient: {},
  temp: 25, // celcius
  readyToDropProduct: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case RECEIVED_SENSOR_INFORMATION:
      return {
        ...state,
        temp: _.get(action, 'data.msg.temp', state.temp),
      };
    case INIT_TCP_CLIENT:
      return {
        ...state,
        tcpClient: action.tcpClient
      };
    case READY_TO_DROP_PRODUCT:
      return {
        ...state,
        readyToDropProduct: true,
      }
    case NOT_READY_TO_DROP_PRODUCT:
      return {
        ...state,
        readyToDropProduct: false,
      }
    default:
      return state;
  }
};
