import _ from 'lodash';
import cuid from 'cuid';

export const normalizeStripAds = (ad, baseURL = '') => ({
  name: ad.name || '',
  type: ad.type || '',
  src: `${baseURL}${ad.path || ''}`,
  duration: Number(ad.timeout || 0) / 1000,
  adSize: ad.adSize || '',
});
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
    price: Number(product.Po_Price || ''),
    isSoldout: isSoldout(),
    image: product.Po_Img || '',
    imageBig: product.Po_Imgbig || '',
    row: product.Row || '',
    col: product.Column || '',
    isDropped: false,
  };
};

export const convertToAppPromotion = (promotion) => {
  const products = _.map(promotion.Product_List || [], (product) => convertToAppProduct(product));
  return {
    cuid: cuid(),
    id: promotion.Pro_ID,
    products,
    price: _.sumBy(products, product => Number(product.price)) - Number(promotion.Discount_Price),
    image: '',
  };
};

/*
{
  "Topup_ID": "1",
  "Topup_Name": {
      "th": "เอไอเอส",
      "en": "เอไอเอส"
  },
  "Topup_ServiceCode": "1001",
  "Topup_Img": "/uploads/images/topup-20170418141424.png",
  "Topup_Imgbig": "/uploads/images/topup-bg-20170819134443.png"
},
*/
export const convertToAppMobileTopupProvider = (mobileTopupProvider) => {
  return {
    cuid: cuid(),
    id: mobileTopupProvider.Topup_ID,
    banner: mobileTopupProvider.Topup_Imgbig,
    src: mobileTopupProvider.Topup_Img,
    serviceCode: mobileTopupProvider.Topup_ServiceCode,
    name: mobileTopupProvider.Topup_Name.en,
    names: mobileTopupProvider.Topup_Name,
  };
};

/*
{
  "status": "SUCCESSFUL",
  "trx-id": "20171109194928",
  "response-data": [
      {
          "Ad_ID": "AD002",
          "Ad_Type": "V",
          "Ad_Point": 50,
          "Ad_Second": 15,
          "Ad_Display": "F",
          "Ad_Url": "/uploads/banner/advertise-20170412095354.mp4"
      }
  ]
}
*/
export const convertToAppAd = (ad) => {
  return {
    id: ad.Ad_ID || cuid(),
    type: ad.Ad_Type === 'V' ? 'video' : 'image',
    name: ad.Ad_ID || '',
    path: ad.Ad_Url || '',
    filename: ad.Ad_ID || '',
    expire: '', // '2026-11-21',
    timeout: Number(ad.Ad_Second) * 1000,
    checksum: '', // '47e93aec13f7c9115ebbcfaacb309ccd',
    adSize: 'STRIP', // ad.Ad_Display === 'F' ? 'FULLSCREEN' : 'STRIP',
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
    ads: [normalizeStripAds('xxx', {
      id: '4226',
      type: 'image',
      name: 'EMP_BT_Gift17_EMPStripAds',
      path: 'StripAds/20161111_betrend-gift-2017_344.png',
      filename: '20161111_betrend-gift-2017_344.png',
      expire: '2026-11-21',
      timeout: '2000',
      adSize: 'STRIP',
      checksum: '0de9be00280a021661584f2a3af95319',
    })],
  };
};
