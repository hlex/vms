import _ from 'lodash';
import cuid from 'cuid';

const mockupTopupProviders = [
  {
    id: 1,
    banner: 'images/product-full-ais.png',
    src: 'images/operation-ais.png',
    serviceCode: '1001',
    name: 'AIS',
  },
  {
    id: 2,
    banner: 'images/product-full-ais.png',
    src: 'images/operation-dtac.png',
    serviceCode: 'DTACTOPUP',
    name: 'DTAC',
  },
  {
    id: 3,
    banner: 'images/product-full-ais.png',
    src: 'images/operation-true.png',
    serviceCode: 'TRMVTOPUP',
    name: 'Truemove',
  },
  {
    id: 4,
    banner: 'images/product-full-ais.png',
    src: 'images/operation-myworld.png',
    serviceCode: '1001',
    name: 'Myworld',
  },
  {
    id: 5,
    banner: 'images/product-full-ais.png',
    src: 'images/operation-cat.png',
    serviceCode: '1001',
    name: 'Cat',
  },
  {
    id: 6,
    banner: 'images/product-full-ais.png',
    src: 'images/operation-penguin.png',
    serviceCode: '1001',
    name: 'Penguin',
  },
];

const mockupMobileTopupValues = [
  {
    cuid: cuid(),
    id: 1,
    value: '20',
    fee: '2',
  },
  {
    cuid: cuid(),
    id: 2,
    value: '50',
    fee: '1',
  },
  {
    cuid: cuid(),
    id: 3,
    value: '100',
    fee: '0',
  },
  {
    cuid: cuid(),
    id: 4,
    value: '150',
    fee: '0',
  },
  {
    cuid: cuid(),
    id: 1,
    value: '200',
    fee: '0',
  },
  {
    cuid: cuid(),
    id: 1,
    value: '250',
    fee: '0',
  },
  {
    cuid: cuid(),
    id: 1,
    value: '300',
    fee: '0',
  },
  {
    cuid: cuid(),
    id: 1,
    value: '350',
    fee: '0',
  },
  {
    cuid: cuid(),
    id: 1,
    value: '400',
    fee: '0',
  },
  {
    cuid: cuid(),
    id: 1,
    value: '500',
    fee: '0',
  },
];

const isSoldout = () => {
  return _.random(1, 5) >= 4;
};

const productGenerator = number =>
  _.map(_.range(number), index => ({
    cuid: cuid(),
    id: index + 1,
    name: cuid(),
    price: 10, // _.random(1, 50),
    isSoldout: isSoldout(),
    image: `images/product-${index + 1}.png`,
    row: 2, // _.random(1, 2),
    col: 1, // _.random(1, 2),
    isDropped: false,
  }));

const promotionGenerator = number =>
  _.map(_.range(number), index => ({
    cuid: cuid(),
    id: index + 1,
    products: productGenerator(2),
    price: 15, // _.random(1, 10),
    image: '',
  }));

const initialState = {
  products: productGenerator(36),
  promotionSets: promotionGenerator(10),
  topupProviders: mockupTopupProviders,
  mobileTopupValues: mockupMobileTopupValues,
};

const getInitialState = () => ({
  ...initialState,
});

export default function masterdata(state = getInitialState(), action) {
  switch (action.type) {
    default:
      return state;
  }
}
