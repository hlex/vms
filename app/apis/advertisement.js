import _ from 'lodash';
import { handleResponseCatchError, convertToURLParam } from 'api-jarvis';
import { fetchFacade, extractResponseData } from '../helpers/api';
import { isVMSServiceError, convertVMSServiceResponseToError } from '../helpers/error';
import URL from './url';

export const serviceSaveAdvertisementRecords = ({ machineId, records }) => {
  const data = {
    machineId,
    records
  };
  console.log('serviceSaveAdvertisementRecords', data);
  return new Promise((resolve, reject) => {
    resolve(true);
  });
  // return fetchFacade(`${URL.saveAdvertisementRecords}${convertToURLParam(data)}`).then(response => {
  //   handleResponseCatchError(response, isVMSServiceError, convertVMSServiceResponseToError);
  //   return extractResponseData(response);
  // });
};

export default {};
