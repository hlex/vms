import _ from 'lodash';
import cuid from 'cuid';

export const normalizeStripAds = (ad, baseURL = '') => ({
  name: ad.name || '',
  type: ad.type || '',
  src: `${baseURL}${ad.path || ''}`,
  duration: Number(ad.timeout || 0) / 1000,
  adSize: ad.adSize || '',
});
// const isSoldout = () => _.random(1, 5) === 5;
export const isSoldout = (qty) => qty === 0;
const randomQty = () => _.random(0, 5);
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
export const convertToAppProduct = (product, baseURL = '') => {
  const ads = _.isArray(product.Po_ImgAd || '')
  ? product.Po_ImgAd || ''
  : [{ Ad_Url: product.Po_ImgAd || '', Ad_Second: '5' }];
  return {
    cuid: cuid(),
    id: product.Po_ID || '',
    name: product.Po_Name || '',
    price: Number(product.Po_Price || ''),
    isSoldout: isSoldout(product.Qty || randomQty()),
    image: product.Po_Img || '',
    imageBig: product.Po_Imgbig || '',
    row: product.Row || '',
    col: product.Column || '',
    slotNo: product.SlotNo || '',
    isDropped: false,
    isFree: (product.Free || '').toUpperCase() === 'YES',
    ads: _.map(ads, ad => normalizeStripAds(convertToAppAd(ad), baseURL)),
    qty: product.Qty || 0,
  };
};

export const convertToAppPromotion = (promotion, baseURL) => {
  // console.log('convertToAppPromotion', promotion, baseURL);
  const ads = _.isArray(promotion.Pro_ImgAd)
  ? promotion.Pro_ImgAd
  : [{ Ad_Url: promotion.Pro_ImgAd, Ad_Second: '5' }];
  const products = promotion.products; // _.map(promotion.Product_List || [], (product) => convertToAppProduct(product));
  return {
    cuid: cuid(),
    id: promotion.Pro_ID,
    products,
    price: _.sumBy(products, product => Number(product.price)) - Number(promotion.Discount_Price),
    image: _.get(promotion, 'Pro_Imgbig', ''),
    ads: _.map(ads, ad => normalizeStripAds(convertToAppAd(ad), baseURL)),
    hasSomeProductThatEveryPhysicalIsFree: promotion.hasSomeProductThatEveryPhysicalIsFree || false
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
export const convertToAppMobileTopupProvider = (mobileTopupProvider, baseURL) => {
  const ads = _.isArray(mobileTopupProvider.Topup_ImgAd)
  ? mobileTopupProvider.Topup_ImgAd
  : [{ Ad_Url: mobileTopupProvider.Topup_ImgAd, Ad_Second: '5' }];
  return {
    cuid: cuid(),
    id: mobileTopupProvider.Topup_ID,
    banner: mobileTopupProvider.Topup_Imgbig,
    src: mobileTopupProvider.Topup_Img,
    serviceCode: mobileTopupProvider.Topup_ServiceCode,
    name: mobileTopupProvider.Topup_Name.en,
    names: mobileTopupProvider.Topup_Name,
    ads: _.map(ads, ad => normalizeStripAds(convertToAppAd(ad), baseURL)),
    topupValues: _.map(mobileTopupProvider.Topup_Value || [], topupValue => convertToAppMobileTopupValue(topupValue))
  };
};

export const convertToAppMobileTopupValue = (mobileTopupValue) => {
  return {
    cuid: cuid(),
    id: cuid(),
    value: mobileTopupValue.Amount,
    fee: mobileTopupValue.Service_Charge
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
  const isVideo = (ad.Ad_Url || '').indexOf('.mp4') >= 0;
  const second = ad.Ad_Second === 0 ? 10000 : (ad.Ad_Second || 1000);
  return {
    id: ad.Ad_ID || cuid(),
    type: (ad.Ad_Type || '') === 'V' && isVideo ? 'video' : 'image',
    name: ad.Ad_ID || '',
    path: ad.Ad_Url || '',
    filename: ad.Ad_ID || '',
    expire: '', // '2026-11-21',
    timeout: Number(second) * 1000,
    checksum: '', // '47e93aec13f7c9115ebbcfaacb309ccd',
    adSize: ad.Ad_Display === 'F' ? 'FULLSCREEN' : 'STRIP',
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

export const convertToAppEvent = (event, baseURL) => {
  const eventInputActivities = _.filter(event.eventActivities || [], activity => activity.type === 'input');
  const eventWatchActivities = _.filter(event.eventActivities || [], activity => activity.type === 'watch');
  const ads = _.isArray(event.event_Ad)
  ? event.event_Ad
  : [{ Ad_Url: event.event_Ad, Ad_Second: '5' }];
  return {
    eventId: event.id,
    tag: _.head(event.tags),
    product: convertToAppProduct(_.get(event, 'products.0', _.get(event, 'product.0', {}), _.get(event, 'product', {}))),
    howTo: _.map(event.howTo, (instruction) => instruction),
    inputs: _.map(eventInputActivities || [], (eventInputActivity) => {
      return {
        ...eventInputActivity,
        cuid: cuid(),
        completed: false
      };
    }),
    watches: _.map(eventWatchActivities, (eventWatchActivity) => {
      const data = {
        ...eventWatchActivity.data,
        Ad_Second: eventWatchActivity.data.Ad_Second !== 0 ? eventWatchActivity.data.Ad_Second : 5,
      };
      return {
        ...eventWatchActivity,
        cuid: cuid(),
        completed: false,
        data: normalizeStripAds(convertToAppAd(data), baseURL),
      };
    }),
    rewards: _.map(event.rewards || [], (reward) => {
      return {
        ...reward,
        cuid: cuid(),
        completed: false
      };
    }),
    remarks: _.map(event.remarks || [], (remark) => {
      return {
        ...remark,
        cuid: cuid(),
        completed: false
      };
    }),
    ads: _.map(ads, ad => normalizeStripAds(convertToAppAd(ad), baseURL)),
  };
};

export const convertToAppText = (text) => {
  return {
    th: _.get(text, 'NameTh', ''),
    en: _.get(text, 'NameEn', ''),
  };
};


export const convertToAppMainMenu = (mainMenu, index) => {
  let linkTo;
  let src;
  const appText = convertToAppText(mainMenu);
  switch (index) {
    case 0:
      linkTo = 'product';
      src = 'images/bg-nav-one.png';
      break;
    case 1:
      linkTo = 'event';
      src = 'images/bg-nav-two.png';
      break;
    case 2:
      linkTo = 'topup';
      src = 'images/bg-nav-three.png';
      break;
    case 3:
      linkTo = '/salesman ';
      src = 'images/bg-nav-four.png';
      break;
    default:
      break;
  }
  return {
    title: appText,
    src,
    linkTo
  };
};
