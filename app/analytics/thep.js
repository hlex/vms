import _ from 'lodash';
import { handleResponseCatchError, convertToURLParam } from 'api-jarvis';
import { fetchFacade } from '../helpers/api';
import { isVMSServiceError, convertVMSServiceResponseToError } from '../helpers/error';

const getArrData = (eventType, data) => {
  const dataArray = _.map(data, (value, key) => `${key}:${value}`);
  const dataString = _.join(dataArray, ',');
  return `${eventType}|${dataString}`;
};

const recordEvent = (eventType, data) => {
  const { machineId } = data;
  const urlParams = {
    vtype: 'LogReport',
    machine_id: machineId,
    arrData: getArrData(eventType, data)
  };
  return fetchFacade(`api/main.php${convertToURLParam(urlParams)}`).then((response) => {
    handleResponseCatchError(response, isVMSServiceError, convertVMSServiceResponseToError);
    return response;
  });
};

export default {
  recordEvent
};
