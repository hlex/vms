import { fetchWithJarvis, convertToURLParam } from 'api-jarvis';
import _ from 'lodash';

const baseURL = 'http://27.254.160.247:81';

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

export const fetchFacade = (url, options) => fetchWithJarvis(`${baseURL}/${addUrlParameter(url, { t: Date.now() })}`, {
  ...options,
}).then(response => response);

export const extractResponseData = (response) => {
  return _.get(response, 'response-data', {});
};
