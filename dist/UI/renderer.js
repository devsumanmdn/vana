"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var jsx_runtime_1 = require("react/jsx-runtime");
// import "./index.css";
var react_dom_1 = require("react-dom");
var App_1 = __importDefault(require("./App"));
if (process.env.NODE_ENV === "development") {
    module.hot.accept("./App.tsx", function () {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        var AppHot = require("./App.tsx");
        (0, react_dom_1.render)((0, jsx_runtime_1.jsx)(AppHot, {}, void 0), document.getElementById("root"));
    });
}
(0, react_dom_1.render)((0, jsx_runtime_1.jsx)(App_1["default"], {}, void 0), document.getElementById("root"));
//# sourceMappingURL=renderer.js.map