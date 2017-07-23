import { push, replace, goBack } from 'react-router-redux';

export const back = () => {
  return (dispatch) => {
    dispatch(goBack());
  };
};

export const changePage = (context) => {
  return (dispatch) => {
    dispatch(push(context));
  };
};

export const selectProduct = (context, itemId) => {
  return (dispatch) => {
    dispatch(replace(context));
    dispatch({
      type: 'SELECT_PRODUCT',
      itemId,
    });
  };
};
