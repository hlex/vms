import _ from 'lodash';
import { handleResponseCatchError, convertToURLParam } from 'api-jarvis';
import { fetchFacade } from '../helpers/api';
import { isVMSServiceError, convertVMSServiceResponseToError } from '../helpers/error';
import { convertToAppEvent } from '../helpers/masterdata';
import URL from './url';

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
        th: 'รับส่วนลด 5 บาท ทาง SMS',
        en: 'รับส่วนลด 5 บาท ทาง SMS',
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

export const serviceGetEvents = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(_.map(mockupEvents, (event) => {
        return convertToAppEvent(event);
      }));
    }, 100);
  });
  // const data = {
  //   vtype: 'verifydiscountcode',
  //   code: '1111111111111',
  // };
  // return fetchFacade(`${URL.verifyDiscount}${convertToURLParam(data)}`).then((response) => {
  //   console.log('serviceVerifyDiscountCode', response);
  //   const responseDiscount = _.head(response);
  //   // handleResponseCatchError(response, isVMSServiceError, convertVMSServiceResponseToError);
  //   if (responseDiscount.status === 1) {
  //     throw new Error('serviceVerifyDiscountCode');
  //   }
  //   return responseDiscount;
  // });
};
