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
var react_redux_1 = require("react-redux");
var styles_1 = require("@mui/styles");
var CssBaseline_1 = __importDefault(require("@mui/material/CssBaseline"));
var theme_1 = __importDefault(require("./theme"));
var store_1 = __importDefault(require("./redux/store"));
var Home_1 = __importDefault(require("./components/Home"));
var GlobalCSS = (0, styles_1.withStyles)({
    "@global": {
        body: {
            fontFamily: "'Open Sans', sans-serif",
            margin: 0,
            height: "100vh",
            transitionDuration: "0.2s",
            overflow: "hidden",
            borderRadius: 6,
            "& #root": {
                borderRadius: 6,
                position: "relative",
                minHeight: "100%"
            },
            "&:hover": {
                boxShadow: "0 0 3px 1px #aaa4 inset",
                "&$draggable": {
                    opacity: 1
                }
            }
        },
        "*::-webkit-scrollbar": {
            width: 8
        },
        "*::-webkit-scrollbar-track": {
            // boxShadow: 'inset 0 0 6px rgba(0,0,0,0.3)',
            backgroundColor: "transparent"
        },
        "*::-webkit-scrollbar-thumb": {
            backgroundColor: "#4444",
            outline: "1px solid slategrey",
            borderRadius: 4
        }
    }
})(function () { return null; });
var App = function () {
    return ((0, jsx_runtime_1.jsx)(react_redux_1.Provider, __assign({ store: store_1["default"] }, { children: (0, jsx_runtime_1.jsxs)(styles_1.ThemeProvider, __assign({ theme: theme_1["default"] }, { children: [(0, jsx_runtime_1.jsx)(CssBaseline_1["default"], {}, void 0), (0, jsx_runtime_1.jsx)(GlobalCSS, {}, void 0), (0, jsx_runtime_1.jsx)(Home_1["default"], {}, void 0)] }), void 0) }), void 0));
};
exports["default"] = App;
//# sourceMappingURL=App.js.map