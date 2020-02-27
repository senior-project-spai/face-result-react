import React, { useState } from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {
  Box,
  Container,
  Button,
  Grid,
  ExpansionPanel,
  ExpansionPanelSummary,
  useTheme
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
        <ExpansionPanel>
          <form>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Grid container alignItems="center" spacing={2}>
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
                  <Grid item xs={12} md="auto">
                    <Button
                      variant="contained"
                      disableElevation
                      size="large"
                      color="primary"
                      fullWidth
                      onClick={onClickDownloadButton}
                    >
                      Download
                    </Button>
                  </Grid>
                </Grid>
              </ExpansionPanelSummary>
            </MuiPickersUtilsProvider>
          </form>
        </ExpansionPanel>
      </Container>
    </Box>
  );
};

export default DownloadPage;
