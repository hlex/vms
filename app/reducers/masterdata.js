import _ from 'lodash';
import cuid from 'cuid';
import {
  RECEIVED_MASTERDATA
} from '../actions/actionTypes';
import {
  normalizeStripAds
} from '../helpers/masterdata';

/*
  # เติมเงินฟรี 5 บาท
  rewardType: 'MOBILE_TOPUP',
  rewardValue: 5,
  rewardChannel: 'SMS',

  # รับส่วนลด 3 บาท
  rewardType: 'DISCOUNT',
  rewardValue: 3,
  rewardChannel: 'EMAIL',

  # รับสินค้าฟรี
  rewardType: 'PRODUCT',
  rewardValue: 0,
  rewardChannel: 'VENDING_MACHINE',

  # รับสินค้าฟรี
  rewardType: 'DISCOUNT',
  rewardValue: 5,
  rewardChannel: 'VENDING_MACHINE',

*/

// const eventItemGenerator = (id, input, rewardType, rewardValue) => ({
//   id: 1,
//   cuid: cuid(),
//   eventType: '', // FREE_MOBILE_TOPUP_WATCH_ADS
//   eventActivities: [
//     {
//       type: 'input',
//       name: 'INPUT_MSISDN', // INPUT_MSISDN, INPUT_EMAIL, SCAN_BARCODE, SCAN_QRCODE, ADD_LINE_ID
//       value: null
//     },
//     {
//       type: 'ads',
//       name: 'WATCH_ADS', // 'WATCH_ADS', 'SCAN_LINE_QRCODE'
//       value: 15
//     }
//   ],
//   rewards: [
//     {
//       name: 'DISCOUNT', // DISCOUNT, MOBILE_TOPUP, PRODUCT
//       value: 5, // 5 10 100
//       channel: 'VENDING_MACHINE', // 'SMS', 'EMAIL', 'VENDING_MACHINE',
//       expireDate: '', // null, '2017-09-26'
//     },
//   ],
//   remarks: [
//     {
//       th: 'จำกัด 1 สิทธิ์ต่อ 1 LINE_ID',
//       en: '',
//       verifyKey: 'EMAIL', // MSISDN, EMAIl, ID_NUMBER, ...
//     }
//   ],
//   product: {
//     "Po_ID": "PO0001",
//     "Po_Name": {
//         "th": "แบรนด์ Gen U",
//         "en": "แบรนด์ Gen U"
//     },
//     "Po_Price": "45",
//     "Po_Img": "/uploads/images/product-20170819110019.png",
//     "Po_Imgbig": "/uploads/images/product-bg-20170819110019.png",
//     "Row": "1",
//     "Column": "1"
//   },
//   tags: [
//     {
//       name: 'A', // B
//       color: 'RED', // RED GREEN BLUE MINT YELLOW PURPLE
//       label: 'เติมเงินฟรี', // free text..
//       unit: 'บาท', // free text..
//       value: 5 // integer.. เช่น 10, 20, 100
//     }
//   ],
//   howTo: [
//     {
//       order: 1,
//       th: 'ใส่ หมายเลข',
//       en: '',
//     },
//     {
//       order: 2,
//       th: 'ชมโฆษณา 15 วินาที',
//       en: '',
//     },
//     {
//       order: 3,
//       highlight: 'รับส่วนลด 5 บาท',
//       th: '|ับส่วนลด 5 บาท',
//       en: '',
//     },
//   ],
// });

const mockupMobileTopupValues = [
  {
    cuid: cuid(),
    id: 1,
    value: '20',
    fee: '2',
  },
  {
    cuid: cuid(),
    id: 2,
    value: '50',
    fee: '1',
  },
  {
    cuid: cuid(),
    id: 3,
    value: '100',
    fee: '0',
  },
  {
    cuid: cuid(),
    id: 4,
    value: '150',
    fee: '0',
  },
  {
    cuid: cuid(),
    id: 5,
    value: '200',
    fee: '0',
  },
  // {
  //   cuid: cuid(),
  //   id: 1,
  //   value: '250',
  //   fee: '0',
  // },
  {
    cuid: cuid(),
    id: 6,
    value: '300',
    fee: '0',
  },
  // {
  //   cuid: cuid(),
  //   id: 1,
  //   value: '350',
  //   fee: '0',
  // },
  // {
  //   cuid: cuid(),
  //   id: 1,
  //   value: '400',
  //   fee: '0',
  // },
  // {
  //   cuid: cuid(),
  //   id: 1,
  //   value: '500',
  //   fee: '0',
  // },
];

const aisAds = [
  {
    id: '4094',
    type: 'image',
    name: 'EMP_AIS_EMPStripAds',
    path: 'StripAds/20151204_ais_344.jpg',
    filename: '20151204_ais_344.jpg',
    expire: '2026-11-21',
    timeout: '5000',
    adSize: 'STRIP',
    checksum: '47e93aec13f7c9115ebbcfaacb309ccd',
  },
];

const mockupEvents = [
  {
    id: 1001,
    eventType: '',
    eventActivities: [
      {
        type: 'input',
        name: 'MSISDN',
        value: null,
      },
      {
        type: 'watch',
        name: 'WATCH_ADS',
        value: '15',
      },
    ],
    rewards: [
      {
        name: 'TOPUP',
        value: '5',
        channel: 'SMS',
        expireDate: '',
      },
    ],
    remarks: [
      {
        th: '',
        en: '',
        verifyKey: '',
      },
    ],
    tags: [
      {
        name: 'A', // B
        color: 'RED', // RED GREEN BLUE MINT YELLOW PURPLE
        label: 'เติมเงินฟรี', // free text..
        unit: 'บาท', // free text..
        value: 5 // integer.. เช่น 10, 20, 100
      }
    ],
    howTo: [
      {
        order: 1,
        th: 'ใส่ หมายเลข',
        en: 'ใส่ หมายเลข',
      },
      {
        order: 2,
        th: 'ชมโฆษณา 15 วินาที',
        en: 'ชมโฆษณา 15 วินาที',
      },
      {
        order: 3,
        highlight: 'รับส่วนลด 5 บาท',
        th: 'รับส่วนลด 5 บาท',
        en: 'รับส่วนลด 5 บาท',
      },
    ],
    product: {
      Po_ID: 'PO0001',
      Po_Name: {
        th: 'แบรนด์ Gen U',
        en: 'แบรนด์ Gen U',
      },
      Po_Price: '45',
      Po_Img: '/uploads/images/product-20170819110019.png',
      Po_Imgbig: '/uploads/images/product-bg-20170819110019.png',
      Row: '1',
      Column: '1',
    },
  },
];

const mockupTopupProviders = [
  {
    id: 1,
    banner: 'images/product-full-ais.png',
    src: 'images/operation-ais.png',
    serviceCode: '1001',
    name: 'AIS one2call',
    ads: _.map(aisAds, ad => normalizeStripAds(ad)),
  },
  {
    id: 2,
    banner: 'images/product-full-ais.png',
    src: 'images/operation-dtac.png',
    serviceCode: 'DTACTOPUP',
    name: 'DTAC',
    ads: _.map(aisAds, ad => normalizeStripAds(ad)),
  },
  {
    id: 3,
    banner: 'images/product-full-ais.png',
    src: 'images/operation-true.png',
    serviceCode: 'TRMVTOPUP',
    name: 'Truemove',
    ads: _.map(aisAds, ad => normalizeStripAds(ad)),
  },
  {
    id: 4,
    banner: 'images/product-full-ais.png',
    src: 'images/operation-myworld.png',
    serviceCode: '1001',
    name: 'Myworld',
    ads: _.map(aisAds, ad => normalizeStripAds(ad)),
  },
  {
    id: 5,
    banner: 'images/product-full-ais.png',
    src: 'images/operation-cat.png',
    serviceCode: '1001',
    name: 'Cat',
    ads: _.map(aisAds, ad => normalizeStripAds(ad)),
  },
  // {
  //   id: 6,
  //   banner: 'images/product-full-ais.png',
  //   src: 'images/operation-penguin.png',
  //   serviceCode: '1001',
  //   name: 'Penguin',
  // },
];

const productAds = [
  {
    id: '4199',
    type: 'image',
    name: 'EMP_diningexp_EMPStripAds',
    path: 'StripAds/20160916_magical-dining-experience_344.jpg',
    filename: '20160916_magical-dining-experience_344.jpg',
    expire: '2026-11-21',
    timeout: '5000',
    adSize: 'STRIP',
    checksum: 'f4d0a6724f7eafb25266cb2088b515fd',
  },
  {
    id: '4211',
    type: 'video',
    name: 'EMP_UFC_EMPStripAds',
    path: 'StripAds/20161007_ufc_344.mp4',
    filename: '20161007_ufc_344.mp4',
    expire: '2026-11-21',
    timeout: '5000',
    adSize: 'STRIP',
    checksum: '29e4304189c0d933efd3f121909e84b8',
  },
];

const isSoldout = () => _.random(1, 5) === 5;

const productGenerator = number =>
  _.map(_.range(number), index => ({
    cuid: cuid(),
    id: index + 1,
    name: cuid(),
    price: 20, // _.random(1, 50),
    isSoldout: isSoldout(),
    image: `images/product-${index + 1}.png`,
    row: 2, // _.random(1, 2),
    col: 1, // _.random(1, 2),
    isDropped: false,
    ads: _.map(productAds, ad => normalizeStripAds(ad)),
  }));

const promotionGenerator = number =>
  _.map(_.range(number), index => ({
    cuid: cuid(),
    id: index + 1,
    products: productGenerator(2),
    price: 30,
    image: '',
  }));

const initialState = {
  products: productGenerator(36),
  promotionSets: promotionGenerator(10),
  topupProviders: mockupTopupProviders,
  mobileTopupValues: mockupMobileTopupValues,
  events: [], // mockupEvents,
};

const getInitialState = () => ({
  ...initialState,
});

export default function masterdata(state = getInitialState(), action) {
  switch (action.type) {
    case RECEIVED_MASTERDATA:
      return {
        ...state,
        [action.key]: action.value
      };
    default:
      return state;
  }
}
