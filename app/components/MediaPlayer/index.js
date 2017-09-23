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
    onEnded: PropTypes.func,
  };
  static defaultProps = {
    onEnded: () => console.warn('You did not send onEnded(lastIndex, nextIndex)')
  }
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
  }
  componentWillUnmount() {
    // console.log('componentWillUnmount', this);
    this.handlePlayerEnded = () => {};
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
  render = () => {
    // console.debug('MediaPlayer:state', this.state);
    // console.debug('MediaPlayer:props', this.props);
    const { index } = this.state;
    const { width, height, sources } = this.props;
    // -----------------------------
    const currentMedia = _.get(sources, `${index}`, {});
    const { type, src, duration } = currentMedia;
    // -----------------------------
    if (_.size(sources) <= 0) return <div />;
    return (
      <div className="react-mediaplayer">
        <FilePlayer
          key={`${index}-${src}`}
          duration={duration}
          src={src}
          width={width}
          height={height}
          type={type}
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
