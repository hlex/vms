import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// ======================================================
// Components
// ======================================================
import { AudioPlayer } from '../components';

const withAudio = ({ src }) => WrappedComponent => class ComponentWithAudio extends Component {
  render = () => (
    <div>
      <AudioPlayer
        src={src}
        autoPlay
        muted={false}
        interval={5000}
      />
      <WrappedComponent
        {...this.props}
      />
    </div>
      );
  };

export default {
  withAudio
};
