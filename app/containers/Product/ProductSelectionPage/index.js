import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import _ from 'lodash';
// ======================================================
// Hoc
// ======================================================
import withAudio from '../../../hoc/withAudio';
// ======================================================
// Components
// ======================================================
import { Layout, ProductItems } from '../../../components';

// ======================================================
// Actions
// ======================================================
import * as ApplicationActions from '../../../actions/applicationActions';
import * as Actions from './actions';

// ======================================================
// Selectors
// ======================================================
import MasterappSelector from '../../../selectors/masterapp';
import MasterdataSelector from '../../../selectors/masterdata';

const mapStateToProps = state => ({
  mainMenus: MasterdataSelector.getMainMenus(state.masterdata),
  productSteps: MasterdataSelector.getProductSteps(state.masterdata),
  products: MasterdataSelector.getProductsNotFree(state.masterdata),
  promotionSets: MasterdataSelector.getPromotionSets(state.masterdata),
  baseURL: MasterappSelector.getBaseURL(state.masterapp),
  lang: MasterappSelector.getLanguage(state.masterapp)
});

const actions = {
  ...ApplicationActions,
  ...Actions,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class ProductSelectionPage extends Component {
  static propTypes = {
    mainMenus: PropTypes.arrayOf(PropTypes.shape({})),
    productSteps: PropTypes.arrayOf(PropTypes.shape({})),
    products: PropTypes.arrayOf(PropTypes.shape({})),
    promotionSets: PropTypes.arrayOf(PropTypes.shape({})),
    selectProduct: PropTypes.func.isRequired,
    back: PropTypes.func.isRequired,
    baseURL: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
  };

  static defaultProps = {
    mainMenus: [],
    productSteps: [],
    products: [],
    promotionSets: [],
  };

  renderStepTitle = () => {
    const { lang } = this.props;
    if (lang === 'th') {
      return 'ขั้นตอน';
    }
    return 'Steps';
  }

  renderTitle = () => {
    const { mainMenus, lang, location: { pathname } } = this.props;
    const targetLocation = pathname.substring(1);
    const currMenu = _.find(mainMenus, menu => menu.linkTo === targetLocation);
    return currMenu.title[lang];
  }

  renderWatchingVideoText = () => {
    const { lang } = this.props;
    if (lang === 'th') {
      return 'ดูวิดิโอการกดซื้อ';
    }
    return 'Watching Tutorial';
  }

  render() {
    // console.log(this);
    const { lang, productSteps, products, promotionSets, selectProduct, back, baseURL } = this.props;
    return (
      <div>
        <Layout.Subheader>
          <div className="title-section">
            <div className="title">
              <span>{this.renderTitle()}</span>
            </div>
            <hr />
            <div className="how-to-box">
              <h2>{this.renderStepTitle()}</h2>
              <ul className="item how-to-list">
                {
                  _.map(productSteps, (step, index) => {
                    return (
                      <li key={`num-list-${index}`}><span className="num-list">{index + 1}</span><span>{step[lang]}</span></li>
                    );
                  })
                }
              </ul>
              <ul className="item">
                <li><span>{this.renderWatchingVideoText()}</span></li>
              </ul>
            </div>
          </div>
        </Layout.Subheader>
        <ProductItems
          promotionSets={promotionSets}
          products={products}
          promotionSetPerPage={3}
          productPerPage={20}
          onClickItem={selectProduct}
          height={1450}
          hasBackButton
          back={back}
          baseURL={baseURL}
        />
      </div>
    );
  }
}

export default withRouter(withAudio({ src: `http://localhost:${process.env.NODE_ENV !== 'production' ? '8888' : '81'}/vms/static/voice/2.mp3` }, actions)(connect(mapStateToProps, mapDispatchToProps)(ProductSelectionPage)));
