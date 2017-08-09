import _ from 'lodash';
import cuid from 'cuid';

// @flow
import { SELECT_PRODUCT } from '../actions/actionTypes';

type actionType = {
  +type: string
};

const productGenerator = number => _.map(_.range(number), index => ({
  id: index + 1,
  name: cuid(),
  price: 45,
  isSoldout: false,
  image: `images/product-${index + 1}.png`,
}));

const initialState = productGenerator(36);

export default function products(state = initialState, action: actionType) {
  switch (action.type) {
    case SELECT_PRODUCT:
      return state;
    default:
      return state;
  }
}
