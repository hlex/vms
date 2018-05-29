import _ from 'lodash';
import { handleResponseCatchError, convertToURLParam } from 'api-jarvis';
import { fetchFacade } from '../helpers/api';
import { isVMSServiceError, convertVMSServiceResponseToError } from '../helpers/error';
import URL from './url';

export const serviceSubmitOrder = ({ id, poId, saleType, discountCode, discountPrice, qty, unitPrice, slotNo, barcode, lineQrcode }) => {
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
    discountprice: discountPrice,
    qty,
    unitprice: unitPrice,
    slotno: slotNo,
    barcode,
    lineqrcode: lineQrcode
  };
  return fetchFacade(`${URL.submitOrder}${convertToURLParam(data)}`, { local: true }).then((response) => {
    handleResponseCatchError(response, isVMSServiceError, convertVMSServiceResponseToError);
    return response;
  });
};

export const serviceGetSumOrderAmount = () => {
  const data = {
    vtype: 'sumOrderAmount'
  };
  return fetchFacade(`${URL.sumOrderAmount}${convertToURLParam(data)}`, { local: true }).then((response) => {
    handleResponseCatchError(response, isVMSServiceError, convertVMSServiceResponseToError);
    return response;
  });
};

export const syncSettlement = ({ salesman, remainingCoinsString }) => {
  const data = {
    vtype: 'SettleMent',
    SaleMan: salesman,
    remainingCoins: remainingCoinsString, // '1|20,5|30,10|50'
  };
  return fetchFacade(`${URL.syncSettlement}${convertToURLParam(data)}`, { local: true }).then((response) => {
    handleResponseCatchError(response, isVMSServiceError, convertVMSServiceResponseToError);
    return response;
  });
};

export const updateStock = () => {
  const data = {
    vtype: 'UpdateStock'
  };
  return fetchFacade(`${URL.updateStock}${convertToURLParam(data)}`, { local: true }).then((response) => {
    handleResponseCatchError(response, isVMSServiceError, convertVMSServiceResponseToError);
    return response;
  });
};
