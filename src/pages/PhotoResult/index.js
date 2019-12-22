import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Container,
  Grid,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CardHeader,
  Card,
  List,
  ListItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// ICON
import LinkedCameraIcon from "@material-ui/icons/LinkedCamera";
import StoreIcon from "@material-ui/icons/Store";
import HistoryIcon from "@material-ui/icons/History";

import Loading from './Loading'

// MOCK
// import { response as MOCK_RESPONSE } from "./mock";

const useStyles = makeStyles(theme => ({
  imgResponsive: {
    display: "block",
    width: "100%",
    maxWidth: "500px",
    margin: "auto"
  },
  dataPaper: {
    padding: theme.spacing(2)
  }
}));

function useMyInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    tick(); // call immediately
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function FaceResultDisplay(props) {
  const [fetchError, setFetchError] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [responseData, setResponseData] = useState(undefined);

  const fetchData = async () => {
    if (fetching) return;
    setFetching(true);
    setFetchError(false);
    try {
      /* ------------------------------ MOCK RESPONSE ----------------------------- */
      // setResponseData(MOCK_RESPONSE);
      // setFetching(false)
      // return
      /* -------------------------------------------------------------------------- */
      const res = await fetch(
        "https://face-result-api-spai.apps.spai.ml/_api/result/latest"
      );
      const json = await res.json();
      setResponseData(json);
    } catch (error) {
      setFetchError(true);
      console.error(error);
    }
    setFetching(false);
  };

  useMyInterval(fetchData, 5000);

  const classes = useStyles();

  if (!responseData) return <Loading />;
  
  return (
    <Box paddingY={3}>
      <Container maxWidth="lg" fixed>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Photo" />
            <Divider />
            <Box overflow="hidden" bgcolor="grey.100">
              <img
                alt="preview"
                className={classes.imgResponsive}
                src={responseData["photo_data_uri"]}
              />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Information" />
            <Divider />
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <HistoryIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Date"
                  secondary={new Date(
                    responseData["epoch"] * 1000
                  ).toLocaleString("en-US", {
                    hour12: false,
                    timeZoneName: "short"
                  })}
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <StoreIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Branch ID"
                  secondary={responseData["branch_id"]}
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <LinkedCameraIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Camera ID"
                  secondary={responseData["camera_id"]}
                />
              </ListItem>
            </List>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Inferences" />
            <Divider />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>No.</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Confidence</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Confidence</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {responseData["results"].map((result, index) => (
                    <TableRow key={index}>
                      <TableCell component="th">{index}</TableCell>
                      <TableCell>{result["gender"]["gender"]}</TableCell>
                      <TableCell>
                        {Math.round(result["gender"]["confidence"] * 10000) /
                          100}
                      </TableCell>
                      <TableCell>{result["race"]["race"]}</TableCell>
                      <TableCell>
                        {Math.round(result["race"]["confidence"] * 10000) / 100}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
      </Container>
    </Box>
  );
}

export default FaceResultDisplay;
