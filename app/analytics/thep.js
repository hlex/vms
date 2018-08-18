import _ from 'lodash';
import { handleResponseCatchError, convertToURLParam } from 'api-jarvis';
import { fetchFacade } from '../helpers/api';
import { isVMSServiceError, convertVMSServiceResponseToError } from '../helpers/error';

const getArrData = (data) => {
  const dataArray = _.map(data, (value, key) => `${key}:${value}`);
  const dataString = _.join(dataArray, ',');
  return `${dataString}`;
};

const recordEvent = (machineId, data) => {
  const urlParams = {
    vtype: 'LogReport',
    machine_id: machineId,
    TID: data.requestOrderId,
    arrData: getArrData(_.omit(data, ['requestOrderId'])),
  };
  console.log('recordEvent:', `api/main.php${convertToURLParam(urlParams)}`);
  return fetchFacade(`api/main.php${convertToURLParam(urlParams)}`).then((response) => {
    handleResponseCatchError(response, isVMSServiceError, convertVMSServiceResponseToError);
    return response;
  });
};

export default {
  recordEvent
};
