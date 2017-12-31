import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactAudioPlayer from 'react-audio-player';

class AudioPlayer extends Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
    autoPlay: PropTypes.bool,
    loop: PropTypes.bool,
    muted: PropTypes.bool,
    interval: PropTypes.number,
    onEnded: PropTypes.func,
    onStarted: PropTypes.func,
  };
  static defaultProps = {
    autoPlay: true,
    loop: false,
    muted: false,
    interval: 5000,
    onEnded: () => console.log(),
    onStarted: () => console.log(),
  }
  state = {
    id: Date.now(),
    play: true
  }
  componentDidMount = () => {
    const { onStarted } = this.props;
    onStarted();
  }
  handleEnded = () => {
    const { interval, onStarted, onEnded } = this.props;
    this.setState({
      play: false
    });
    onEnded();
    setTimeout(() => {
      this.setState({
        play: true
      });
      onStarted();
    }, interval);
  }
  render = () => {
    const {
      play
    } = this.state;
    const {
      src,
      autoPlay,
      loop,
      muted
    } = this.props;
    return (
      <div>
        {
          play &&
          <ReactAudioPlayer
            src={src}
            autoPlay={autoPlay}
            loop={loop}
            onEnded={this.handleEnded}
            muted={muted}
          />
        }
      </div>
    );
  }
}

export default AudioPlayer;
