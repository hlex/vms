import _ from 'lodash';
import {
  SET_FOOTER_ADS,
  RESET_FOOTER_ADS,
  SET_BASE_ADS,
  REMEMBER_BASE_AD_PLAYING_INDEX
} from '../actions/actionTypes';
import {
  normalizeStripAds
} from '../helpers/masterdata';


const stripAds = [
  {
    id: '4103',
    type: 'image',
    name: 'EMP_TripAdvisor_EMPStripAds',
    path: 'StripAds/20160205_emporium_cn_tripadvisor_1080_344.png',
    filename: '20160205_emporium_cn_tripadvisor_1080_344.png',
    expire: '2026-11-21',
    timeout: '2000',
    adSize: 'STRIP',
    checksum: 'e0adb2162abf7192cb6060461e6af3fc',
  },
  {
    id: '4112',
    type: 'image',
    name: 'EMP_TripAdvisor_EMPStripAds',
    path: 'StripAds/20160205_emporium_en_trioadvisor_1080_344.png',
    filename: '20160205_emporium_en_trioadvisor_1080_344.png',
    expire: '2026-11-21',
    timeout: '2000',
    adSize: 'STRIP',
    checksum: '02a7b50c2ec2f200e89d1f92052aa470',
  },
  {
    id: '4096',
    type: 'image',
    name: 'EMP_AIS_EMPInteractiveDirectory',
    path: 'iDirectory/20151204_ais_1600.jpg',
    filename: '20151204_ais_1600.jpg',
    expire: '2026-11-21',
    timeout: '7000',
    adSize: 'FULLSCREEN',
    checksum: '37a0f9b3688943bfb6c15dab2ca88903',
  },
  {
    id: '4114',
    type: 'image',
    name: 'EMP_TripAdvisor_EMPInteractiveDirectory',
    path: 'iDirectory/20160205_emporium_en_tripadviso1080_1600_4.png',
    filename: '20160205_emporium_en_tripadviso1080_1600_4.png',
    expire: '2026-11-21',
    timeout: '7000',
    adSize: 'FULLSCREEN',
    checksum: '9e0847ca5c7b753bedd245cf61920773',
  },
  {
    id: '4121',
    type: 'image',
    name: 'EMP_ExpediaSp_EMPStripAds',
    path: 'StripAds/20160427_special-hotel-deals_344.png',
    filename: '20160427_special-hotel-deals_344.png',
    expire: '2026-11-21',
    timeout: '2000',
    adSize: 'STRIP',
    checksum: '9ca44783007073c11ca9d7a2cd777a3a',
  },
  {
    id: '4094',
    type: 'image',
    name: 'EMP_AIS_EMPStripAds',
    path: 'StripAds/20151204_ais_344.jpg',
    filename: '20151204_ais_344.jpg',
    expire: '2026-11-21',
    timeout: '2000',
    adSize: 'STRIP',
    checksum: '47e93aec13f7c9115ebbcfaacb309ccd',
  },
  {
    id: '4105',
    type: 'image',
    name: 'EMP_TripAdvisor_EMPInteractiveDirectory',
    path: 'iDirectory/20160205_emporium_cn_tripadvisor_1080_1600_4.png',
    filename: '20160205_emporium_cn_tripadvisor_1080_1600_4.png',
    expire: '2026-11-21',
    timeout: '7000',
    adSize: 'FULLSCREEN',
    checksum: 'ffe70577b2fa52a5db77988ba1329135',
  },
  {
    id: '4136',
    type: 'image',
    name: 'EMP_MCardPrv_EMPStripAds',
    path: 'StripAds/20160519_mcard-privilege_344.png',
    filename: '20160519_mcard-privilege_344.png',
    expire: '2026-11-21',
    timeout: '2000',
    adSize: 'STRIP',
    checksum: '5248ed312ff9e6ee626e258a588535af',
  },
  {
    id: '4145',
    type: 'image',
    name: 'EMP_Mcard_Matsuya_EMPStripAds',
    path: 'StripAds/20160617_m-card-matsaya-ginza_344.png',
    filename: '20160617_m-card-matsaya-ginza_344.png',
    expire: '2026-11-21',
    timeout: '2000',
    adSize: 'STRIP',
    checksum: '678482f9d3e27ea5ca12563b32997589',
  },
  {
    id: '4154',
    type: 'image',
    name: 'EMP_alipay_EMPStripAds',
    path: 'StripAds/20160624_alipay_em_344.jpg',
    filename: '20160624_alipay_em_344.jpg',
    expire: '2026-11-21',
    timeout: '2000',
    adSize: 'STRIP',
    checksum: '74385118d288f3184a853e47c4fa9305',
  },
  {
    id: '4163',
    type: 'image',
    name: 'EMP_Health_EMPStripAds',
    path: 'StripAds/20160701_health-up-your-life_344.jpg',
    filename: '20160701_health-up-your-life_344.jpg',
    expire: '2026-11-21',
    timeout: '2000',
    adSize: 'STRIP',
    checksum: '61217232de7a8d9b6feb3cfea9052e4e',
  },
  {
    id: '4172',
    type: 'image',
    name: 'EMP_Mpoint_discount_EMPStripAds',
    path: 'StripAds/20160722_mpoint-discount-up-to-15_344.jpg',
    filename: '20160722_mpoint-discount-up-to-15_344.jpg',
    expire: '2026-11-21',
    timeout: '2000',
    adSize: 'STRIP',
    checksum: '242a51c978e7eaddd83f48bc2b13e2ae',
  },
  {
    id: '4181',
    type: 'image',
    name: 'EMP_VisaChina_EMPStripAds',
    path: 'StripAds/20160805_visachinacrossborder_344.jpg',
    filename: '20160805_visachinacrossborder_344.jpg',
    expire: '2026-11-21',
    timeout: '2000',
    adSize: 'STRIP',
    checksum: '0327072f92c0d3d8bac98519e274302d',
  },
  {
    id: '4190',
    type: 'image',
    name: 'EMP_CTB_AP_EMPStripAds',
    path: 'StripAds/20160916_citibank-asia-pacific_344.jpg',
    filename: '20160916_citibank-asia-pacific_344.jpg',
    expire: '2026-11-21',
    timeout: '2000',
    adSize: 'STRIP',
    checksum: '9fe6731c3b6e2c65e7a0657662b876ef',
  },
  {
    id: '4199',
    type: 'image',
    name: 'EMP_diningexp_EMPStripAds',
    path: 'StripAds/20160916_magical-dining-experience_344.jpg',
    filename: '20160916_magical-dining-experience_344.jpg',
    expire: '2026-11-21',
    timeout: '2000',
    adSize: 'STRIP',
    checksum: 'f4d0a6724f7eafb25266cb2088b515fd',
  },
  {
    id: '4211',
    type: 'video',
    name: 'EMP_UFC_EMPStripAds',
    path: 'StripAds/20161007_ufc_344.mp4',
    filename: '20161007_ufc_344.mp4',
    expire: '2026-11-21',
    timeout: '2000',
    adSize: 'STRIP',
    checksum: '29e4304189c0d933efd3f121909e84b8',
  },
  {
    id: '4217',
    type: 'image',
    name: 'EMP_EMPMag_EMPStripAds',
    path: 'StripAds/20161007_emp_magazine-no33_344.jpg',
    filename: '20161007_emp_magazine-no33_344.jpg',
    expire: '2026-11-21',
    timeout: '2000',
    adSize: 'STRIP',
    checksum: '0535ff9d83538353bd3a84c62028c845',
  },
  {
    id: '4226',
    type: 'image',
    name: 'EMP_BT_Gift17_EMPStripAds',
    path: 'StripAds/20161111_betrend-gift-2017_344.png',
    filename: '20161111_betrend-gift-2017_344.png',
    expire: '2026-11-21',
    timeout: '2000',
    adSize: 'STRIP',
    checksum: '0de9be00280a021661584f2a3af95319',
  },
];

const baseAds = _.map(stripAds, ad => normalizeStripAds(ad));

const initialState = {
  footerAdType: '',
  baseAdPlayingIndex: 0,
  baseAds: [],
  footerAds: [], // baseAds,
};
const getInitialState = () => ({
  ...initialState,
});

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case RESET_FOOTER_ADS:
      return {
        ...state,
        footerAds: state.baseAds,
        footerAdType: 'base'
      };
    case SET_BASE_ADS:
      return {
        ...state,
        baseAds: action.ads,
      };
    case SET_FOOTER_ADS:
      return {
        ...state,
        footerAds: action.ads,
        footerAdType: action.footerAdType
      };
    case REMEMBER_BASE_AD_PLAYING_INDEX:
      return {
        ...state,
        baseAdPlayingIndex: action.baseAdPlayingIndex
      }
    default:
      return state;
  }
};
