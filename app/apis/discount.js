import _ from 'lodash';
import { handleResponseCatchError, convertToURLParam } from 'api-jarvis';
import { fetchFacade, extractResponseData } from '../helpers/api';
import { isVMSServiceError, convertVMSServiceResponseToError } from '../helpers/error';
import URL from './url';

export const serviceVerifyDiscountCode = (code, discountType = 'product') => {
  const data = {
    vtype: 'verifydiscountcode',
    discounttype: discountType,
    po_id: 'SB-001', // fixed
    code,
  };
  return fetchFacade(`${URL.verifyDiscount}${convertToURLParam(data)}`)
  .then((response) => {
    console.log('serviceVerifyDiscountCode', response);
    handleResponseCatchError(response, isVMSServiceError, convertVMSServiceResponseToError);
    return extractResponseData(response);
  });
};

export const serviceUseDiscountCode = (code, discountType) => {
  const data = {
    vtype: 'usediscountcode',
    discounttype: discountType,
    code,
  };
  return fetchFacade(`${URL.verifyDiscount}${convertToURLParam(data)}`).then(response => {
    console.log('serviceUseDiscountCode', response);
    handleResponseCatchError(response, isVMSServiceError, convertVMSServiceResponseToError);
    return extractResponseData(response);
  });
};
