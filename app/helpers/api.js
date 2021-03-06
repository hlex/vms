import { fetchWithJarvis, setDebugMode, convertToURLParam } from 'api-jarvis';
import _ from 'lodash';
import connectivity from 'connectivity'
import { appLog } from './global';

setDebugMode(false);

const baseURL = 'http://siamvending.dyndns.biz:81';
const localURL = process.env.NODE_ENV === 'production' ? 'http://localhost:81/vms' : 'http://siamvending.dyndns.biz:81';

// console.log('localURL', localURL, process.env.NODE_ENV)

export const addUrlParameter = (url, params) => {
  const indexOfQuestionMark = url.indexOf('?'); // found ?
  const hasUrlParam = indexOfQuestionMark > 0;
  if (hasUrlParam) {
    const pureUrl = url.substring(0, indexOfQuestionMark);
    const urlParams = url.substring(url.indexOf('?'));
    return `${pureUrl}${urlParams}&${_.join(
      _.map(params, (value, key) => `${key}=${encodeURIComponent(_.toString(value))}`),
      '&',
    )}`;
  }
  return `${url}${convertToURLParam(params)}`;
};

export const fetchFacade = (url, options = {}) => {
  const origin = options.local ? localURL : baseURL;
  appLog('API:req', url, options, '#90CAF9');
  return fetchWithJarvis(`${origin}/${addUrlParameter(url, { t: Date.now() })}`, {
    ...options,
  }).then(response => {
    appLog('API:res', url, response, '#90CAF9');
    return response;
  });
};

export const extractResponseData = (response) => {
  return _.get(response, 'response-data', {});
};
