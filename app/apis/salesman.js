import _ from 'lodash';
import { handleResponseCatchError, convertToURLParam } from 'api-jarvis';
import { fetchFacade } from '../helpers/api';
import { isVMSServiceError, convertVMSServiceResponseToError } from '../helpers/error';
import URL from './url';

export const serviceVerifySalesman = scannedCode => {
  const data = {
    vtype: 'verifySalesman',
    qrcode: scannedCode
  };
  return {
    status: 'SUCCESSFUL',
    'trx-id': '20180112095629',
    'response-data': {
      pass: false
    }
  };
  // return fetchFacade(`${URL.verifySalesman}${convertToURLParam(data)}`).then((response) => {
  //   handleResponseCatchError(response, isVMSServiceError, convertVMSServiceResponseToError);
  //   return response;
  // });
};

export default {};
