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
import { useParams } from "react-router";

const FACE_RESULT_IMAGE_API_URL =
  process.env.REACT_APP_FACE_RESULT_IMAGE_API_URL || "http://face-result-api-spai.apps.spai.ml/_api/images";

function findMaxValues(obj) {
  const isAllNumber = Object.values(obj).every((value) => {
    return typeof value === "number";
  });

  if (!isAllNumber) return null;

  const keyOfMaxValue = Object.keys(obj).reduce((prev, cur) =>
    obj[cur] > obj[prev] ? cur : prev
  );

  return keyOfMaxValue;
}

const imageWithFaceBoxes = (imageURI, faces) => {
  return new Promise((resolve, _) => {
    /* Draw rectangle on image */
    // Create HTMLImageElement
    const originalImage = new Image();
    originalImage.setAttribute("crossorigin", "anonymous");
    originalImage.onload = () => {
      // Create canvas
      const canvas = document.createElement("canvas");
      canvas.width = originalImage.width;
      canvas.height = originalImage.height;

      // Setup ctx
      const ctx = canvas.getContext("2d");
      ctx.lineWidth = Math.ceil(originalImage.height * 0.005);
      ctx.strokeStyle = "red";
      ctx.fillStyle = "red";
      ctx.textBaseline = "top";

      // Draw an original image first
      ctx.drawImage(originalImage, 0, 0);

      // Draw box for each face
      faces.forEach((face, faceIndex) => {
        ctx.beginPath();
        // Rectangle
        ctx.rect(
          face.position_left,
          face.position_top,
          face.position_right - face.position_left,
          face.position_bottom - face.position_top
        );
        ctx.stroke();
        // Text
        ctx.font = `${parseFloat(
          (face.position_bottom - face.position_top) * 0.04 * 5
        )}px Arial`;
        ctx.fillText(
          faceIndex.toString(),
          face.position_left,
          face.position_top
        );
      });
      // Create new imageJson with new image
      resolve(canvas.toDataURL());
    };
    originalImage.src = imageURI;
  });
};

const useImageAPI = (imageID = "latest") => {
  const [image, setImage] = useState();
  const [faces, setFaces] = useState();

  // Loading status
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    // Fetch Image
    (async () => {
      setIsFetching(true);
      try {
        // Fetching Image data
        const imageRes = await fetch(`${FACE_RESULT_IMAGE_API_URL}/${imageID}`);
        const imageJSON = await imageRes.json();
        setImage(imageJSON);

        // Fetching faces data
        const facesRes = await fetch(
          `${FACE_RESULT_IMAGE_API_URL}/${imageID}/faces`
        );
        const facesJSON = await facesRes.json();
        setFaces(facesJSON);

        // Create new imageJson with face box image
        const newImageJSON = {
          ...imageJSON,
          data_uri: await imageWithFaceBoxes(imageJSON.data_uri, facesJSON),
        };
        setImage(newImageJSON);
      } catch (error) {
        console.error(error);
      }
      setIsFetching(false);
    })();
  }, [imageID]);

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
  const { imageID } = useParams();

  const [image, faces, isImageAPIFetching] = useImageAPI(imageID);

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
                  alt="preview"
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
                      const gender = findMaxValues(gender_obj);

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
                      const age = findMaxValues(age_obj);

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
                      const emotion = findMaxValues(emotion_obj);

                      return (
                        <TableRow key={faceIndex}>
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
