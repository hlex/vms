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
  };
  static defaultProps = {
    onTicked: () => null,
    onEnded: () => null
  }
  state = {
    index: 0,
  };
  componentWillReceiveProps = (nextProps) => {
    if (this.props.sources.length !== nextProps.sources.length) {
      this.setState({
        index: 0
      });
    }
  }
  handlePlayerEnded = () => {
    const { index } = this.state;
    const { sources, onEnded } = this.props;
    const nextIndex = index < sources.length - 1 ? index + 1 : 0;
    // console.log('handlePlayerEnded', index, nextIndex);
    this.setState({
      index: nextIndex,
    });
    onEnded(index, nextIndex);
  }
  handleTouchMedia = () => {
    // console.log('handleTouchMedia');
    const { index } = this.state;
    const { sources } = this.props;
    const nextNearestNotFullScreenAdIndex = _.findIndex(sources, (source, sourceIndex) => {
      return sourceIndex > index && (source.adSize || '') !== 'FULLSCREEN';
    });
    // console.log(nextNearestNotFullScreenAdIndex);
    if (nextNearestNotFullScreenAdIndex) {
      this.setState({
        index: nextNearestNotFullScreenAdIndex
      });
    }
  }
  render = () => {
    // console.debug('MediaPlayer:state', this.state);
    // console.debug('MediaPlayer:props', this.props);
    const { index } = this.state;
    const { width, height, sources } = this.props;
    // -----------------------------
    const currentMedia = _.get(sources, `${index}`, {});
    const { type, src, duration } = currentMedia;
    // console.debug('MediaPlayer:currentMedia', index, currentMedia);
    const isFullScreen = (currentMedia.adSize || '') === 'FULLSCREEN';
    // -----------------------------
    if (_.size(sources) <= 0 || !currentMedia) return <div />;
    return (
      <div
        className="react-mediaplayer"
        style={{ position: isFullScreen ? 'fixed' : 'absolute', top: isFullScreen ? '80px' : '0', zIndex: isFullScreen ? '500' : '98' }}
        onClick={() => { if (isFullScreen) this.handleTouchMedia(); }}
      >
        <FilePlayer
          key={`${index}-${src}`}
          duration={duration}
          src={src}
          width={width}
          height={height}
          type={type}
          onTicked={() => this.props.onTicked()}
          onEnded={() => this.handlePlayerEnded()}
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
