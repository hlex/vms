import _ from 'lodash';
import { handleResponseCatchError, convertToURLParam } from 'api-jarvis';
import { fetchFacade } from '../helpers/api';
import { isVMSServiceError, convertVMSServiceResponseToError } from '../helpers/error';
import URL from './url';

export const serviceGetEventReward = ({ eventId, discountType, amount, channel }) => {
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve(true);
  //   }, 1000);
  // });
  const data = {
    vtype: 'getdiscountcode',
    id: eventId,
    discounttype: discountType,
    amount,
    channel
  };
  return fetchFacade(`${URL.getEventReward}${convertToURLParam(data)}`).then((response) => {
    console.log('serviceGetEventReward', response);
    const responseDiscount = _.head(response);
    // handleResponseCatchError(response, isVMSServiceError, convertVMSServiceResponseToError);
    if (responseDiscount.status === 1) {
      throw new Error('serviceGetEventReward');
    }
    return responseDiscount;
  });
};
