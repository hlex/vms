import _ from 'lodash';
import { handleResponseCatchError, convertToURLParam } from 'api-jarvis';
import { fetchFacade } from '../helpers/api';
import { isVMSServiceError, convertVMSServiceResponseToError } from '../helpers/error';
import URL from './url';

export const serviceSubmitOrder = ({ id, poId, saleType, discountCode, qty, unitPrice, slotNo, barcode, lineQrcode }) => {
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve(true);
  //   }, 1000);
  // });
  const data = {
    vtype: 'order',
    id,
    po_id: poId,
    saletype: saleType,
    discountcode: discountCode,
    qty,
    unitprice: unitPrice,
    slotno: slotNo,
    barcode,
    lineqrcode: lineQrcode
  };
  return fetchFacade(`${URL.submitOrder}${convertToURLParam(data)}`).then((response) => {
    handleResponseCatchError(response, isVMSServiceError, convertVMSServiceResponseToError);
    return response;
  });
};

export const serviceGetSumOrderAmount = () => {
  const data = {
    vtype: 'sumOrderAmount'
  };
  return fetchFacade(`${URL.sumOrderAmount}${convertToURLParam(data)}`).then((response) => {
    handleResponseCatchError(response, isVMSServiceError, convertVMSServiceResponseToError);
    return response;
  });
};
