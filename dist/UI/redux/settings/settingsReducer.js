"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.settingsPropType = void 0;
var prop_types_1 = __importDefault(require("prop-types"));
var settingsActionTypes_1 = require("./settingsActionTypes");
var initailState = {
    showModal: false,
    transparentMode: false,
    transparencyAmount: 60
};
var settingsReducer = function (state, action) {
    if (state === void 0) { state = initailState; }
    var type = action.type, payload = action.payload;
    switch (type) {
        case settingsActionTypes_1.TOGGLE_SETTINGS_MODAL:
            return __assign(__assign({}, state), { showModal: !state.showModal });
        case settingsActionTypes_1.TOGGLE_TRANSPARENT_MODE:
            return __assign(__assign({}, state), { transparentMode: !state.transparentMode });
        case settingsActionTypes_1.SET_TRANSPARENCY_AMOUNT:
            return __assign(__assign({}, state), { transparencyAmount: payload });
        default:
            return state;
    }
};
exports["default"] = settingsReducer;
exports.settingsPropType = prop_types_1["default"].shape({
    showModal: prop_types_1["default"].bool.isRequired,
    transparentMode: prop_types_1["default"].bool.isRequired,
    transparencyAmount: prop_types_1["default"].number.isRequired
});
//# sourceMappingURL=settingsReducer.js.map