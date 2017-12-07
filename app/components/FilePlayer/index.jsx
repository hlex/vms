import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FilePlayer extends Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    type: PropTypes.string,
    muted: PropTypes.bool,
    onTicked: PropTypes.func,
    onEnded: PropTypes.func,
    duration: PropTypes.number.isRequired,
  };
  static defaultProps = {
    key: Date.now(),
    type: 'video',
    muted: false,
    onEnded: () => null,
  }

  state = {
    id: Date.now(),
    duration: this.props.duration,
  }

  componentDidMount = () => {
    const { onEnded, src, duration } = this.props;
    this.timer1 = setInterval(this.tick, 1000);
    this.timer2 = setInterval(this.alarm, Number(duration * 1000));
    // document.getElementById(`${this.state.id}`).addEventListener('ended', () => {
    //   onEnded(src);
    // });
  }
  componentWillUnmount = () => {
    const { onEnded, src } = this.props;
    clearInterval(this.timer1);
    clearInterval(this.timer2);
    // document.getElementById(`${this.state.id}`).removeEventListener('ended', () => {
    //   onEnded(src);
    // });
  }
  tick = () => {
    const { onTicked } = this.props;
    if (onTicked) onTicked();
  }
  alarm = () => {
    const { onEnded, src } = this.props;
    onEnded(src);
    clearInterval(this.timer1);
    clearInterval(this.timer2);
  }
  render = () => {
    // console.debug('FilePlayer:props', this.props);
    const key = Date.now();
    const {
      src,
      type,
      width,
      height,
      muted,
    } = this.props;
    if (type === 'video') {
      return (
        <div className="react-fileplayer" key={key}>
          <video id={this.state.id} width={width} height={height} className="cg-video" autoPlay muted={muted}>
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
