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
      this.setState({
        inputValue: '',
        show: false
      });
    }
  };

  renderOverlay = () => {
    const { show } = this.state;
    return !this.props.show && show && <div className="overlay" onClick={this.handleToggleShowKeyboard}></div>;
  }

  renderPad = () => {
    const { show } = this.state;
    const { type } = this.props;
    if (type === 'num') {
      return (
        <div className={`pads-number ${show ? 'open' : ''}`}>
          {
            this.renderOverlay()
          }
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
        {
          this.renderOverlay()
        }
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
            <a onClick={() => this.handleSelectChar('q')}>q</a>
          </li>
          <li>
            <a onClick={() => this.handleSelectChar('w')}>w</a>
          </li>
          <li>
            <a onClick={() => this.handleSelectChar('e')}>e</a>
          </li>
          <li>
            <a onClick={() => this.handleSelectChar('r')}>r</a>
          </li>
          <li>
            <a onClick={() => this.handleSelectChar('t')}>t</a>
          </li>
          <li>
            <a onClick={() => this.handleSelectChar('y')}>y</a>
          </li>
          <li>
            <a onClick={() => this.handleSelectChar('u')}>u</a>
          </li>
          <li>
            <a onClick={() => this.handleSelectChar('i')}>i</a>
          </li>
          <li>
            <a onClick={() => this.handleSelectChar('o')}>o</a>
          </li>
          <li>
            <a onClick={() => this.handleSelectChar('p')}>p</a>
          </li>
        </ul>
        <ul>
          <li>
            <a onClick={() => this.handleSelectChar('a')}>a</a>
          </li>
          <li>
            <a onClick={() => this.handleSelectChar('s')}>s</a>
          </li>
          <li>
            <a onClick={() => this.handleSelectChar('d')}>d</a>
          </li>
          <li>
            <a onClick={() => this.handleSelectChar('f')}>f</a>
          </li>
          <li>
            <a onClick={() => this.handleSelectChar('g')}>g</a>
          </li>
          <li>
            <a onClick={() => this.handleSelectChar('h')}>h</a>
          </li>
          <li>
            <a onClick={() => this.handleSelectChar('j')}>j</a>
          </li>
          <li>
            <a onClick={() => this.handleSelectChar('k')}>k</a>
          </li>
          <li>
            <a onClick={() => this.handleSelectChar('l')}>l</a>
          </li>
        </ul>
        <ul>
          <li>
            <a onClick={() => this.handleSelectChar('z')}>z</a>
          </li>
          <li>
            <a onClick={() => this.handleSelectChar('x')}>x</a>
          </li>
          <li>
            <a onClick={() => this.handleSelectChar('c')}>c</a>
          </li>
          <li>
            <a onClick={() => this.handleSelectChar('v')}>v</a>
          </li>
          <li>
            <a onClick={() => this.handleSelectChar('b')}>b</a>
          </li>
          <li>
            <a onClick={() => this.handleSelectChar('n')}>n</a>
          </li>
          <li>
            <a onClick={() => this.handleSelectChar('m')}>m</a>
          </li>
          <li>
            <a onClick={() => this.handleSelectChar('-')}>-</a>
          </li>
          <li>
            <a onClick={() => this.handleSelectChar('_')}>_</a>
          </li>
          <li>
            <a onClick={() => this.handleSelectChar('@')}>@</a>
          </li>
        </ul>
        <ul>
          <li className="width-250">
            <a onClick={() => this.handleSelectChar('gmail.com')}>@gmail.com</a>
          </li>
          <li className="width-250">
            <a onClick={() => this.handleSelectChar('@hotmail.com')}>@hotmail.com</a>
          </li>
          <li className="width-100">
            <a onClick={() => this.handleSelectChar('.com')}>.com</a>
          </li>
        </ul>
        <ul>
          <li className="width-250">
            <a onClick={() => this.handleSelectChar('@yahoo.com')}>@yahoo.com</a>
          </li>
          <li className="width-100">
            <a onClick={() => this.handleSelectChar('.net')}>.net</a>
          </li>
          <li className="width-100">
            <a onClick={() => this.handleSelectChar('.co.th')}>.co.th</a>
          </li>
          <li className="width-150">
            <a className="clickpads-phone-ok" onClick={() => this.handleSelectConfirm()}>
              OK
            </a>
          </li>
        </ul>
      </div>
    );
  };

  render() {
    const { show, rules } = this.props;
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
    const hasValidation = rules && _.keys(rules).length > 0;
    return (
      <div className={`input-box ${hasValidation && 'with-validation'}`}>
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
