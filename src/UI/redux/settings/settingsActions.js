import {
  TOGGLE_SETTINGS_MODAL,
  TOGGLE_TRANSPARENT_MODE,
  SET_TRANSPARENCY_AMOUNT
} from './settingsActionTypes';

export function toggleSettingsModal() {
  return {
    type: TOGGLE_SETTINGS_MODAL
  };
}

export function toggleTransparency() {
  return {
    type: TOGGLE_TRANSPARENT_MODE
  };
}

export function setTransparecnyAmount(value) {
  return {
    type: SET_TRANSPARENCY_AMOUNT,
    payload: value
  };
}
