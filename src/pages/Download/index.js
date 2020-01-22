import React from "react";
import { Box, Container, TextField, Button, Grid } from "@material-ui/core";

const DownloadPage = props => {
  return (
    <Box paddingY={3}>
      <Container maxWidth="lg" fixed>
        <form>
          <Grid container>
            <TextField
              id="start-date-time"
              label="Start"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              id="end-date-time"
              label="End"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
            />
            <Button variant="contained" disableElevation>
              Download CSV
            </Button>
          </Grid>
        </form>
      </Container>
    </Box>
  );
};

export default DownloadPage;
