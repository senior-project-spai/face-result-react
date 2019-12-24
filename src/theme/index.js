import { createMuiTheme } from "@material-ui/core";

import overrides from "./overrides";
import typography from "./typography";
import palette from "./palette";

const theme = createMuiTheme({ typography, palette, overrides });

export default theme;
