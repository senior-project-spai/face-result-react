import React from "react";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";

import Routes from "./Routes";
import theme from "./theme";

const browserHistory = createBrowserHistory();

const App = props => {
  return (
      <ThemeProvider theme={theme}>
      <CssBaseline />
        <Router history={browserHistory}>
          <Routes />
        </Router>
      </ThemeProvider>
  );
};

export default App;
