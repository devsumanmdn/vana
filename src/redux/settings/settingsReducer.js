import PropTypes from 'prop-types';

import {
  TOGGLE_SETTINGS_MODAL,
  TOGGLE_TRANSPARENT_MODE,
  SET_TRANSPARENCY_AMOUNT
} from './settingsActionTypes';

const initailState = {
  showModal: false,
  transparentMode: false,
  transparencyAmount: 60
};

const settingsReducer = (state = initailState, action) => {
  const { type, payload } = action;
  switch (type) {
    case TOGGLE_SETTINGS_MODAL:
      return {
        ...state,
        showModal: !state.showModal
      };
    case TOGGLE_TRANSPARENT_MODE:
      return {
        ...state,
        transparentMode: !state.transparentMode
      };
    case SET_TRANSPARENCY_AMOUNT:
      return {
        ...state,
        transparencyAmount: payload
      };
    default:
      return state;
  }
};
export default settingsReducer;

export const settingsPropType = PropTypes.shape({
  showModal: PropTypes.bool.isRequired,
  transparentMode: PropTypes.number.isRequired,
  transparencyAmount: PropTypes.bool.isRequired
});
