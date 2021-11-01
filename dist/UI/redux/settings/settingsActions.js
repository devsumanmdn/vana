"use strict";
exports.__esModule = true;
exports.setTransparecnyAmount = exports.toggleTransparency = exports.toggleSettingsModal = void 0;
var settingsActionTypes_1 = require("./settingsActionTypes");
function toggleSettingsModal() {
    return {
        type: settingsActionTypes_1.TOGGLE_SETTINGS_MODAL
    };
}
exports.toggleSettingsModal = toggleSettingsModal;
function toggleTransparency() {
    return {
        type: settingsActionTypes_1.TOGGLE_TRANSPARENT_MODE
    };
}
exports.toggleTransparency = toggleTransparency;
function setTransparecnyAmount(value) {
    return {
        type: settingsActionTypes_1.SET_TRANSPARENCY_AMOUNT,
        payload: value
    };
}
exports.setTransparecnyAmount = setTransparecnyAmount;
//# sourceMappingURL=settingsActions.js.map