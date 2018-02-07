import { handleResponseCatchError, convertToURLParam } from 'api-jarvis';
import { fetchFacade } from '../helpers/api';
import { isVMSServiceError, convertVMSServiceResponseToError } from '../helpers/error';
import URL from './url';

export const serviceTopupMobile = ({ serviceCode, MSISDN, mobileTopupValue, mobileTopupFee }, discountCode = '', machineId = '') => {
  const data = {
    ServiceCode: serviceCode,
    MobileNo: MSISDN,
    TopupAmount: mobileTopupValue,
    ServiceCharge: mobileTopupFee,
    Discount_Code: discountCode,
    MachineID: machineId
  };
  return fetchFacade(`${URL.mobileTopup}${convertToURLParam(data)}`).then((response) => {
    handleResponseCatchError(response, isVMSServiceError, convertVMSServiceResponseToError);
    return response;
  });
};
