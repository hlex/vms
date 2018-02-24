import _ from 'lodash';
import { handleResponseCatchError, convertToURLParam } from 'api-jarvis';
import { fetchFacade, extractResponseData } from '../helpers/api';
import { isVMSServiceError, convertVMSServiceResponseToError } from '../helpers/error';
import URL from './url';

export const serviceVerifyDiscountCode = (code, poId, discountType = 'product') => {
  const data = {
    vtype: 'verifydiscountcode',
    discounttype: discountType,
    po_id: poId,
    code,
  };
  return (
    fetchFacade(`${URL.verifyDiscount}${convertToURLParam(data)}`)
      .then((response) => {
      // .then(() => {
      //   const response = {
      //     status: 'SUCCESSFUL',
      //     'trx-id': '20171108164644',
      //     'response-data': {
      //       expiredate: '31-12-2017',
      //       discountcode: 837354,
      //       discountprice: 13,
      //       'th-message': 'สามารถใช้รหัสส่วนลดได้',
      //       'en-message': 'successful',
      //     },
      //   };
        // console.log('serviceVerifyDiscountCode', response);
        handleResponseCatchError(response, isVMSServiceError, convertVMSServiceResponseToError);
        return extractResponseData(response);
      })
  );
};

export const serviceUseDiscountCode = (code, poId, discountType = 'product') => {
  const data = {
    vtype: 'usediscountcode',
    discounttype: discountType,
    po_id: poId,
    code,
  };
  return fetchFacade(`${URL.verifyDiscount}${convertToURLParam(data)}`).then(response => {
    // console.log('serviceUseDiscountCode', response);
    handleResponseCatchError(response, isVMSServiceError, convertVMSServiceResponseToError);
    return extractResponseData(response);
  });
};
