import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class InputWithPad extends PureComponent {
  static propTypes = {
    show: PropTypes.bool,
    type: PropTypes.string,
    value: PropTypes.string,
    rules: PropTypes.shape({}),
    onConfirm: PropTypes.func,
  };

  static defaultProps = {
    show: false,
    type: 'num', // 'keyboard'
    value: '',
    onConfirm: () => console.log('Please send any onConfirm(inputValue)'),
    rules: {},
  };

  state = {
    show: this.props.show || false,
    inputValue: this.props.value || '',
    validationMessage: ''
  };

  componentDidMount = () => {
    this.setState({
      validationMessage: this.handleValidateInput(this.state.inputValue)
    });
  }

  handleToggleShowKeyboard = () => {
    if (!this.props.show) {
      this.setState({
        show: !this.state.show,
      });
    }
  };

  handleValidateInput = (value) => {
    const { rules } = this.props;
    let validationMessage = '';
    _.forEach(rules, (message, rule) => {
      console.log('rule', rule, message);
      switch (rule) {
        case 'required':
        case 'require':
          validationMessage = !value || value === '' || value === null ? message : '';
          break;
        case 'mobileNumber':
          validationMessage = /^(0)\d{9}$/.test(value) ? '' : message;
          break;
        default:
          return '';
      }
    });
    return validationMessage;
  }

  handleSelectChar = char => {
    const { inputValue } = this.state;
    if (inputValue.length === 10) {
      return '';
    }
    const nextValue = `${this.state.inputValue}${char}`;
    this.setState({
      inputValue: nextValue,
      validationMessage: this.handleValidateInput(nextValue),
    });
  };

  handleSelectBackspace = () => {
    const { inputValue } = this.state;
    console.log(inputValue, inputValue.length);
    const nextValue = inputValue.substring(0, inputValue.length - 1);
    this.setState({
      inputValue: nextValue,
      validationMessage: this.handleValidateInput(),
    });
  };

  handleSelectConfirm = () => {
    const { onConfirm } = this.props;
    const { validationMessage } = this.state;
    if (validationMessage === '') {
      onConfirm(this.state.inputValue);
    }
  };

  renderPad = () => {
    const { show } = this.state;
    const { type } = this.props;
    if (type === 'num') {
      return (
        <div className={`pads-number ${show ? 'open' : ''}`}>
          {!this.props.show && <div className="overlay" onClick={this.handleToggleShowKeyboard}></div>}
          <ul>
            <li>
              <a onClick={() => this.handleSelectChar('7')}>7</a>
            </li>
            <li>
              <a onClick={() => this.handleSelectChar('8')}>8</a>
            </li>
            <li>
              <a onClick={() => this.handleSelectChar('9')}>9</a>
            </li>
            <li>
              <a onClick={() => this.handleSelectChar('4')}>4</a>
            </li>
            <li>
              <a onClick={() => this.handleSelectChar('5')}>5</a>
            </li>
            <li>
              <a onClick={() => this.handleSelectChar('6')}>6</a>
            </li>
            <li>
              <a onClick={() => this.handleSelectChar('1')}>1</a>
            </li>
            <li>
              <a onClick={() => this.handleSelectChar('2')}>2</a>
            </li>
            <li>
              <a onClick={() => this.handleSelectChar('3')}>3</a>
            </li>
            <li>
              <a onClick={() => this.handleSelectBackspace()}>
                <img src="images/icon-delete.png" width="50" />
              </a>
            </li>
            <li>
              <a onClick={() => this.handleSelectChar('0')}>0</a>
            </li>
              <li>
                <a className="clickpads-phone-ok" onClick={() => this.handleSelectConfirm()}>
                  OK
                </a>
              </li>
            </ul>
          </div>
      );
    }
    return (
      <div className={`pads-keyboard ${show ? 'open' : ''}`}>
        <ul>
          <li>
            <a onClick={() => this.handleSelectChar('1')}>1</a>
          </li>
          <li>
            <a onClick={() => this.handleSelectChar('2')}>2</a>
          </li>
          <li>
            <a onClick={() => this.handleSelectChar('3')}>3</a>
          </li>
          <li>
            <a onClick={() => this.handleSelectChar('4')}>4</a>
          </li>
          <li>
            <a onClick={() => this.handleSelectChar('5')}>5</a>
          </li>
          <li>
            <a onClick={() => this.handleSelectChar('6')}>6</a>
          </li>
          <li>
            <a onClick={() => this.handleSelectChar('7')}>7</a>
          </li>
          <li>
            <a onClick={() => this.handleSelectChar('8')}>8</a>
          </li>
          <li>
            <a onClick={() => this.handleSelectChar('0')}>0</a>
          </li>
          <li>
            <a onClick={() => this.handleSelectBackspace()}>
              <img src="images/icon-delete.png" width="40" />
            </a>
          </li>
        </ul>
        <ul>
          <li>
            <a>q</a>
          </li>
          <li>
            <a>w</a>
          </li>
          <li>
            <a>e</a>
          </li>
          <li>
            <a>r</a>
          </li>
          <li>
            <a>t</a>
          </li>
          <li>
            <a>y</a>
          </li>
          <li>
            <a>u</a>
          </li>
          <li>
            <a>i</a>
          </li>
          <li>
            <a>o</a>
          </li>
          <li>
            <a>p</a>
          </li>
        </ul>
        <ul>
          <li>
            <a>a</a>
          </li>
          <li>
            <a>s</a>
          </li>
          <li>
            <a>d</a>
          </li>
          <li>
            <a>f</a>
          </li>
          <li>
            <a>g</a>
          </li>
          <li>
            <a>h</a>
          </li>
          <li>
            <a>j</a>
          </li>
          <li>
            <a>k</a>
          </li>
          <li>
            <a>l</a>
          </li>
        </ul>
        <ul>
          <li>
            <a>z</a>
          </li>
          <li>
            <a>x</a>
          </li>
          <li>
            <a>c</a>
          </li>
          <li>
            <a>v</a>
          </li>
          <li>
            <a>b</a>
          </li>
          <li>
            <a>n</a>
          </li>
          <li>
            <a>m</a>
          </li>
          <li>
            <a>-</a>
          </li>
          <li>
            <a>_</a>
          </li>
          <li>
            <a>@</a>
          </li>
        </ul>
        <ul>
          <li className="width-250">
            <a>@gmail.com</a>
          </li>
          <li className="width-250">
            <a>@hotmail.com</a>
          </li>
          <li className="width-100">
            <a>.com</a>
          </li>
        </ul>
        <ul>
          <li className="width-250">
            <a>@yahoo.com</a>
          </li>
          <li className="width-100">
            <a>.net</a>
          </li>
          <li className="width-100">
            <a>.co.th</a>
          </li>
          <li className="width-150">
            <a className="clickpads-mail-ok" href="event-ads-discount.htm">
              OK
            </a>
          </li>
        </ul>
      </div>
    );
  };

  render() {
    console.log('state', this.state);
    const { show } = this.props;
    const { inputValue, validationMessage } = this.state;
    let displayInputValue = '';
    if (show) {
      for (let i = 0; i < inputValue.length; i += 1) {
        if (i === 3 || i === 6) displayInputValue += '-';
        displayInputValue += inputValue[i];
      }
    } else {
      displayInputValue = inputValue;
    }
    return (
      <div className="input-box">
        <p className="input-validation">{validationMessage}</p>
        <div className="input-with-pad">
          <div
            className="input"
            onClick={this.handleToggleShowKeyboard}
            onBlur={this.handleToggleShowKeyboard}
          >
            {displayInputValue}
          </div>
          {
            this.renderPad()
          }
        </div>
      </div>
    );
  }
}
