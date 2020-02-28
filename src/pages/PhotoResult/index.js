import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Container,
  Grid,
  ListItemText,
  ListItemIcon,
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
import FaceIcon from "@material-ui/icons/Face";

import Loading from "./Loading";

// MOCK
// import MOCK_RESPONSE from './MOCK-RESULT.json'

const FACE_RESULT_API_URL =
  "https://face-result-api-fastapi-spai.apps.spai.ml/_api/result/";

const useStyles = makeStyles(theme => ({
  imgResponsive: {
    display: "block",
    width: "100%",
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
  const faceImageID = props.faceImageID

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
      // setFetching(false);
      // return;
      /* -------------------------------------------------------------------------- */
      const res = await fetch(FACE_RESULT_API_URL + faceImageID);
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

  const result = responseData["results"][0];

  return (
    <Box paddingY={3}>
      <Container maxWidth="lg" fixed>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Image" />
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
              <CardHeader title="Details" />
              <Divider />
              <List>
                <ListItem>
                  <ListItemIcon>
                    <FaceIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Face Image ID"
                    secondary={responseData["id"]}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <HistoryIcon />
                  </ListItemIcon>
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
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <StoreIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Branch ID"
                    secondary={responseData["branch_id"]}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <LinkedCameraIcon />
                  </ListItemIcon>
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
              <CardHeader title="Analytics" />
              <Divider />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Result</TableCell>
                      <TableCell>Confidence</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th">Gender</TableCell>
                      <TableCell>{result["gender"]["type"]}</TableCell>
                      <TableCell>
                        {Math.round(result["gender"]["confidence"] * 10000) /
                          100}{" "}
                        %
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">Age</TableCell>
                      <TableCell>{`${result["age"]["min_age"]} - ${result["age"]["max_age"]}`}</TableCell>
                      <TableCell>
                        {Math.round(result["age"]["confidence"] * 10000) / 100}{" "}
                        %
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th">Race</TableCell>
                      <TableCell>{result["race"]["type"]}</TableCell>
                      <TableCell>
                        {Math.round(result["race"]["confidence"] * 10000) / 100}{" "}
                        %
                      </TableCell>
                    </TableRow>
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
