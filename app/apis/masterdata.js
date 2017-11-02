import _ from 'lodash';
import { handleResponseCatchError, convertToURLParam } from 'api-jarvis';
import { fetchFacade } from '../helpers/api';
import { isVMSServiceError, convertVMSServiceResponseToError } from '../helpers/error';
import { convertToAppEvent } from '../helpers/masterdata';
import URL from './url';

const rewardSMSChannel = 'SMS';
const rewardEmailChannel = 'EMAIL';
const rewardVendingMachineNow = 'VENDING_MACHINE_NOW';
const rewardVendingMachineCode = 'VENDING_MACHINE_CODE';
const rewardDiscountType = 'DISCOUNT';
const rewardProductName = 'product';
const rewardMobileTopupName = 'topup';
const tagDiscountLabel = 'ส่วนลด';
const tagFreeLabel = 'รับฟรี';
const tagMobileTopupLabel = 'เติมเงินฟรี';
const tagValue = '2';
const adDuration = '5';
const rewardValue = '5';
const discountTag = {
  name: 'A', // B
  color: 'RED', // RED GREEN BLUE MINT YELLOW PURPLE
  label: tagDiscountLabel, // free text..
  unit: 'บาท', // free text..
  value: tagValue // integer.. เช่น 10, 20, 100
};
const freeTag = {
  name: 'A', // B
  color: 'MINT', // RED GREEN BLUE MINT YELLOW PURPLE
  label: tagFreeLabel, // free text..
  unit: 'ชิ้น', // free text..
  value: 1 // integer.. เช่น 10, 20, 100
};
const mobileTopupTag = {
  name: 'B', // B
  color: 'YELLOW', // RED GREEN BLUE MINT YELLOW PURPLE
  label: tagMobileTopupLabel, // free text..
  unit: 'บาท', // free text..
  value: tagValue // integer.. เช่น 10, 20, 100
};
// ======================================================
// EVENTS
// ======================================================
const msisdnWithMobileTopup = {
  id: 1001,
  eventType: '',
  eventActivities: [
    {
      type: 'input',
      name: 'MSISDN',
      value: null,
    },
    {
      type: 'watch',
      name: 'WATCH_ADS',
      value: null,
      data: {
        name: 'EMP_EMPMag_EMPStripAds',
        type: 'image',
        src: 'http://localhost:8888/vms/StripAds/20161007_emp_magazine-no33_344.jpg',
        duration: Number(adDuration),
      }
    },
  ],
  rewards: [
    {
      type: rewardDiscountType,
      name: rewardMobileTopupName,
      code: '1001',
      value: rewardValue,
      channel: rewardSMSChannel,
      expireDate: '2017-12-01',
    },
  ],
  remarks: [
    {
      th: '',
      en: '',
      verifyKey: '',
    },
  ],
  tags: [
    mobileTopupTag
  ],
  howTo: [
    {
      order: 1,
      th: 'ใส่ หมายเลข',
      en: 'ใส่ หมายเลข',
    },
    {
      order: 2,
      th: `ชม โฆษณา ${adDuration} วินาที`,
      en: `ชม โฆษณา ${adDuration} วินาที`,
    },
    {
      order: 3,
      th: `รับเติมเงินฟรี ${rewardValue} ทาง SMS`,
      en: `รับเติมเงินฟรี ${rewardValue} ทาง SMS`,
    },
  ],
  products: [
    {
      Po_ID: 'PO0001',
      Po_Name: {
        th: 'แบรนด์ Gen U',
        en: 'แบรนด์ Gen U',
      },
      Po_Price: '35',
      Po_Img: 'images/product-1.png',
      Row: '1',
      Column: '1',
    }
  ],
};
const msisdnWithProductDiscount = {
  id: 1002,
  eventType: '',
  eventActivities: [
    {
      type: 'input',
      name: 'MSISDN',
      value: null,
    },
    {
      type: 'watch',
      name: 'WATCH_ADS',
      value: null,
      data: {
        name: 'EMP_EMPMag_EMPStripAds',
        type: 'image',
        src: 'http://localhost:8888/vms/StripAds/20161007_emp_magazine-no33_344.jpg',
        duration: Number(adDuration),
      }
    },
  ],
  rewards: [
    {
      type: rewardDiscountType,
      name: rewardProductName,
      code: '1002',
      value: rewardValue,
      channel: rewardSMSChannel,
      expireDate: '2017-12-01',
    },
  ],
  remarks: [
    {
      th: '',
      en: '',
      verifyKey: '',
    },
  ],
  tags: [
    discountTag
  ],
  howTo: [
    {
      order: 1,
      th: 'ใส่ หมายเลข',
      en: 'ใส่ หมายเลข',
    },
    {
      order: 2,
      th: `ชม โฆษณา ${adDuration} วินาที`,
      en: `ชม โฆษณา ${adDuration} วินาที`,
    },
    {
      order: 3,
      th: `รับส่วนลด ${rewardValue} ทาง SMS`,
      en: `รับส่วนลด ${rewardValue} ทาง SMS`,
    },
  ],
  products: [
    {
      Po_ID: 'PO0001',
      Po_Name: {
        th: 'แบรนด์ Gen U',
        en: 'แบรนด์ Gen U',
      },
      Po_Price: '35',
      Po_Img: 'images/product-1.png',
      Po_Imgbig: 'images/product-1.png',
      Row: '1',
      Column: '1',
    }
  ],
};
const msisdnWithProductFree = {
  id: 1002,
  eventType: '',
  eventActivities: [
    {
      type: 'input',
      name: 'MSISDN',
      value: null,
    },
    {
      type: 'watch',
      name: 'WATCH_ADS',
      value: null,
      data: {
        name: 'EMP_EMPMag_EMPStripAds',
        type: 'image',
        src: 'http://localhost:8888/vms/StripAds/20161007_emp_magazine-no33_344.jpg',
        duration: Number(adDuration),
      }
    },
  ],
  rewards: [
    {
      type: rewardDiscountType,
      name: rewardProductName,
      code: '1002',
      value: '35',
      channel: rewardSMSChannel,
      expireDate: '2017-12-01',
    },
  ],
  remarks: [
    {
      th: '',
      en: '',
      verifyKey: '',
    },
  ],
  tags: [
    freeTag
  ],
  howTo: [
    {
      order: 1,
      th: 'ใส่ หมายเลข',
      en: 'ใส่ หมายเลข',
    },
    {
      order: 2,
      th: `ชม โฆษณา ${adDuration} วินาที`,
      en: `ชม โฆษณา ${adDuration} วินาที`,
    },
    {
      order: 3,
      th: 'รับฟรี แบรนด์ Gen U มูลค่า 35 บาท',
      en: 'รับฟรี แบรนด์ Gen U มูลค่า 35 บาท',
    },
  ],
  products: [
    {
      Po_ID: 'PO0001',
      Po_Name: {
        th: 'แบรนด์ Gen U',
        en: 'แบรนด์ Gen U',
      },
      Po_Price: '35',
      Po_Img: 'images/product-1.png',
      Po_Imgbig: 'images/product-1.png',
      Row: '1',
      Column: '1',
    }
  ],
};
const emailWithMobileTopup = {
  id: 1003,
  eventType: '',
  eventActivities: [
    {
      type: 'input',
      name: 'EMAIL',
      value: null,
    },
    {
      type: 'watch',
      name: 'WATCH_ADS',
      value: null,
      data: {
        name: 'EMP_TripAdvisor_EMPStripAds',
        type: 'image',
        src: 'http://localhost:8888/vms/StripAds/20160205_emporium_en_trioadvisor_1080_344.png',
        duration: Number(adDuration),
      }
    },
  ],
  rewards: [
    {
      type: rewardDiscountType,
      name: rewardMobileTopupName,
      value: rewardValue,
      code: '1003',
      channel: rewardEmailChannel,
      expireDate: '2017-11-01',
    },
  ],
  remarks: [
    {
      th: '',
      en: '',
      verifyKey: '',
    },
  ],
  tags: [
    mobileTopupTag
  ],
  howTo: [
    {
      order: 1,
      th: 'ใส่ อีเมล',
      en: 'ใส่ อีเมล',
    },
    {
      order: 2,
      th: `ชม โฆษณา ${adDuration} วินาที`,
      en: `ชม โฆษณา ${adDuration} วินาที`,
    },
    {
      order: 3,
      th: `รับเติมเงินฟรี ${rewardValue} ทาง อีเมล`,
      en: `รับเติมเงินฟรี ${rewardValue} ทาง อีเมล`,
    },
  ],
  products: [
    {
      Po_ID: 'PO0002',
      Po_Name: {
        th: 'แบรนด์ Gen U',
        en: 'แบรนด์ Gen U',
      },
      Po_Price: '35',
      Po_Img: 'images/product-1.png',
      Po_Imgbig: 'images/product-1.png',
      Row: '1',
      Column: '1',
    }
  ],
};
const emailWithProductDiscount = {
  id: 1004,
  eventType: '',
  eventActivities: [
    {
      type: 'input',
      name: 'EMAIL',
      value: null,
    },
    {
      type: 'watch',
      name: 'WATCH_ADS',
      value: null,
      data: {
        name: 'EMP_TripAdvisor_EMPStripAds',
        type: 'image',
        src: 'http://localhost:8888/vms/StripAds/20160205_emporium_en_trioadvisor_1080_344.png',
        duration: Number(adDuration),
      }
    },
  ],
  rewards: [
    {
      type: rewardDiscountType,
      name: rewardProductName,
      value: rewardValue,
      code: '12345',
      channel: rewardEmailChannel,
      expireDate: '2017-11-01',
    },
  ],
  remarks: [
    {
      th: '',
      en: '',
      verifyKey: '',
    },
  ],
  tags: [
    discountTag
  ],
  howTo: [
    {
      order: 1,
      th: 'ใส่ อีเมล',
      en: 'ใส่ อีเมล',
    },
    {
      order: 2,
      th: `ชม โฆษณา ${adDuration} วินาที`,
      en: `ชม โฆษณา ${adDuration} วินาที`,
    },
    {
      order: 3,
      th: `รับส่วนลด ${rewardValue} ทาง อีเมล`,
      en: `รับส่วนลด ${rewardValue} ทาง อีเมล`,
    },
  ],
  products: [
    {
      Po_ID: 'PO0002',
      Po_Name: {
        th: 'แบรนด์ Gen U',
        en: 'แบรนด์ Gen U',
      },
      Po_Price: '35',
      Po_Img: 'images/product-1.png',
      Po_Imgbig: 'images/product-1.png',
      Row: '1',
      Column: '1',
    }
  ],
};
const emailWithProductFree = {
  id: 1004,
  eventType: '',
  eventActivities: [
    {
      type: 'input',
      name: 'EMAIL',
      value: null,
    },
    {
      type: 'watch',
      name: 'WATCH_ADS',
      value: null,
      data: {
        name: 'EMP_TripAdvisor_EMPStripAds',
        type: 'image',
        src: 'http://localhost:8888/vms/StripAds/20160205_emporium_en_trioadvisor_1080_344.png',
        duration: Number(adDuration),
      }
    },
  ],
  rewards: [
    {
      type: rewardDiscountType,
      name: rewardProductName,
      value: '35',
      code: '12345',
      channel: rewardEmailChannel,
      expireDate: '2017-11-01',
    },
  ],
  remarks: [
    {
      th: '',
      en: '',
      verifyKey: '',
    },
  ],
  tags: [
    freeTag
  ],
  howTo: [
    {
      order: 1,
      th: 'ใส่ อีเมล',
      en: 'ใส่ อีเมล',
    },
    {
      order: 2,
      th: `ชม โฆษณา ${adDuration} วินาที`,
      en: `ชม โฆษณา ${adDuration} วินาที`,
    },
    {
      order: 3,
      th: 'รับฟรี แบรนด์ Gen U มูลค่า 35 บาท',
      en: 'รับฟรี แบรนด์ Gen U มูลค่า 35 บาท',
    },
  ],
  products: [
    {
      Po_ID: 'PO0002',
      Po_Name: {
        th: 'แบรนด์ Gen U',
        en: 'แบรนด์ Gen U',
      },
      Po_Price: '35',
      Po_Img: 'images/product-1.png',
      Po_Imgbig: 'images/product-1.png',
      Row: '1',
      Column: '1',
    }
  ],
};
const lineIdWithMobileTopup = {
  id: 1005,
  eventType: '',
  eventActivities: [
    {
      type: 'input',
      name: 'LINE_ID',
      value: null,
    },
  ],
  rewards: [
    {
      type: rewardDiscountType,
      name: rewardMobileTopupName,
      value: '10',
      code: '1005',
      channel: 'LINE_ID',
      expireDate: '2017-11-01',
    },
  ],
  remarks: [
    {
      th: '',
      en: '',
      verifyKey: '',
    },
  ],
  tags: [
    mobileTopupTag
  ],
  howTo: [
    {
      order: 1,
      th: 'เพิ่มเพื่อนใน LINE ID',
      en: 'เพิ่มเพื่อนใน LINE ID',
    },
    {
      order: 2,
      th: 'ชมโฆษณาใน LINE',
      en: 'ชมโฆษณาใน LINE',
    },
    {
      order: 3,
      th: 'รับรหัสเติมเงินใน LINE',
      en: 'รับรหัสเติมเงินใน LINE',
    },
  ],
  products: [
    {
      Po_ID: 'PO0002',
      Po_Name: {
        th: 'แบรนด์ Gen U',
        en: 'แบรนด์ Gen U',
      },
      Po_Price: '35',
      Po_Img: 'images/product-1.png',
      Row: '1',
      Column: '1',
    }
  ],
};
const lineIdWithProductDiscount = {
  id: 1006,
  eventType: '',
  eventActivities: [
    {
      type: 'input',
      name: 'LINE_ID',
      value: null,
    },
  ],
  rewards: [
    {
      type: rewardDiscountType,
      name: rewardProductName,
      value: rewardValue,
      code: '1006',
      channel: 'LINE_ID',
      expireDate: '2017-11-01',
    },
  ],
  remarks: [
    {
      th: '',
      en: '',
      verifyKey: '',
    },
  ],
  tags: [
    discountTag
  ],
  howTo: [
    {
      order: 1,
      th: 'เพิ่มเพื่อนใน LINE ID',
      en: 'เพิ่มเพื่อนใน LINE ID',
    },
    {
      order: 2,
      th: 'ชมโฆษณาใน LINE',
      en: 'ชมโฆษณาใน LINE',
    },
    {
      order: 3,
      th: 'รับรหัสส่วนลดใน LINE',
      en: 'รับรหัสส่วนลดใน LINE',
    },
  ],
  products: [
    {
      Po_ID: 'PO0002',
      Po_Name: {
        th: 'แบรนด์ Gen U',
        en: 'แบรนด์ Gen U',
      },
      Po_Price: '35',
      Po_Img: 'images/product-10.png',
      Po_Imgbig: 'images/product-10.png',
      Row: '1',
      Column: '1',
    }
  ],
};
const lineIdWithProductFree = {
  id: 1006,
  eventType: '',
  eventActivities: [
    {
      type: 'input',
      name: 'LINE_ID',
      value: null,
    },
  ],
  rewards: [
    {
      type: rewardDiscountType,
      name: rewardProductName,
      value: '35',
      code: '1006',
      channel: 'LINE_ID',
      expireDate: '2017-11-01',
    },
  ],
  remarks: [
    {
      th: '',
      en: '',
      verifyKey: '',
    },
  ],
  tags: [
    freeTag
  ],
  howTo: [
    {
      order: 1,
      th: 'เพิ่มเพื่อนใน LINE ID',
      en: 'เพิ่มเพื่อนใน LINE ID',
    },
    {
      order: 2,
      th: 'ชมโฆษณาใน LINE',
      en: 'ชมโฆษณาใน LINE',
    },
    {
      order: 3,
      th: 'รับรหัสส่วนลดใน LINE',
      en: 'รับรหัสส่วนลดใน LINE',
    },
  ],
  products: [
    {
      Po_ID: 'PO0002',
      Po_Name: {
        th: 'แบรนด์ Gen U',
        en: 'แบรนด์ Gen U',
      },
      Po_Price: '35',
      Po_Img: 'images/product-10.png',
      Po_Imgbig: 'images/product-10.png',
      Row: '1',
      Column: '1',
    }
  ],
};
const barcodePlusLineQrcodeWithMobileTopupNow = {
  id: 1007,
  eventType: '',
  eventActivities: [
    {
      type: 'input',
      name: 'BARCODE',
      value: null,
    },
    {
      type: 'input',
      name: 'LINE_QR_CODE',
      value: null,
    },
  ],
  rewards: [
    {
      type: rewardDiscountType,
      name: rewardMobileTopupName,
      value: rewardValue,
      code: '1007',
      channel: rewardVendingMachineNow,
      expireDate: '2017-11-01',
    },
  ],
  remarks: [
    {
      th: 'จำกัด 1 สิทธิ์ต่อ 1 LINE ID',
      en: 'จำกัด 1 สิทธิ์ต่อ 1 LINE ID',
      verifyKey: 'LINE_ID',
    },
  ],
  tags: [
    mobileTopupTag
  ],
  howTo: [
    {
      order: 1,
      th: 'สแกน Barcode',
      en: 'สแกน Barcode',
    },
    {
      order: 2,
      th: 'สแกน LINE QR CODE ของท่าน',
      en: 'สแกน LINE QR CODE ของท่าน',
    },
    {
      order: 3,
      th: 'รับฟรีเติมเงิน 2 บาท ต้องใช้ทันที',
      en: 'รับฟรีเติมเงิน 2 บาท ต้องใช้ทันที',
    },
  ],
  products: [
    {
      Po_ID: 'PO0002',
      Po_Name: {
        th: 'แบรนด์ Gen U',
        en: 'แบรนด์ Gen U',
      },
      Po_Price: '35',
      Po_Img: 'images/product-1.png',
      Po_Imgbig: 'images/product-1.png',
      Row: '1',
      Column: '1',
    }
  ],
};
const barcodePlusLineQrcodeWithMobileTopupCode = {
  id: 1007,
  eventType: '',
  eventActivities: [
    {
      type: 'input',
      name: 'BARCODE',
      value: null,
    },
    {
      type: 'input',
      name: 'LINE_QR_CODE',
      value: null,
    },
  ],
  rewards: [
    {
      type: rewardDiscountType,
      name: rewardMobileTopupName,
      value: rewardValue,
      code: '1007',
      channel: rewardVendingMachineCode,
      expireDate: '2017-11-01',
    },
  ],
  remarks: [
    {
      th: 'จำกัด 1 สิทธิ์ต่อ 1 LINE ID',
      en: 'จำกัด 1 สิทธิ์ต่อ 1 LINE ID',
      verifyKey: 'LINE_ID',
    },
  ],
  tags: [
    mobileTopupTag
  ],
  howTo: [
    {
      order: 1,
      th: 'สแกน Barcode',
      en: 'สแกน Barcode',
    },
    {
      order: 2,
      th: 'สแกน LINE QR CODE ของท่าน',
      en: 'สแกน LINE QR CODE ของท่าน',
    },
    {
      order: 3,
      th: 'รับฟรีเติมเงิน 2 บาทต้องใช้ทันที',
      en: 'รับฟรีเติมเงิน 2 บาทต้องใช้ทันที',
    },
  ],
  products: [
    {
      Po_ID: 'PO0002',
      Po_Name: {
        th: 'แบรนด์ Gen U',
        en: 'แบรนด์ Gen U',
      },
      Po_Price: '35',
      Po_Img: 'images/product-1.png',
      Po_Imgbig: 'images/product-1.png',
      Row: '1',
      Column: '1',
    }
  ],
};
const barcodePlusLineQrcodeWithProductDiscountNow = {
  id: 1007,
  eventType: '',
  eventActivities: [
    {
      type: 'input',
      name: 'BARCODE',
      value: null,
    },
    {
      type: 'input',
      name: 'LINE_QR_CODE',
      value: null,
    },
  ],
  rewards: [
    {
      type: rewardDiscountType,
      name: rewardProductName,
      value: rewardValue,
      code: '1007',
      channel: rewardVendingMachineNow,
      expireDate: '2017-11-01',
    },
  ],
  remarks: [
    {
      th: 'จำกัด 1 สิทธิ์ต่อ 1 LINE ID',
      en: 'จำกัด 1 สิทธิ์ต่อ 1 LINE ID',
      verifyKey: 'LINE_ID',
    },
  ],
  tags: [
    discountTag
  ],
  howTo: [
    {
      order: 1,
      th: 'สแกน Barcode',
      en: 'สแกน Barcode',
    },
    {
      order: 2,
      th: 'สแกน LINE QR CODE ของท่าน',
      en: 'สแกน LINE QR CODE ของท่าน',
    },
    {
      order: 3,
      th: 'รับส่วนลด Brand Gen U 2 บาท',
      en: 'รัยส่วนลด Brand Gen U 2 บาท',
    },
  ],
  products: [
    {
      Po_ID: 'PO0002',
      Po_Name: {
        th: 'แบรนด์ Gen U',
        en: 'แบรนด์ Gen U',
      },
      Po_Price: '35',
      Po_Img: 'images/product-1.png',
      Po_Imgbig: 'images/product-1.png',
      Row: '1',
      Column: '1',
    }
  ],
};
const barcodeWithMobileTopupNow = {
  id: 1007,
  eventType: '',
  eventActivities: [
    {
      type: 'input',
      name: 'BARCODE',
      value: null,
    },
  ],
  rewards: [
    {
      type: rewardDiscountType,
      name: rewardMobileTopupName,
      value: rewardValue,
      code: '1007',
      channel: rewardVendingMachineNow,
      expireDate: '2017-11-01',
    },
  ],
  remarks: [],
  tags: [
    discountTag
  ],
  howTo: [
    {
      order: 1,
      th: 'สแกน Barcode',
      en: 'สแกน Barcode',
    },
    {
      order: 2,
      th: 'รับฟรีเติมเงิน 2 บาท ต้องใช้ทันที',
      en: 'รับฟรีเติมเงิน 2 บาท ต้องใช้ทันที',
    },
  ],
  products: [
    {
      Po_ID: 'PO0002',
      Po_Name: {
        th: 'แบรนด์ Gen U',
        en: 'แบรนด์ Gen U',
      },
      Po_Price: '35',
      Po_Img: 'images/product-1.png',
      Po_Imgbig: 'images/product-1.png',
      Row: '1',
      Column: '1',
    }
  ],
};
const qrcodePlusLineQrcodeWithProductFreeCode =  {
  id: 1007,
  eventType: '',
  eventActivities: [
    {
      type: 'input',
      name: 'QR_CODE',
      value: null,
    },
    {
      type: 'input',
      name: 'LINE_QR_CODE',
      value: null,
    },
  ],
  rewards: [
    {
      type: rewardDiscountType,
      name: rewardProductName,
      value: '35',
      code: '1007',
      channel: rewardVendingMachineCode,
      expireDate: '2017-11-01',
    },
  ],
  remarks: [],
  tags: [
    freeTag
  ],
  howTo: [
    {
      order: 1,
      th: 'สแกน QR Code',
      en: 'สแกน QR Code',
    },
    {
      order: 1,
      th: 'สแกน Line QR Code ของท่าน',
      en: 'สแกน Line QR Code ของท่าน',
    },
    {
      order: 2,
      th: 'รับฟรีสินค้ามูลค่า 35 บาท ต้องใช้ทันที',
      en: 'รับฟรีสินค้ามูลค่า 35 บาท ต้องใช้ทันที',
    },
  ],
  products: [
    {
      Po_ID: 'PO0002',
      Po_Name: {
        th: 'แบรนด์ Gen U',
        en: 'แบรนด์ Gen U',
      },
      Po_Price: '35',
      Po_Img: 'images/product-1.png',
      Po_Imgbig: 'images/product-1.png',
      Row: '1',
      Column: '1',
    }
  ],
};
let mockupEvents = [
  msisdnWithMobileTopup,
  // msisdnWithProductDiscount,
  // msisdnWithProductFree,
  // emailWithMobileTopup,
  emailWithProductDiscount,
  // emailWithProductFree,
  // lineIdWithMobileTopup,
  // lineIdWithProductDiscount,
  lineIdWithProductFree,
  barcodePlusLineQrcodeWithMobileTopupNow,
  // barcodePlusLineQrcodeWithMobileTopupCode,
  barcodePlusLineQrcodeWithProductDiscountNow,
  // barcodePlusLineQrcodeWithProductDiscountCode,
  // barcodePlusLineQrcodeWithProductFreeNow,
  // barcodePlusLineQrcodeWithProductFreeCode,
  // barcodeWithMobileTopupNow,
  // - barcodeWithMobileTopupCode,
  // barcodeWithProductDiscountNow,
  // barcodeWithProductDiscountCode,
  // barcodeWithProductFreeNow,
  // - barcodeWithProductFreeCode,
  // qrcodePlusLineQrcodeWithMobileTopupNow,
  // qrcodePlusLineQrcodeWithMobileTopupCode,
  // qrcodePlusLineQrcodeWithProductDiscountNow,
  // qrcodePlusLineQrcodeWithProductDiscountCode,
  // - qrcodePlusLineQrcodeWithProductFreeNow,
  // qrcodePlusLineQrcodeWithProductFreeCode,
  // qrcodeWithMobileTopupNow,
  // qrcodeWithMobileTopupCode,
  // qrcodeWithProductDiscountNow,
  // qrcodeWithProductDiscountCode,
  // qrcodeWithProductFreeNow,
  // qrcodeWithProductFreeCode,
];

mockupEvents = _.map(mockupEvents, (event, index) => {
  const eventId = `100${index + 1}`;
  const reward = {
    ..._.get(event, 'rewards.0', {}),
    code: eventId
  };
  return {
    ...event,
    id: eventId,
    rewards: [
      reward
    ],
  };
});

export const serviceGetEvents = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(_.map(mockupEvents, (event) => {
        return convertToAppEvent(event);
      }));
    }, 100);
  });
  // const data = {
  //   vtype: 'verifydiscountcode',
  //   code: '1111111111111',
  // };
  // return fetchFacade(`${URL.verifyDiscount}${convertToURLParam(data)}`).then((response) => {
  //   console.log('serviceVerifyDiscountCode', response);
  //   const responseDiscount = _.head(response);
  //   // handleResponseCatchError(response, isVMSServiceError, convertVMSServiceResponseToError);
  //   if (responseDiscount.status === 1) {
  //     throw new Error('serviceVerifyDiscountCode');
  //   }
  //   return responseDiscount;
  // });
};
