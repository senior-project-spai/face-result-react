import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  TableContainer,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  Table,
  TableBody,
} from "@material-ui/core";
import { useHistory } from "react-router";

const FACE_RESULT_IMAGE_API_URL =
  process.env.REACT_APP_IMAGE_RESULT_API_URL || "http://face-result-api-spai.apps.spai.ml/_api/images";

export default (props) => {
  const history = useHistory();

  const [images, setImages] = useState([]);

  useEffect(() => {
    (async () => {
      // setImage(TWO_PERSON_IMAGE);
      // setFaces(TWO_PERSON_FACES);
      const imagesRes = await fetch(`${FACE_RESULT_IMAGE_API_URL}`);
      setImages(await imagesRes.json());
      // setImage(NARA_IMAGE);
      // setFaces(NARA_FACES);
    })();
  }, []);

  return (
    <Box paddingY={3}>
      <Container maxWidth="lg" fixed>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Timestamp</TableCell>
                <TableCell>Path</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {images.map((image) => {
                return (
                  <TableRow
                    key={image["id"]}
                    onClick={(event) => history.push(`/images/${image.id}`)}
                  >
                    <TableCell>{image["id"]}</TableCell>
                    <TableCell>
                      {new Date(image["timestamp"]).toLocaleString("en-US", {
                        hour12: false,
                        timeZoneName: "short",
                      })}
                    </TableCell>
                    <TableCell>{image["path"]}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};
