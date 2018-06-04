import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import FilePlayer from '../FilePlayer';

class MediaPlayer extends Component {
  static propTypes = {
    sources: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.string.isRequired,
      src: PropTypes.string.isRequired,
      duration: PropTypes.number.isRequired,
    })).isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    onTicked: PropTypes.func,
    onEnded: PropTypes.func,
    muted: PropTypes.bool,
  };
  static defaultProps = {
    onTicked: () => null,
    onEnded: () => null,
    muted: false
  }
  state = {
    index: 0,
  };
  componentWillReceiveProps = (nextProps) => {
    if (this.props.sources.length !== nextProps.sources.length) {
      this.setState({
        index: nextProps.footerAdType === 'base' ? nextProps.baseAdPlayingIndex : 0
      });
    }
  }
  shouldComponentUpdate = (nextProps) => {
    const { playerKey, muted } = this.props;
    return playerKey === undefined;
  }
  getNextPlayingIndex = (index) => {
    const { sources } = this.props;
    const nextIndex = index < sources.length - 1 ? index + 1 : 0;
    return nextIndex;
  }
  setPlayingIndex = (index, fullscreenIndex) => {
    // console.log('setPlayingIndex', index, fullscreenIndex)
    const { onEnded } = this.props;
    this.setState({ index });
    if (fullscreenIndex !== undefined) {
      onEnded(fullscreenIndex);
    } else {
      onEnded(index, this.getNextPlayingIndex());
    }
  }
  handlePlayerEnded = () => {
    const { index } = this.state;
    const { sources } = this.props;
    const nextIndex = index < sources.length - 1 ? index + 1 : 0;
    // console.log('handlePlayerEnded', index, nextIndex);
    this.setPlayingIndex(nextIndex);
  }
  handleTouchMedia = () => {
    // console.log('handleTouchMedia');
    const { index } = this.state;
    const { sources } = this.props;
    if (this.isFullScreen()) {
      const prevNearestNotFullScreenAdIndex = _.findLastIndex(sources, (source, sourceIndex) => {
        return sourceIndex < index && (source.adSize || '') !== 'FULLSCREEN';
      });
      if (prevNearestNotFullScreenAdIndex !== undefined) {
        this.setPlayingIndex(prevNearestNotFullScreenAdIndex, index);
        // this.setState({
        //   index: nextNearestNotFullScreenAdIndex
        // });
      }
    }
  }
  getCurrentMedia = () => {
    const { index } = this.state;
    const { sources } = this.props;
    return _.get(sources, `${index}`, {});
  }
  isFullScreen = () => {
    const currentMedia = this.getCurrentMedia();
    const isFullScreen = (currentMedia.adSize || '') === 'FULLSCREEN';
    return isFullScreen;
  }
  render = () => {
    // console.debug('MediaPlayer:state', this.state);
    // console.debug('MediaPlayer:props', this.props);
    const { width, height, sources, playerKey, muted } = this.props;
    // -----------------------------
    const currentMedia = this.getCurrentMedia();
    const { type, src, duration } = currentMedia;
    const isFullScreen = (currentMedia.adSize || '') === 'FULLSCREEN';
    // console.debug('MediaPlayer:currentMedia', index, currentMedia);
    // -----------------------------
    if (_.size(sources) <= 0 || !currentMedia) return <div />;
    const itemKey = playerKey !== undefined ? playerKey : `${Date.now()}-${src}`;
    return (
      <div
        className="react-mediaplayer"
        style={{ position: isFullScreen ? 'fixed' : 'absolute', top: isFullScreen ? '80px' : '0', zIndex: isFullScreen ? '500' : '98' }}
        onClick={() => this.handleTouchMedia()}
      >
        <FilePlayer
          key={itemKey}
          duration={duration}
          src={src}
          width={width}
          height={isFullScreen ? 1840 : height}
          type={type}
          onTicked={() => this.props.onTicked()}
          onEnded={() => this.handlePlayerEnded()}
          muted={muted}
        />
      </div>
    );
  }
}

export default MediaPlayer;

/*
<ReactPlayer
  volume={0.0}
  controls={true}
  onEnded={() => onEnded()}
  height={`${height}px`}
  width={`${width}px`}
  url={`${basePATH}/${playingMediaPath}`}
  playing={false}
/>
<video width={width} height={height} muted autoplay controls>
  <source src={`${basePATH}/${playingMediaPath}`} type="video/mp4" />
</video>
*/
