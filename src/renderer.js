import React from "react";
import { render } from "react-dom";
import "./index.css";
import App from "./App";

module.hot.accept("./App.js", () => {
  const App = require("./App.js").default;
  render(<App />, document.getElementById("root"));
});

render(<App />, document.getElementById("root"));
