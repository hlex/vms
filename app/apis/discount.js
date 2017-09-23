import { handleResponseCatchError, convertToURLParam } from 'api-jarvis';
import { fetchFacade } from '../helpers/api';
import { isVMSServiceError, convertVMSServiceResponseToError } from '../helpers/error';
import URL from './url';

export const serviceVerifyDiscountCode = ({ code }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
  // const data = {
  //   code,
  // };
  // return fetchFacade(`${URL.mobileTopup}${convertToURLParam(data)}`).then((response) => {
  //   console.log('topupMobile', response);
  //   // handleResponseCatchError(response, isVMSServiceError, convertVMSServiceResponseToError);
  //   return response;
  // });
};
