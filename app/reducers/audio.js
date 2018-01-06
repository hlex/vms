
import _ from 'lodash';
import {
  AUDIO_START_PLAY,
  AUDIO_STOP_PLAY,
} from '../actions/actionTypes';

const initialState = {
  play: true,
};
const getInitialState = () => ({
  ...initialState,
});

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case AUDIO_STOP_PLAY:
      return {
        ...state,
        play: false
      };
    case AUDIO_START_PLAY:
      return {
        ...state,
        play: true
      };
    default:
      return state;
  }
};
