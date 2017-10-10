import _ from 'lodash';

export const convertToAppEvent = (event) => {
  const eventInputActivities = _.filter(event.eventActivities || [], activity => activity.type === 'input');
  const eventWatchActivities = _.filter(event.eventActivities || [], activity => activity.type === 'watch');
  return {
    tag: _.head(event.tags),
    product: event.product || {},
    productPrice: _.get(event, 'product.Po_Price', 0),
    productImage: 'images/product-2.png', // _.get(event, 'product.Po_Img', 0),
    howTo: _.map(event.howTo, (instruction) => {
      const th = instruction.th || '';
      const isMSISDN = /เบอร์มือถือ/i.test(th);
      const isEmail = /อีเมล/i.test(th);
      const isLineId = /line/i.test(th);
      const isBarCode = /barcode/i.test(th);
      const isQrCode = /qr/i.test(th);
      if (isMSISDN) return (<span>{th}<img className="icon middle-line" src="images/icon-phone.png" height="30" /></span>);
      if (isEmail) return (<span>{th}<img className="icon middle-line" src="images/icon-email.png" height="30" /></span>);
      if (isLineId) return (<span>{th}<img className="icon middle-line" src="images/icon-linelogo.png" height="30" /></span>);
      if (isBarCode) return (<span>{th}<img className="icon middle-line" src="images/icon-barcode.png" height="30" /></span>);
      if (isQrCode) return (<span>{th}<img className="icon middle-line" src="images/icon-qrcode.png" height="30" /></span>);
      return th;
    }),
    inputs: _.map(eventInputActivities || [], (eventInputActivity) => {
      return {
        ...eventInputActivity,
        completed: false
      };
    }),
    watches: _.map(eventWatchActivities, (eventWatchActivity) => {
      return {
        ...eventWatchActivity,
        completed: false
      };
    }),
    rewards: _.map(event.rewards || [], (reward) => {
      return {
        ...reward,
        completed: false
      };
    }),
    remarks: _.map(event.remarks || [], (remark) => {
      return {
        ...remark,
        completed: false
      };
    }),
  };
};
