import _ from 'lodash';
import { handleResponseCatchError, convertToURLParam } from 'api-jarvis';
import { fetchFacade, extractResponseData } from '../helpers/api';
import { isVMSServiceError, convertVMSServiceResponseToError } from '../helpers/error';
import URL from './url';

export const serviceVerifyDiscountCode = code => {
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve(true);
  //   }, 1000);
  // });
  const data = {
    vtype: 'verifydiscountcode',
    // code: '1111111111111',
    code,
  };
  return fetchFacade(`${URL.verifyDiscount}${convertToURLParam(data)}`).then(() => {
    const response = {
      status: 'SUCCESSFUL',
      'trx-id': '20171011215412',
      'response-data': {
        value: 3,
        expireDate: '2017-12-01',
      },
      'process-instance': 'instance: 27.254.160.247:81',
      version: '1.16.0',
    };
    console.log('serviceVerifyDiscountCode', response);
    // const response = {
    //   status: 'SUCCESSFUL',
    //   'trx-id': '20171011215412',
    //   fault: {
    //     exception: 'DAOException',
    //     'http-error-code': 200,
    //     'http-error': 'Internal Server Error',
    //     'technical-error-code': 'XXXXXX',
    //     'technical-error': '',
    //     'th-message': 'ไม่พบรหัสส่วนลดที่ระบุ',
    //     'en-message': 'Cannot found discount code',
    //     'technical-message': 'Cannot found discount code',
    //   },
    //   'process-instance': 'instance: 27.254.160.247:81',
    //   version: '1.16.0',
    // };
    handleResponseCatchError(response, isVMSServiceError, convertVMSServiceResponseToError);
    return extractResponseData(response);
  });
};

export const serviceUseDiscountCode = code => {
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve(true);
  //   }, 1000);
  // });
  const data = {
    vtype: 'usediscountcode',
    // code: '1111111111111',
    code,
  };
  return fetchFacade(`${URL.verifyDiscount}${convertToURLParam(data)}`).then(response => {
    console.log('serviceUseDiscountCode', response);
    const responseDiscount = _.head(response);
    // handleResponseCatchError(response, isVMSServiceError, convertVMSServiceResponseToError);
    if (responseDiscount.status === 1) {
      throw new Error('serviceVerifyDiscountCode');
    }
    return responseDiscount;
  });
};
