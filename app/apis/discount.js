import _ from 'lodash';
import { handleResponseCatchError, convertToURLParam } from 'api-jarvis';
import { fetchFacade } from '../helpers/api';
import { isVMSServiceError, convertVMSServiceResponseToError } from '../helpers/error';
import URL from './url';

export const serviceVerifyDiscountCode = ({ code }) => {
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve(true);
  //   }, 1000);
  // });
  const data = {
    vtype: 'verifydiscountcode',
    code: '1111111111111',
  };
  return fetchFacade(`${URL.verifyDiscount}${convertToURLParam(data)}`).then((response) => {
    console.log('serviceVerifyDiscountCode', response);
    const responseDiscount = _.head(response);
    // handleResponseCatchError(response, isVMSServiceError, convertVMSServiceResponseToError);
    if (responseDiscount.status === 1) {
      throw new Error('serviceVerifyDiscountCode');
    }
    return responseDiscount;
  });
};
