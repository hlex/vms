// import _ from 'lodash';
import { handleResponseCatchError, convertToURLParam } from 'api-jarvis';
import { fetchFacade } from '../helpers/api';
import { isVMSServiceError, convertVMSServiceResponseToError } from '../helpers/error';
import URL from './url';

export const serviceSendEmailAbnormal = (machineId) => {
  const data = {
    vtype: 'SendMailAbnormal',
    machineId
  };
  return fetchFacade(`${URL.sendMailAbnormal}${convertToURLParam(data)}`).then((response) => {
    handleResponseCatchError(response, isVMSServiceError, convertVMSServiceResponseToError);
    return response;
  });
};
