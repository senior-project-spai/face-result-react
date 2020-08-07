import React from "react";
import { Switch, Redirect, Route } from "react-router-dom";

import PhotoResultPage from "./pages/PhotoResult";
import DashboardPage from "./pages/Dashboard";
import SearchPage from "./pages/Search";
import MainLayout from "./layouts/Main";
import ImagePage from "./pages/Image";

const Routes = (props) => {
  return (
    <Switch>
      <Redirect exact from="/" to="/result/latest" />
      <Route
        exact
        path="/result/:id"
        render={(matchProps) => (
          <MainLayout>
            <PhotoResultPage faceImageID={matchProps.match.params.id} />
          </MainLayout>
        )}
      />
      <Route
        exact
        path="/dashboard"
        render={(matchProps) => (
          <MainLayout>
            <DashboardPage />
          </MainLayout>
        )}
      />
      <Route
        exact
        path="/search"
        render={(matchProps) => (
          <MainLayout>
            <SearchPage />
          </MainLayout>
        )}
      />
      <Route path="/images/:imageID">
        <MainLayout>
          <ImagePage />
        </MainLayout>
      </Route>
    </Switch>
  );
};

export default Routes;
