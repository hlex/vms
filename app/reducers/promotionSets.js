import _ from 'lodash';
import cuid from 'cuid';

const productGenerator = number => _.map(_.range(number), index => ({
  id: index + 1,
  name: cuid(),
  price: 45,
  isSoldout: false,
  image: `images/product-${index + 1}.png`,
}));

const promotionGenerator = number => _.map(_.range(number), index => ({
  id: index + 1,
  products: productGenerator(2),
  price: 25,
  image: '',
}));

const initialState = promotionGenerator(10);

export default function products(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
