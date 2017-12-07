import {
  INIT_TCP_CLIENT,
  RECEIVED_SENSOR_INFORMATION,
  READY_TO_DROP_PRODUCT,
  NOT_READY_TO_DROP_PRODUCT,
  DROPPING_PRODUCT,
  PRODUCT_DROP_SUCCESS,
  SET_CAN_CHANGE_CASH,
  SET_LIMIT_BANKNOTE,
  HARDWARE_READY,
  ACTIVE_MONEY_BOX,
  DEACTIVE_MONEY_BOX,
  SHOW_LOADING,
  HIDE_LOADING,
  SET_ACTIVITY_FREE_RULE,
  SWITCH_LANGUAGE_TO,
  HARDWARE_START_PROCESS,
  HARDWARE_FINISH_PROCESS,
  SETTING_SET_AUTOPLAY_TIME,
  SETTING_SET_RESET_TIME,
} from '../actions/actionTypes';

const cloudURL = 'http://27.254.160.247:81';
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
  // baseURL: 'http://localhost:8888/vms/html-v2',
  baseURL: cloudURL,
  tcp: initialTcp,
  tcpClient: {},
  temp: 25, // celcius
  readyToDropProduct: false,
  canChangeCash: true,
  droppingProduct: {},
  limitBanknote: undefined,
  hardwareReady: false,
  moneyBoxActive: false,
  loading: {
    show: false,
    messages: {
      th: '',
      en: ''
    }
  },
  activityFreeRule: 'ALL',
  lang: 'th',
  hardwareProcessing: '',
  resetTime: 0,
  autoplayTime: 3,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SHOW_LOADING:
      return {
        ...state,
        loading: {
          show: true,
          messages: {
            ...state.loading.messages,
            th: action.message,
          }
        }
      };
    case HIDE_LOADING:
      return {
        ...state,
        loading: {
          show: false,
          messages: {
            th: '',
            en: ''
          }
        }
      };
    case ACTIVE_MONEY_BOX:
      return {
        ...state,
        moneyBoxActive: true,
      };
    case DEACTIVE_MONEY_BOX:
      return {
        ...state,
        moneyBoxActive: false,
      };
    case HARDWARE_READY:
      return {
        ...state,
        hardwareReady: true,
      };
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
      };
    case NOT_READY_TO_DROP_PRODUCT:
      return {
        ...state,
        readyToDropProduct: false,
      };
    case DROPPING_PRODUCT:
      return {
        ...state,
        droppingProduct: action.product
      };
    case PRODUCT_DROP_SUCCESS:
      return {
        ...state,
        droppingProduct: {},
      };
    case SET_CAN_CHANGE_CASH:
      return {
        ...state,
        canChangeCash: action.canChangeCash
      };
    case SET_LIMIT_BANKNOTE:
      return {
        ...state,
        limitBanknote: action.banknoteValue
      };
    case SET_ACTIVITY_FREE_RULE:
      return {
        ...state,
        activityFreeRule: action.rule
      };
    case SWITCH_LANGUAGE_TO:
      return {
        ...state,
        lang: action.lang
      };
    case HARDWARE_START_PROCESS:
      return {
        ...state,
        hardwareProcessing: action.key
      };
    case HARDWARE_FINISH_PROCESS:
      return {
        ...state,
        hardwareProcessing: ''
      };
    case SETTING_SET_AUTOPLAY_TIME:
      return {
        ...state,
        autoplayTime: action.autoplayTime
      };
    case SETTING_SET_RESET_TIME:
      return {
        ...state,
        resetTime: action.resetTime
      };
    default:
      return state;
  }
};
