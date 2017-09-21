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

const isVMSServiceError = (res) => {
  return _.get(res, '0.message', '').toUpperCase() === 'SUCCESSFUL';
};

const convertVMSServiceResponseToError = (res) => {
  return new ApplicationError({
    type: getErrorType(res),
    trxId: _.get(res, 'trx-id', ''),
    processInstance: _.get(res, 'process-instance', ''),
    status: _.get(res, 'status', ''),
    fault: _.get(res, 'fault', {}),
    displayMessages: _.get(res, 'display-messages', []),
  });
};

const convertApplicationErrorToError = (errorMessage) => {
  /*
    type: '',
    code: '',
    th: '',
    en: '',
    technical: '',
  */
  return new ApplicationError({
    type: _.get(errorMessage, 'type', ''),
    fault: {
      name: '',
      code: _.get(errorMessage, 'code', ''),
      message: '',
      'detailed-message': '',
    },
    displayMessages: [
      {
        'th-message': _.get(errorMessage, 'th', ''),
        'en-message': _.get(errorMessage, 'en', ''),
        'technical-message': _.get(errorMessage, 'technical', ''),
      },
    ],
  });
};

class ApplicationError extends Error {
  constructor({ type, trxId, processInstance, fault, displayMessages }) {
    super(type);
    this.type = type || 'ERROR';
    this.trxId = trxId;
    this.processInstance = processInstance;
    // key of fault object
    this.code = _.get(fault, 'code', '');
    this.fault = fault || {};
    // key of display messages arrays
    this.displayMessages = displayMessages;
    this.message = {
      th: _.get(displayMessages, '0.th-message', ''),
      en: _.get(displayMessages, '0.en-message', ''),
      technical: _.get(displayMessages, '0.technical-message', ''),
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
