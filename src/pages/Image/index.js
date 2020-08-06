import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardHeader,
  Divider,
  Box,
  makeStyles,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TableRow,
  TableCell,
  TableContainer,
  Table,
  TableHead,
  TableBody,
} from "@material-ui/core";

import {
  Image as ImageIcon,
  History as HistoryIcon,
  Folder as FolderIcon,
} from "@material-ui/icons";

import NARA_IMAGE from "./MOCK/response_face-result-api_nara-thai_image";
import NARA_FACES from "./MOCK/response_face-result-api_nara-thai_faces";
import TWO_PERSON_IMAGE from "./MOCK/response_face-result-api_two-person_image";
import TWO_PERSON_FACES from "./MOCK/response_face-result-api_two-person_faces";

const FACE_RESULT_IMAGE_API_URL = "https://face-result-api-fastapi-spai.apps.spai.ml/_api/images";

const useImageAPI = () => {
  const [image, setImage] = useState();
  const [faces, setFaces] = useState();

  // Loading status
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    // Fetch Image
    (async () => {
      try {
        // setImage(TWO_PERSON_IMAGE);
        // setFaces(TWO_PERSON_FACES);
        const imageRes = await fetch(`${FACE_RESULT_IMAGE_API_URL}/latest`)
        setImage(await imageRes.json())
        const facesRes = await fetch(`${FACE_RESULT_IMAGE_API_URL}/latest/faces`)
        setFaces(await facesRes.json())
        // setImage(NARA_IMAGE);
        // setFaces(NARA_FACES);
      } catch (error) {
        console.error(error);
      }
      setIsFetching(false);
    })();
  }, []);

  return [image, faces, isFetching];
};

const useStyles = makeStyles((theme) => ({
  imgResponsive: {
    display: "block",
    maxWidth: "100%",
    maxHeight: "36em",
    margin: "auto",
  },
}));

export default (props) => {
  const [image, faces, isImageAPIFetching] = useImageAPI();

  const classes = useStyles();

  if (isImageAPIFetching) return <LinearProgress color="secondary" />;

  return (
    <Box paddingY={3}>
      <Container maxWidth="lg" fixed>
        <Grid container spacing={3}>
          {/* Image Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Image" />
              <Divider />
              <Box overflow="hidden" bgcolor="grey.100">
                <img
                  alt="image"
                  src={image.data_uri}
                  className={classes.imgResponsive}
                />
              </Box>
            </Card>
          </Grid>

          {/* Image detail Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Details" />
              <Divider />
              <List>
                <ListItem>
                  <ListItemIcon>
                    <ImageIcon />
                  </ListItemIcon>
                  <ListItemText primary="ID" secondary={image["id"]} />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <HistoryIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Timestamp"
                    secondary={new Date(image["timestamp"]).toLocaleString(
                      "en-US",
                      {
                        hour12: false,
                        timeZoneName: "short",
                      }
                    )}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText primary="File Path" secondary={image["path"]} />
                </ListItem>
              </List>
            </Card>
          </Grid>

          {/* Analytics */}
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Analytics" />
              <Divider />
              <TableContainer>
                <Table>
                  {/* Head */}
                  <TableHead>
                    <TableRow>
                      <TableCell>No.</TableCell>
                      <TableCell>Label</TableCell>
                      <TableCell>Gender</TableCell>
                      <TableCell>Age</TableCell>
                      <TableCell>Emotion</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {faces.map((face, faceIndex) => {
                      // Find max confidence of gender
                      const gender_obj = {
                        Male: face["male_confidence"],
                        Female: face["female_confidence"],
                      };
                      const gender = Object.keys(
                        gender_obj
                      ).reduce((prev, cur) =>
                        gender_obj[cur] > gender_obj[prev] ? cur : prev
                      );

                      // Find max confidence of age
                      const age_obj = {
                        "0 - 10": face["0_to_10_confidence"],
                        "11 - 20": face["11_to_20_confidence"],
                        "21 - 30": face["21_to_30_confidence"],
                        "31 - 40": face["31_to_40_confidence"],
                        "41 - 50": face["41_to_50_confidence"],
                        "51 - 60": face["51_to_60_confidence"],
                        "61 - 70": face["61_to_70_confidence"],
                        "71 - 100": face["71_to_100_confidence"],
                      };
                      const age = Object.keys(age_obj).reduce((prev, cur) =>
                        age_obj[cur] > age_obj[prev] ? cur : prev
                      );

                      // Find max confidence of emotion
                      const emotion_obj = {
                        uncertain: face["uncertain_confidence"],
                        angry: face["angry_confidence"],
                        disgusted: face["disgusted_confidence"],
                        fearful: face["fearful_confidence"],
                        happy: face["happy_confidence"],
                        neutral: face["neutral_confidence"],
                        sad: face["sad_confidence"],
                        surprised: face["surprised_confidence"],
                      };
                      const emotion = Object.keys(
                        emotion_obj
                      ).reduce((prev, cur) =>
                        emotion_obj[cur] > emotion_obj[prev] ? cur : prev
                      );

                      return (
                        <TableRow>
                          <TableCell>{faceIndex}</TableCell>
                          <TableCell>{face["label"] || "-"}</TableCell>
                          <TableCell>{`${gender}, ${(
                            gender_obj[gender] * 100
                          ).toFixed(2)}%`}</TableCell>
                          <TableCell>{`${age}, ${(age_obj[age] * 100).toFixed(
                            2
                          )}%`}</TableCell>
                          <TableCell>{`${emotion}, ${(
                            emotion_obj[emotion] * 100
                          ).toFixed(2)}%`}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
