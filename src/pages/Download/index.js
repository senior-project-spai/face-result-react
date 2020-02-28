import React, { useState } from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {
  Box,
  Container,
  Button,
  Grid,
  ExpansionPanel,
  ExpansionPanelSummary,
  useTheme,
  ExpansionPanelDetails,
  Typography,
  Divider,
  ExpansionPanelActions,
  TextField
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from "@material-ui/pickers";

const FACE_RESULT_API_CSV_URL =
  "https://face-result-api-fastapi-spai.apps.spai.ml/_api/result/csv";

const DownloadPage = props => {
  const [startDateTime, setStartDateTime] = useState();
  const [endDateTime, setEndDateTime] = useState();

  const downloadCSV = async () => {
    const data = {
      ...(startDateTime && { start: startDateTime.getTime() / 1000 }),
      ...(endDateTime && { end: endDateTime.getTime() / 1000 })
    };

    // HACK: Download file with ajax
    const response = await fetch(
      `${FACE_RESULT_API_CSV_URL}?${new URLSearchParams(data).toString()}`
    );
    window.location.href = response.url;
  };

  /* -------------------------------------------------------------------------- */

  const onClickDownloadButton = event => {
    event.preventDefault();
    downloadCSV();
  };

  const theme = useTheme();
  const isBreakpointLG = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <Box paddingY={3}>
      <Container maxWidth="lg" fixed>
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Options Panel</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container alignItems="center" spacing={3}>
                  <Grid item container xs={12} spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Branch ID"
                        variant="outlined"
                        fullWidth
                      ></TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Camera ID"
                        variant="outlined"
                        fullWidth
                      ></TextField>
                    </Grid>
                  </Grid>
                  <Grid item md="auto" xs={12}>
                    <KeyboardDateTimePicker
                      label="Start"
                      inputVariant="outlined"
                      fullWidth
                      onChange={setStartDateTime}
                    />
                  </Grid>
                  <Grid item xs={12} md>
                    <KeyboardDateTimePicker
                      label="End"
                      inputVariant="outlined"
                      fullWidth={!isBreakpointLG}
                      onChange={setEndDateTime}
                    />
                  </Grid>
                </Grid>
            </MuiPickersUtilsProvider>
          </ExpansionPanelDetails>
          <Divider />
          <ExpansionPanelActions>
            <Button disableElevation color="secondary">
              View
            </Button>
            <Button
              disableElevation
              color="primary"
              onClick={onClickDownloadButton}
            >
              Download
            </Button>
          </ExpansionPanelActions>
        </ExpansionPanel>
      </Container>
    </Box>
  );
};

export default DownloadPage;
