import cuid from 'cuid';
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
  AUDIO_STARTED,
  AUDIO_ENDED,
  SET_VOICE_INTERVAL,
  SET_APPLICATION_MODE,
  SET_MACHINE_ID,
  FETCH_DATA_COMPLETED,
  VERIFIED_SALES_MAN,
  CLEAR_VERIFY_SALES_MAN,
  SET_DROP_PRODUCT_INTERVAL,
  GENERATE_LOG_ID,
  RESET_APPLICATION
} from '../actions/actionTypes';

const localURL = process.env.NODE_ENV !== 'production' ? 'http://localhost:8888/vms' : 'http://localhost:81/vms';
const localStaticURL = process.env.NODE_ENV !== 'production' ? 'http://localhost:8888/vms/static' : 'http://localhost:81/vms/static';
const cloudURL = 'http://siamvending.dyndns.biz:81';
const initialTcp = process.env.NODE_ENV !== 'production'
? {
  ip: '127.0.0.1',
  port: 1337,
}
: {
  ip: '192.168.1.41',
  port: 8080,
};

const getInitialState = () => ({
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
  localURL,
  baseURL: cloudURL,
  localStaticURL,
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
  mutedAds: false,
  voiceInterval: 5,
  mode: 'running',
  dataIsFetched: false,
  verifiedSalesman: undefined,
  dropProductInterval: 2,
  logId: '',
  paymentSystemDown: false
});

const generateLogId = () => cuid.slug();

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case RESET_APPLICATION:
      return {
        ...state,
        readyToDropProduct: false,
        canChangeCash: true,
        droppingProduct: {},
        limitBanknote: undefined,
        moneyBoxActive: false,
        loading: {
          show: false,
          messages: {
            th: '',
            en: ''
          }
        },
        lang: 'th',
        hardwareProcessing: '',
        verifiedSalesman: undefined,
      };
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
      if (state.hardwareProcessing === action.processNameToFinish) {
        return {
          ...state,
          hardwareProcessing: ''
        };
      }
      return {
        ...state,
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
    case AUDIO_STARTED:
      return {
        ...state,
        mutedAds: true
      };
    case AUDIO_ENDED:
      return {
        ...state,
        mutedAds: false
      };
    case SET_VOICE_INTERVAL:
      return {
        ...state,
        voiceInterval: action.voiceInterval
      };
    case SET_APPLICATION_MODE:
      if (action.mode === 'paymentSystemDown') {
        return {
          ...state,
          paymentSystemDown: true
        };
      }
      return {
        ...state,
        mode: action.mode,
        paymentSystemDown: false
      };
    case SET_MACHINE_ID:
      return {
        ...state,
        machineId: action.machineId
      };
    case FETCH_DATA_COMPLETED:
      return {
        ...state,
        dataIsFetched: true
      };
    case VERIFIED_SALES_MAN:
      return {
        ...state,
        verifiedSalesman: action.salesman
      };
    case CLEAR_VERIFY_SALES_MAN:
      return {
        ...state,
        verifiedSalesman: undefined
      };
    case SET_DROP_PRODUCT_INTERVAL:
      return {
        ...state,
        dropProductInterval: action.dropProductInterval
      };
    case GENERATE_LOG_ID:
      return {
        ...state,
        logId: generateLogId()
      };
    default:
      return state;
  }
};
