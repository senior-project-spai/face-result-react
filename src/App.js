import React, { useEffect, useState } from "react";
import {
  Box,
  CssBaseline,
  Container,
  Grid,
  Paper,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Skeleton } from "@material-ui/lab";

// ICON
import LanguageIcon from "@material-ui/icons/Language";
import LinkedCameraIcon from "@material-ui/icons/LinkedCamera";
import StoreIcon from "@material-ui/icons/Store";
import WcIcon from "@material-ui/icons/Wc";
import HistoryIcon from "@material-ui/icons/History";
import { faPercent } from "@fortawesome/free-solid-svg-icons";

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

function FaceResultDisplaySkeleton(props) {
  const ListWithAvatarSkeleton = props => (
    <Box overflow="hidden" display="flex" alignItems="center">
      <ListItemAvatar>
        <Avatar>
          <Skeleton variant="circle" />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={<Skeleton variant="text" width={75} />}
        secondary={<Skeleton component="span" variant="text" width={50} />}
      />
    </Box>
  );

  const classes = useStyles();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md="auto">
        <Box overflow="hidden" borderRadius="borderRadius" boxShadow={2}>
          <Skeleton variant="rect" height={325} width={500} />
        </Box>
      </Grid>
      <Grid item xs={12} md>
        <Paper className={classes.dataPaper}>
          <Grid container spacing={2}>
            <Grid item xs={12} container alignItems="center">
              <ListWithAvatarSkeleton />
            </Grid>
            <Grid item container alignItems="center" xs={6}>
              <ListWithAvatarSkeleton />
            </Grid>
            <Grid item xs={6} container alignItems="center">
              <ListWithAvatarSkeleton />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={6} container alignItems="center">
              <ListWithAvatarSkeleton />
            </Grid>
            <Grid item xs={6} container alignItems="center">
              <ListWithAvatarSkeleton />
            </Grid>
            <Grid item xs={6} container alignItems="center">
              <ListWithAvatarSkeleton />
            </Grid>
            <Grid item xs={6} container alignItems="center">
              <ListWithAvatarSkeleton />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}

function FaceResultDisplay(props) {
  const [fetching, setFetching] = useState(true);
  const [fetchingError, setFetchingError] = useState(false);
  const [responseData, setResponseData] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "http://face-result-api-spai.apps.spai.ml/_api/result/latest"
        );
        const json = await res.json();
        setResponseData(json);
      } catch (error) {
        console.error(error);
        setFetchingError(true);
      }
      setFetching(false);
    };

    fetchData();
  }, []);

  const classes = useStyles();

  if (fetching) return <FaceResultDisplaySkeleton />;
  if (fetchingError)
    return <Typography variant="h1">Fetching Error</Typography>;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md="auto">
        <Box overflow="hidden" borderRadius="borderRadius" boxShadow={2}>
          {!fetching ? (
            <img
              alt="preview"
              className={classes.imgResponsive}
              src={responseData["photo_data_uri"]}
            />
          ) : (
            <Skeleton variant="rect" height={325} width={500} />
          )}
        </Box>
      </Grid>
      <Grid item xs={12} md>
        <Paper className={classes.dataPaper}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="button">Information</Typography>
            </Grid>
            <Grid item xs={12} container alignItems="center">
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
            </Grid>
            <Grid item container alignItems="center" xs={6}>
              <ListItemAvatar>
                <Avatar>
                  <StoreIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Branch ID"
                secondary={responseData["branch_id"]}
              />
            </Grid>
            <Grid item xs={6} container alignItems="center">
              <ListItemAvatar>
                <Avatar>
                  <LinkedCameraIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Camera ID"
                secondary={responseData["camera_id"]}
              />
            </Grid>
            {responseData["results"].map(result => (
              <>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="button">Inference</Typography>
                </Grid>
                <Grid item xs={6} container alignItems="center">
                  <ListItemAvatar>
                    <Avatar>
                      <WcIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Gender"
                    secondary={result["gender"]["gender"]}
                  />
                </Grid>
                <Grid item xs={6} container alignItems="center">
                  <ListItemAvatar>
                    <Avatar>
                      <FontAwesomeIcon icon={faPercent} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Confidence"
                    secondary={result["gender"]["confidence"].toFixed(2)}
                  />
                </Grid>
                <Grid item xs={6} container alignItems="center">
                  <ListItemAvatar>
                    <Avatar>
                      <LanguageIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Race"
                    secondary={result["race"]["race"]}
                  />
                </Grid>
                <Grid item xs={6} container alignItems="center">
                  <ListItemAvatar>
                    <Avatar>
                      <FontAwesomeIcon icon={faPercent} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Confidence"
                    secondary={result["race"]["confidence"].toFixed(2)}
                  />
                </Grid>
              </>
            ))}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}

function App() {
  return (
    <Box paddingY={4}>
      <CssBaseline />
      <Container maxWidth="lg" fixed>
        <Typography variant="h4" component="h1" gutterBottom>
          Face Recognition Result
        </Typography>
        <FaceResultDisplay />
      </Container>
    </Box>
  );
}

export default App;
