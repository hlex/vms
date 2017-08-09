import { createSelector } from 'reselect';

const getSelectedMobileTopupProvider = state => state.selectedMobileTopupProvider;
const getBannerSrc = createSelector(
  [getSelectedMobileTopupProvider],
  (selectedMobileTopupProvider) => {
    return selectedMobileTopupProvider.banner;
  }
)

export default {
  getSelectedMobileTopupProvider,
  getBannerSrc,
};
