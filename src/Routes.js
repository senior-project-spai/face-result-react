import React from "react";
import { Switch, Redirect, Route } from "react-router-dom";

import PhotoResultPage from "./pages/PhotoResult";
import DashboardPage from "./pages/Dashboard";
import DownloadPage from "./pages/Download";
import MainLayout from "./layouts/Main";

const Routes = props => {
  return (
    <Switch>
      <Redirect exact from="/" to="/result" />
      <Route
        exact
        path="/result"
        render={matchProps => (
          <MainLayout>
            <PhotoResultPage />
          </MainLayout>
        )}
      />
      <Route
        exact
        path="/dashboard"
        render={matchProps => (
          <MainLayout>
            <DashboardPage />
          </MainLayout>
        )}
      />
      <Route
        exact
        path="/download"
        render={matchProps => (
          <MainLayout>
            <DownloadPage />
          </MainLayout>
        )}
      />
    </Switch>
  );
};

export default Routes;
