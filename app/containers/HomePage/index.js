import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import moment from 'moment';
import cuid from 'cuid';
// ======================================================
// Components
// ======================================================
import { ProductItems } from '../../components';
// ======================================================
// Actions
// ======================================================
import * as ApplicationActions from '../../actions/applicationActions';
import * as Actions from './actions';
// ======================================================
// Selectors
// ======================================================
import MasterappSelector from '../../selectors/masterapp';
import MasterdataSelector from '../../selectors/masterdata';
// ======================================================
// Slick
// ======================================================
const navMenuSettings = {
  dots: false,
  speed: 500,
  autoplay: false,
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 3,
  autoplaySpeed: 10000,
  nextArrow: false,
  prevArrow: false,
};

const mapStateToProps = state => ({
  navMenus: state.masterapp.navMenus,
  products: MasterdataSelector.getProducts(state.masterdata),
  promotionSets: MasterdataSelector.getPromotionSets(state.masterdata),
  events: MasterdataSelector.getEvents(state.masterdata),
  mobileTopupProviders: MasterdataSelector.getTopupProviders(state.masterdata),
  baseURL: MasterappSelector.getBaseURL(state.masterapp),
  temp: MasterappSelector.getTemp(state.masterapp),
  lang: MasterappSelector.getLanguage(state.masterapp)
});

const actions = {
  ...ApplicationActions,
  ...Actions,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class HomePage extends Component {
  static propTypes = {
    navMenus: PropTypes.arrayOf(PropTypes.shape({})),
    products: PropTypes.arrayOf(PropTypes.shape({})),
    promotionSets: PropTypes.arrayOf(PropTypes.shape({})),
    events: PropTypes.arrayOf(PropTypes.shape({})),
    mobileTopupProviders: PropTypes.arrayOf(PropTypes.shape({})),
    baseURL: PropTypes.string.isRequired,
    temp: PropTypes.number,
    lang: PropTypes.string.isRequired,
    selectProduct: PropTypes.func.isRequired,
    changePage: PropTypes.func.isRequired,
    initHomePage: PropTypes.func.isRequired
  };

  static defaultProps = {
    navMenus: [],
    products: [],
    promotionSets: [],
    events: [],
    mobileTopupProviders: [],
    temp: 35,
  };

  componentDidMount = () => {
    const { initHomePage } = this.props;
    initHomePage();
  }

  renderTitle = () => {
    const { lang } = this.props;
    if (lang === 'th') {
      return <h1>กรุณาเลือกรายการ</h1>;
    }
    return (
      <h1>Please Select</h1>
    );
  }

  renderTemperature = () => {
    const { temp, lang } = this.props;
    if (lang === 'th') {
      return `กรุงเทพฯ ${temp} C`;
    }
    const tempInF = ((temp * 9) / 5) + 32;
    return `Bangkok ${tempInF} F`;
  }

  render() {
    console.log('HomePage@render', this.props);
    const {
      navMenus,
      products,
      promotionSets,
      events,
      mobileTopupProviders,
      changePage,
      selectProduct,
      baseURL,
    } = this.props;
    return (
      <div className="homepage">
        <div className="nav-panel">
          <div className="title-panel">
            <div className="item clock">
              {moment().format('DD/MM/YYYY HH:mm')}
            </div>
            <div className="title">
              {this.renderTitle()}
            </div>
            <div className="item temperature">{this.renderTemperature()}</div>
          </div>
          <div className="menu-slider">
            <Slider ref={c => (this.slider = c)} {...navMenuSettings}>
              {navMenus.map(menu =>
                (<div className="item" key={cuid()} onClick={() => changePage(menu.linkTo)}>
                  <div className="fix-rows">
                    <div className="box" style={{ backgroundImage: `url(${baseURL}/${menu.src})` }}>
                      <div className="title">
                        <h3>
                          {menu.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>),
              )}
            </Slider>
          </div>
        </div>
        <div className="content-panel">
          <ProductItems
            height={815}
            promotionSets={promotionSets}
            products={products}
            events={events}
            mobileTopupProviders={mobileTopupProviders}
            promotionSetPerPage={3}
            productPerPage={10}
            eventPerPage={6}
            mobileTopupProviderPerPage={6}
            onClickItem={selectProduct}
            baseURL={baseURL}
          />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
