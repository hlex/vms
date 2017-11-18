import { handleResponseCatchError, convertToURLParam } from 'api-jarvis';
import { fetchFacade } from '../helpers/api';
import { isVMSServiceError, convertVMSServiceResponseToError } from '../helpers/error';
import URL from './url';

export const serviceTopupMobile = ({ serviceCode, MSISDN, mobileTopupValue, mobileTopupFee }) => {
  const data = {
    ServiceCode: serviceCode,
    MobileNo: MSISDN,
    TopupAmount: mobileTopupValue,
    ServiceCharge: mobileTopupFee
  };
  return fetchFacade(`${URL.mobileTopup}${convertToURLParam(data)}`).then((response) => {
    console.log('topupMobile', response);
    // handleResponseCatchError(response, isVMSServiceError, convertVMSServiceResponseToError);
    return response;
  });
};
