import { handleResponseCatchError, convertToURLParam } from 'api-jarvis';
import { fetchFacade } from '../helpers/api';
import { isVMSServiceError, convertVMSServiceResponseToError } from '../helpers/error';
import URL from './url';

export const serviceTopupMobile = ({ serviceCode, MSISDN, mobileTopupValue, mobileTopupFee }, discountCode = '', discountPrice = 0, machineId = '') => {
  const data = {
    ServiceCode: serviceCode,
    MobileNo: MSISDN,
    TopupAmount: mobileTopupValue,
    ServiceCharge: mobileTopupFee,
    Discount_Code: discountCode,
    Discount_Price: discountPrice,
    MachineID: machineId
  };
  return new Promise((resolve, reject) => {
    resolve({
      'response-data': {},
      status: "SUCCESSFUL",
      'trx-id': "20180623121628"
    })
  })
  // return fetchFacade(`${URL.mobileTopup}${convertToURLParam(data)}`).then((response) => {
  //   handleResponseCatchError(response, isVMSServiceError, convertVMSServiceResponseToError);
  //   return response;
  // });
};
