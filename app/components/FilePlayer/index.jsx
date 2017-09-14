import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FilePlayer extends Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    type: PropTypes.string,
    onEnded: PropTypes.func,
    duration: PropTypes.number.isRequired,
  };
  static defaultProps = {
    key: Date.now(),
    type: 'video',
    onEnded: () => 'Please send onEnded()',
  }

  constructor(props) {
    super(props);
    this.state = {
      time: Date.now(),
      duration: props.duration,
    };
  }
  componentDidMount = () => {
    const { duration } = this.props;
    this.timer = setInterval(this.tick, Number(duration * 1000));
  }
  tick = () => {
    const { onEnded } = this.props;
    onEnded();
    clearInterval(this.timer);
  }
  render = () => {
    console.debug('FilePlayer:state', this.state);
    console.debug('FilePlayer:props', this.props);
    const key = Date.now();
    const {
      src,
      type,
      width,
      height,
    } = this.props;
    if (type === 'video') {
      return (
        <div className="react-fileplayer" key={key}>
          <video width={width} height={height} className="cg-video" muted autoPlay>
            <source src={`${src}`} type="video/mp4" />
          </video>
        </div>
      );
    }
    return (
      <div className="react-fileplayer" key={key}>
        <img
          alt=""
          src={`${src}`}
        />
      </div>
    );
  }
}

export default FilePlayer;
