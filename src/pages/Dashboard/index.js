import React from "react";
import { makeStyles } from "@material-ui/core";

const DASHBOARD_URL = "https://fr.wikipedia.org/wiki/Main_Page";

const useStyles = makeStyles(theme => ({
  iframe: {
    display: "block",
    border: "0px",
    width: "100%",

    /* --------------------------- Full screen height --------------------------- */

    minHeight: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
    "@media (min-width:0px) and (orientation: landscape)": {
      minHeight: `calc(100vh - ${theme.mixins.toolbar["@media (min-width:0px) and (orientation: landscape)"].minHeight}px)`
    },
    "@media (min-width:600px)": {
      minHeight: `calc(100vh - ${theme.mixins.toolbar["@media (min-width:600px)"].minHeight}px)`
    }

    /* -------------------------------------------------------------------------- */
  }
}));

const DashboardPage = props => {
  const styles = useStyles();
  return (
    <iframe title="Dashboard" className={styles.iframe} src={DASHBOARD_URL} />
  );
};

export default DashboardPage;
