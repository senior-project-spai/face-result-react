import React from "react";
import { Switch, Route } from "react-router-dom";

import PhotoResultPage from "./pages/PhotoResult";
import DashboardPage from "./pages/Dashboard";
import SearchPage from "./pages/Search";
import MainLayout from "./layouts/Main";
import ImagePage from "./pages/Image";
import ImageListPage from "./pages/ImageList";

const Routes = (props) => {
  return (
    <Switch>
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
      <Route path="/images" exact>
        <MainLayout>
          <ImageListPage />
        </MainLayout>
      </Route>
      <Route path="/images/:imageID">
        <MainLayout>
          <ImagePage />
        </MainLayout>
      </Route>
      { /* Default route */ }
      <Route path="/">
        <MainLayout />
      </Route>
    </Switch>
  );
};

export default Routes;
