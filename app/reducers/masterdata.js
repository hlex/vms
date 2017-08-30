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

const productGenerator = number =>
  _.map(_.range(number), index => ({
    cuid: cuid(),
    id: index + 1,
    name: cuid(),
    price: _.random(1, 50),
    isSoldout: false,
    image: `images/product-${index + 1}.png`,
    row: _.random(1, 9),
    col: _.random(1, 9),
    isDropped: false,
  }));

const promotionGenerator = number =>
  _.map(_.range(number), index => ({
    cuid: cuid(),
    id: index + 1,
    products: productGenerator(2),
    price: _.random(1, 10),
    image: '',
  }));

const initialState = {
  products: productGenerator(36),
  promotionSets: promotionGenerator(10),
  topupProviders: mockupTopupProviders,
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
