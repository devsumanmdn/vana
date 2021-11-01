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
var makeStyles_1 = __importDefault(require("@mui/styles/makeStyles"));
var Icon_1 = __importDefault(require("@mui/material/Icon"));
var IconButton_1 = __importDefault(require("@mui/material/IconButton"));
var useStyles = (0, makeStyles_1["default"])({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#222',
        '& > div': {
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 10px',
            '& > button': {
                color: '#ccc',
                border: '1px solid #ccc',
                borderRadius: '50%',
                padding: 4,
                '&:hover': {
                    color: '#fda'
                }
            }
        }
    }
});
function Sidebar(_a) {
    var chooseFolderDialog = _a.chooseFolderDialog;
    var classes = useStyles();
    return ((0, jsx_runtime_1.jsx)("div", __assign({ className: classes.root }, { children: (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(IconButton_1["default"], __assign({ onClick: chooseFolderDialog }, { children: (0, jsx_runtime_1.jsx)(Icon_1["default"], { children: "add" }, void 0) }), void 0) }, void 0) }), void 0));
}
Sidebar.propTypes = {};
exports["default"] = Sidebar;
//# sourceMappingURL=Sidebar.js.map