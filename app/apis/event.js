import _ from 'lodash';
import { handleResponseCatchError, convertToURLParam } from 'api-jarvis';
import { fetchFacade } from '../helpers/api';
import { isVMSServiceError, convertVMSServiceResponseToError } from '../helpers/error';
import URL from './url';

export const serviceGetEventReward = ({ eventId, discountType, amount, channel, value }) => {
  const data = {
    vtype: 'getdiscountcode',
    id: eventId,
    discounttype: discountType,
    amount,
    channel: channel.toLowerCase(),
    value,
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

export const verifyLineId = ({ eventId, code, barcodeOrQrcode }) => {
  const data = {
    vtype: 'verifybarcode',
    id: eventId,
    code,
    Barcode: barcodeOrQrcode,
  };
  return fetchFacade(`${URL.verifyLineId}${convertToURLParam(data)}`).then(response => {
    handleResponseCatchError(response, isVMSServiceError, convertVMSServiceResponseToError);
    return response;
  });
};

export const useLineId = ({ eventId, code, barcodeOrQrcode, productId }) => {
  const data = {
    vtype: 'verifybarcode',
    id: eventId,
    code,
    Barcode: barcodeOrQrcode,
    po_id: productId,
  };
  return fetchFacade(`${URL.useLineId}${convertToURLParam(data)}`).then(response => {
    handleResponseCatchError(response, isVMSServiceError, convertVMSServiceResponseToError);
    return response;
  });
};

export const getActivityFreeRule = () => {
  const data = {
    vtype: 'activityFreeRule',
  };
  return new Promise((resolve, reject) => {
    const response = {
      status: 'SUCCESSFUL',
      'trx-id': '20171116204950',
      'response-data': {
        rule: 'ALL',
      },
    };
    setTimeout(() => {
      resolve(response);
    }, 100);
  });
  // return fetchFacade(`${URL.getActivityFreeRule}${convertToURLParam(data)}`).then((response) => {
  //   handleResponseCatchError(response, isVMSServiceError, convertVMSServiceResponseToError);
  //   return response;
  // });
};
