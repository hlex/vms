
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

const initialState = {
  products: [],
  promotionSets: [],
  topupProviders: mockupTopupProviders,
};
const getInitialState = () => {
  return {
    ...initialState
  };
};

export default function masterdata(state = getInitialState(), action) {
  switch (action.type) {
    default:
      return state;
  }
}
