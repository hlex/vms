import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

export default class Modal extends Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    children: PropTypes.element.isRequired,
    hidden: PropTypes.func,
    hiddenButton: PropTypes.any,
    options: PropTypes.shape({
      className: PropTypes.shaped,
      closeButton: PropTypes.bool,
      size: PropTypes.string, // small medium large
      customSize: PropTypes.string, // 300px
      overlay: PropTypes.bool,
      focusOverlayHidden: PropTypes.bool,
      keyCode: PropTypes.func,
    }),
  };

  static defaultProps = {
    hidden: () => {},
  };

  handalClickOverlay = () => {
    if (_.get(this.props, 'options.focusOverlayHidden', true) && _.get(this.props, 'options.overlay', true)) this.props.hidden();
  }

  handalHiddenModal = () => {
    this.props.hidden();
  }

  render() {
    const overlay = _.get(this.props, 'options.overlay', true) ? 'overlay' : '';
    let content = `box-modal ${overlay}`;
    let hiddenButton = '';
    let size = _.get(this.props, 'options.size', 'medium');
    let customStyle = {};
    if (_.get(this.props, 'options.className', false)) {
      customStyle = _.assign({}, _.get(this.props, 'options.className', {}));
    }
    if (_.get(this.props, 'options.customSize', false)) {
      size = '';
      customStyle = _.assign({}, customStyle, {
        maxWidth: _.get(this.props, 'options.customSize'),
        width: '100%',
      });
    }

    if (this.props.show) content = `box-modal ${overlay} show`;
    if (_.get(this.props, 'options.closeButton', false)) hiddenButton = (<div className="btn-close"><a href="Javascript:;" onClick={() => this.props.hidden()}>x</a></div>);

    return (
      <div className={content} >
        <div className="modal-overlay-hidden" onClick={() => this.handalClickOverlay()}></div>
        <div className={`content-modal ${size}`} style={customStyle}>
          {hiddenButton}
          {this.props.children ? this.props.children : ''}
        </div>
      </div>
    );
  }
}

class Header extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    className: '',
  }

  render() {
    const boxHeader = this.props.className ? this.props.className : '';
    return (<div className={boxHeader}>{this.props.children ? this.props.children : ''}</div>);
  }
}

class Footer extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    className: PropTypes.string,
  };
  static defaultProps = {
    className: '',
  }
  render() {
    const boxFooter = this.props.className ? this.props.className : '';
    return (<div className={boxFooter}>{this.props.children ? this.props.children : ''}</div>);
  }
}
