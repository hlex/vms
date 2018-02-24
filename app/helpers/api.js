import { fetchWithJarvis, setDebugMode, convertToURLParam } from 'api-jarvis';
import _ from 'lodash';

setDebugMode(false);

const baseURL = 'http://27.254.160.247:81';
const localURL = process.env.NODE_ENV === 'production' ? 'http://localhost:81/vms' : 'http://27.254.160.247:81';

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
  return fetchWithJarvis(`${origin}/${addUrlParameter(url, { t: Date.now() })}`, {
    ...options,
  }).then(response => {
    console.log('[API]', url, response);
    return response;
  });
};

export const extractResponseData = (response) => {
  return _.get(response, 'response-data', {});
};
