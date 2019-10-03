import React from "react";
import { render } from "react-dom";
import "./index.css";
import App from "./App";

if (process.env.NODE_ENV === "development") {
  module.hot.accept("./App.js", () => {
    const App = require("./App.js").default;
    render(<App />, document.getElementById("root"));
  });
}

render(<App />, document.getElementById("root"));
