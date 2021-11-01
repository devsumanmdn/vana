import React from "react";
import { Provider } from "react-redux";
import { ThemeProvider, withStyles } from "@mui/styles";
import CssBaseline from "@mui/material/CssBaseline";

import theme from "./theme";

import store from "./redux/store";
import Home from "./components/Home";

const GlobalCSS = withStyles({
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
        minHeight: "100%",
      },

      "&:hover": {
        boxShadow: "0 0 3px 1px #aaa4 inset",
        "&$draggable": {
          opacity: 1,
        },
      },
    },
    "*::-webkit-scrollbar": {
      width: 8,
    },
    "*::-webkit-scrollbar-track": {
      // boxShadow: 'inset 0 0 6px rgba(0,0,0,0.3)',
      backgroundColor: "transparent",
    },

    "*::-webkit-scrollbar-thumb": {
      backgroundColor: "#4444",
      outline: "1px solid slategrey",
      borderRadius: 4,
    },
  },
})(() => null);

const App = (): JSX.Element => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalCSS />
        <Home />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
