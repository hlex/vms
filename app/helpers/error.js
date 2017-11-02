import _ from 'lodash';
/*
 * Declare logic to handle error of each backend teams
 * ==============================
 * Team name and members
 * ---------------------
 * VMSService = พี่เทพ
 */

// ======================================================
// Formats
// ======================================================
// VMSService
/*
  {
    "trx-id": "3B2YN30TRQ63",
    "status": "UNSUCCESSFUL",
    "process-instance": "tmsapnpr1 (instance: SFF_node2)",
    "fault": {
        "name": "th.co.truecorp.ads.order.flow.ActivityFlowNotFoundException",
        "code": "APP-500",
        "message": "Flow 17050400TLR010000058 was not found.",
        "detailed-message": "ActivityFlowNotFoundException Flow 17050400TLR010000058 was not found.. "
    },
    "display-messages": [
        {
            "message": "Flow 17050400TLR010000058 was not found.",
            "message-type": "ERROR",
            "en-message": "Flow 17050400TLR010000058 was not found.",
            "th-message": "Flow 17050400TLR010000058 was not found.",
            "technical-message": "tmsapnpr1 (instance: SFF_node2) ActivityFlowNotFoundException Flow 17050400TLR010000058 was not found.. "
        }
    ]
  }
*/
const getErrorType = (res) => {
  return 'ERROR'; // _.get(res, 'display-messages.0.message-type', 'ERROR');
};

const isVMSServiceError = (response) => {
  return response.fault !== undefined;
};

const convertVMSServiceResponseToError = (response) => {
  return new ApplicationError({
    type: getErrorType(response),
    trxId: _.get(response, 'trx-id', ''),
    processInstance: _.get(response, 'process-instance', ''),
    status: _.get(response, 'status', ''),
    fault: _.get(response, 'fault', {}),
  });
};

const convertApplicationErrorToError = (message, type = 'ERRRO') => {
  /*
    type: '',
    code: '',
    th: '',
    en: '',
    technical: '',
  */
  return new ApplicationError({
    trxId: Date.now(),
    processInstance: 'Frontend',
    type,
    fault: {
      'th-message': message.th || '',
      'en-message': message.en || '',
    },
  });
};

class ApplicationError extends Error {
  constructor({ type, trxId, processInstance, fault }) {
    super(type);
    this.type = type || 'ERROR';
    this.trxId = trxId;
    this.processInstance = processInstance;
    this.messages = {
      th: _.get(fault, 'th-message', ''),
      en: _.get(fault, 'en-message', ''),
      technical: _.get(fault, 'vtype', ''),
    };
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(type)).stack;
    }
  }
}

export {
  isVMSServiceError,
  convertVMSServiceResponseToError,
  convertApplicationErrorToError,
  ApplicationError,
};
