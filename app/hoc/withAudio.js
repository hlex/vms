import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// ======================================================
// Components
// ======================================================
import { AudioPlayer } from '../components';

const withAudio = ({ src }, actions) => WrappedComponent => class ComponentWithAudio extends PureComponent {
  static contextTypes = {
    store: PropTypes.object
  }
  state = {
    play: true,
    defaultSrc: src
  }
  componentWillMount = () => {
    const { getState, dispatch, subscribe } = this.context.store;
    this.unsubscribe = subscribe(() => this.audioShouldPlay(getState().audio));
    this.audioShouldPlay(getState().audio);
    if (actions) {
      console.log('componentWillMount:startPlayAudio');
      dispatch(actions.startPlayAudio());
    }
  }
  componentWillUnmount = () => {
    this.unsubscribe();
  }
  audioShouldPlay = (audio) => {
    console.log('audioShouldPlay', audio);
    if (!audio.play) {
      this.setState({
        play: false
      });
    } else if (audio.play) {
      this.setState({
        play: true
      });
    }
  }
  render = () => {
    console.log('withAudio', this);
    const { play, defaultSrc } = this.state;
    return (
      <div>
        {
          play &&
          <AudioPlayer
            src={defaultSrc}
            autoPlay
            muted={false}
            interval={5000}
          />
        }
        <WrappedComponent
          {...this.props}
        />
      </div>
    );
  };
};

export default withAudio;
