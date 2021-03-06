import _ from 'lodash';
import { handleResponseCatchError, convertToURLParam } from 'api-jarvis';
import { fetchFacade } from '../helpers/api';
import { isVMSServiceError, convertVMSServiceResponseToError } from '../helpers/error';
import URL from './url';

export const serviceGetEventReward = ({ eventId, discountType, amount, channel, value }, poId) => {
  const data = {
    vtype: 'getdiscountcode',
    id: eventId,
    discounttype: discountType,
    amount,
    channel: channel.toLowerCase(),
    value,
    po_id: poId
  };
  return fetchFacade(`${URL.getEventReward}${convertToURLParam(data)}`).then(response => {
    handleResponseCatchError(response, isVMSServiceError, convertVMSServiceResponseToError);
    return response;
  });
};

export const verifyBarcodeOrQrcode = ({ eventId, code, discountType }) => {
  const data = {
    vtype: 'verifybarcode',
    id: eventId,
    code,
    discounttype: discountType,
  };
  return fetchFacade(`${URL.verifyBarcodeOrQrcode}${convertToURLParam(data)}`).then(response => {
    handleResponseCatchError(response, isVMSServiceError, convertVMSServiceResponseToError);
    return response;
  });
  // return new Promise((resolve, reject) => {
  //   resolve(true);
  // });
};

export const verifyLineQrcode = ({ eventId, code, barcodeOrQrcode }) => {
  const data = {
    vtype: 'verifylineqrcode',
    id: eventId,
    code,
    barcode: barcodeOrQrcode,
  };
  return fetchFacade(`${URL.verifyLineId}${convertToURLParam(data)}`).then(response => {
    handleResponseCatchError(response, isVMSServiceError, convertVMSServiceResponseToError);
    return response;
  });
};

export const useLineQrcode = ({ eventId, code, barcodeOrQrcode, productId }) => {
  const data = {
    vtype: 'uselineqrcode',
    id: eventId,
    code,
    barcode: barcodeOrQrcode,
    po_id: productId,
  };
  return fetchFacade(`${URL.useLineId}${convertToURLParam(data)}`).then(response => {
    handleResponseCatchError(response, isVMSServiceError, convertVMSServiceResponseToError);
    return response;
  });
};
