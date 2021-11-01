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
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var prop_types_1 = __importDefault(require("prop-types"));
var makeStyles_1 = __importDefault(require("@mui/styles/makeStyles"));
var react_redux_1 = require("react-redux");
var Dialog_1 = __importDefault(require("@mui/material/Dialog"));
var Button_1 = __importDefault(require("@mui/material/Button"));
var Slider_1 = __importDefault(require("@mui/material/Slider"));
var Switch_1 = __importDefault(require("@mui/material/Switch"));
var DialogTitle_1 = __importDefault(require("@mui/material/DialogTitle"));
var DialogContent_1 = __importDefault(require("@mui/material/DialogContent"));
var DialogActions_1 = __importDefault(require("@mui/material/DialogActions"));
var List_1 = __importDefault(require("@mui/material/List"));
var ListItem_1 = __importDefault(require("@mui/material/ListItem"));
var ListItemText_1 = __importDefault(require("@mui/material/ListItemText"));
var ListItemSecondaryAction_1 = __importDefault(require("@mui/material/ListItemSecondaryAction"));
var settingsActions_1 = require("../redux/settings/settingsActions");
var settingsReducer_1 = require("../redux/settings/settingsReducer");
var useStyles = (0, makeStyles_1["default"])({
    root: {},
    form: {
        display: 'flex',
        flexDirection: 'column',
        '& > div': {
            marginTop: 20
        }
    },
    paper: {
        minWidth: 300
    }
});
var TransparencyDialog = function (_a) {
    var open = _a.open, onClose = _a.onClose, transparencyAmount = _a.transparencyAmount, setTransparecnyAmount = _a.setTransparecnyAmount;
    return ((0, jsx_runtime_1.jsxs)(Dialog_1["default"], __assign({ open: open }, { children: [(0, jsx_runtime_1.jsx)(DialogTitle_1["default"], { children: "Transparancy Amount" }, void 0), (0, jsx_runtime_1.jsx)(DialogContent_1["default"], __assign({ style: { overflowY: 'visible' } }, { children: (0, jsx_runtime_1.jsx)(Slider_1["default"], { valueLabelDisplay: "auto", "aria-labelledby": "slider-list-label-transparency-amount", onChange: function (e, value) { return setTransparecnyAmount(100 - value); }, value: transparencyAmount, max: 100 }, void 0) }), void 0), (0, jsx_runtime_1.jsx)(DialogActions_1["default"], { children: (0, jsx_runtime_1.jsx)(Button_1["default"], __assign({ variant: "outlined", onClick: onClose, color: "primary" }, { children: "Ok" }), void 0) }, void 0)] }), void 0));
};
TransparencyDialog.propTypes = {
    open: prop_types_1["default"].bool.isRequired,
    onClose: prop_types_1["default"].func.isRequired,
    transparencyAmount: prop_types_1["default"].number.isRequired,
    setTransparecnyAmount: prop_types_1["default"].func.isRequired
};
function SettingsDialog(_a) {
    var settings = _a.settings, setTransparecnyAmount = _a.setTransparecnyAmount, toggleSettingsModal = _a.toggleSettingsModal, toggleTransparency = _a.toggleTransparency;
    var classes = useStyles();
    var _b = (0, react_1.useState)(false), transparencyDialogOpen = _b[0], setTransparencyDialogOpen = _b[1];
    var transparencyAmount = 100 - settings.transparencyAmount;
    return ((0, jsx_runtime_1.jsxs)(Dialog_1["default"], __assign({ classes: { paper: classes.paper }, open: settings.showModal }, { children: [(0, jsx_runtime_1.jsx)(DialogTitle_1["default"], { children: "Settings" }, void 0), (0, jsx_runtime_1.jsx)(DialogContent_1["default"], { children: (0, jsx_runtime_1.jsx)("form", __assign({ className: classes.form }, { children: (0, jsx_runtime_1.jsxs)(List_1["default"], __assign({ className: classes.root }, { children: [(0, jsx_runtime_1.jsxs)(ListItem_1["default"], { children: [(0, jsx_runtime_1.jsx)(ListItemText_1["default"], { id: "switch-list-label-tranparent-mode", primary: "Transparent Mode", secondary: settings.transparentMode ? 'On' : 'Off' }, void 0), (0, jsx_runtime_1.jsx)(ListItemSecondaryAction_1["default"], { children: (0, jsx_runtime_1.jsx)(Switch_1["default"], { edge: "end", onChange: function (value) { return toggleTransparency(value); }, checked: settings.transparentMode, inputProps: {
                                                'aria-labelledby': 'switch-list-label-tranparent-mode'
                                            } }, void 0) }, void 0)] }, void 0), (0, jsx_runtime_1.jsx)(ListItem_1["default"], __assign({ button: true, onClick: function () { return setTransparencyDialogOpen(true); } }, { children: (0, jsx_runtime_1.jsx)(ListItemText_1["default"], { id: "slider-list-label-transparency-amount", primary: "Transparancy Amount", secondary: transparencyAmount + "%" }, void 0) }), void 0)] }), void 0) }), void 0) }, void 0), (0, jsx_runtime_1.jsx)(DialogActions_1["default"], { children: (0, jsx_runtime_1.jsx)(Button_1["default"], __assign({ onClick: toggleSettingsModal, color: "primary" }, { children: "Done" }), void 0) }, void 0), (0, jsx_runtime_1.jsx)(TransparencyDialog, { open: transparencyDialogOpen, onClose: function () { return setTransparencyDialogOpen(false); }, setTransparecnyAmount: setTransparecnyAmount, transparencyAmount: transparencyAmount }, void 0)] }), void 0));
}
SettingsDialog.propTypes = {
    settings: settingsReducer_1.settingsPropType.isRequired,
    toggleSettingsModal: prop_types_1["default"].func.isRequired,
    setTransparecnyAmount: prop_types_1["default"].func.isRequired,
    toggleTransparency: prop_types_1["default"].func.isRequired
};
var mapStateToProps = function (_a) {
    var settings = _a.settings;
    return ({ settings: settings });
};
var mapDispatchToProps = {
    toggleSettingsModal: settingsActions_1.toggleSettingsModal,
    setTransparecnyAmount: settingsActions_1.setTransparecnyAmount,
    toggleTransparency: settingsActions_1.toggleTransparency
};
exports["default"] = (0, react_redux_1.connect)(mapStateToProps, mapDispatchToProps)(SettingsDialog);
//# sourceMappingURL=SettingsDialog.js.map