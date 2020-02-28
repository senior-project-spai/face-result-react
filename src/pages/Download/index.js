import React, { useState } from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {
  Box,
  Card,
  CardHeader,
  Table,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
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
import csv from "csvtojson";

const FACE_RESULT_API_CSV_URL =
  "https://face-result-api-fastapi-spai.apps.spai.ml/_api/result/csv";

const FACE_RESULT_API_URL =
  "result/";

const DownloadPage = props => {
  const [startDateTime, setStartDateTime] = useState();
  const [endDateTime, setEndDateTime] = useState();
  const [resultData, setResultData] = useState();

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

  const viewCSV = async () => {
    const data = {
      ...(startDateTime && { start: startDateTime.getTime() / 1000 }),
      ...(endDateTime && { end: endDateTime.getTime() / 1000 })
    };

    const response = await fetch(
      `${FACE_RESULT_API_CSV_URL}?${new URLSearchParams(data).toString()}`
    );
    const csvText = await response.text();
    const csvRow = await csv().fromString(csvText)
    setResultData(csvRow)
  };

  /* -------------------------------------------------------------------------- */

  const onClickDownloadButton = event => {
    event.preventDefault();
    downloadCSV();
  };

  const onClickViewButton = event => {
    event.preventDefault();
    viewCSV();
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
            <Button
              disableElevation
              color="secondary"
              onClick={onClickViewButton}
            >
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
        {resultData && (
          <Card>
            <CardHeader title="Results" />
            <Divider />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {Object.keys(resultData[0]).map(key => (
                      <TableCell key={key}>{key}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {resultData.map(row => (
                    <TableRow key={row.id} onClick={event => window.location.href = FACE_RESULT_API_URL + row.id}>
                      {Object.keys(row).map(key => (
                        <TableCell key={key}>{row[key]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}
      </Container>
    </Box>
  );
};

export default DownloadPage;
