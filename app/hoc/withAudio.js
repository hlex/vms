import React, { Component } from 'react';
import PropTypes from 'prop-types';
// ======================================================
// Components
// ======================================================
import { AudioPlayer } from '../components';

const withAudio = ({ src }) => WrappedComponent => class ComponentWithAudio extends Component {
  state = {
    isPlaying: true
  }

  componentWillMount = () => {
    const { getState, subscribe } = this.context.store;
    subscribe(() => this.switchLanguage(getState().language.currentActive));
    this.switchLanguage(getState().language.currentActive);
  }

  render = () => {
    console.log('withAudio', this)
    const { isPlaying } = this.state;
    return (
      <div>
        {
          isPlaying &&
          <AudioPlayer
            src={src}
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
