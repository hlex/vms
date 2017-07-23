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
import ProductItems from '../../components/ProductItems';

// ======================================================
// Actions
// ======================================================
import * as ApplicationActions from '../../actions/applicationActions';
import * as Actions from './actions';

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
  products: state.products,
  promotionSets: state.promotionSets,
  baseURL: state.masterapp.baseURL,
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
    changePage: PropTypes.func.isRequired,
    selectProduct: PropTypes.func.isRequired,
    baseURL: PropTypes.string.isRequired,
  };

  static defaultProps = {
    navMenus: [],
    products: [],
    promotionSets: [],
    events: [],
  };

  render() {
    console.log('Homepage', this.props);
    const {
      navMenus,
      products,
      promotionSets,
      events,
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
              <h1>กรุณาเลือกรายการ</h1>
            </div>
            <div className="item temperature">กรุงเทพฯ 35 C</div>
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
            promotionSets={promotionSets}
            products={products}
            events={events}
            promotionSetPerPage={3}
            productPerPage={10}
            eventPerPage={6}
            onClickItem={(context, itemId) => selectProduct(context, itemId)}
            baseURL={baseURL}
          />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
