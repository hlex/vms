import _ from 'lodash';
import cuid from 'cuid';

const isSoldout = () => _.random(1, 5) === 5;

/*
product: {
  Po_ID: 'PO0001',
  Po_Name: {
    th: 'แบรนด์ Gen U',
    en: 'แบรนด์ Gen U',
  },
  Po_Price: '45',
  Po_Img: 'images/product-20170819110019.png',
  Po_Imgbig: 'images/product-bg-20170819110019.png',
  Row: '1',
  Column: '1',
},
*/
export const convertToAppProduct = (product) => {
  return {
    cuid: cuid(),
    id: product.Po_ID || '',
    name: product.Po_Name || '',
    price: product.Po_Price || '',
    isSoldout: isSoldout() || true,
    image: product.Po_Img || '',
    imageBig: product.Po_Imgbig || '',
    row: product.Row || '',
    col: product.Column || '',
    isDropped: false,
  };
};

export const convertToAppAd = (ad) => {
  return {
    id: '4094',
    type: 'image',
    name: 'EMP_AIS_EMPStripAds',
    path: 'StripAds/20151204_ais_344.jpg',
    filename: '20151204_ais_344.jpg',
    expire: '2026-11-21',
    timeout: '5000',
    checksum: '47e93aec13f7c9115ebbcfaacb309ccd',
  };
  // return {
  //   cuid: cuid(),
  //   id: product.Po_ID || '',
  //   name: product.Po_Name || '',
  //   price: product.Po_Price || '',
  //   isSoldout: isSoldout() || true,
  //   image: product.Po_Img || '',
  //   imageBig: product.Po_Imgbig || '',
  //   row: product.Row || '',
  //   col: product.Column || '',
  //   isDropped: false,
  // };
};

export const convertToAppEvent = (event) => {
  const eventInputActivities = _.filter(event.eventActivities || [], activity => activity.type === 'input');
  const eventWatchActivities = _.filter(event.eventActivities || [], activity => activity.type === 'watch');
  return {
    eventId: event.id,
    tag: _.head(event.tags),
    product: convertToAppProduct(_.get(event, 'products.0', {})),
    howTo: _.map(event.howTo, (instruction) => {
      // const th = instruction.th || '';
      // const isMSISDN = /เบอร์มือถือ/i.test(th);
      // const isEmail = /อีเมล/i.test(th);
      // const isLineId = /line/i.test(th);
      // const isBarCode = /barcode/i.test(th);
      // const isQrCode = /qr/i.test(th);
      // if (isMSISDN) return (<span>{th}<img className="icon middle-line" src="images/icon-phone.png" height="30" /></span>);
      // if (isEmail) return (<span>{th}<img className="icon middle-line" src="images/icon-email.png" height="30" /></span>);
      // if (isLineId) return (<span>{th}<img className="icon middle-line" src="images/icon-linelogo.png" height="30" /></span>);
      // if (isBarCode) return (<span>{th}<img className="icon middle-line" src="images/icon-barcode.png" height="30" /></span>);
      // if (isQrCode) return (<span>{th}<img className="icon middle-line" src="images/icon-qrcode.png" height="30" /></span>);
      return instruction;
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
