import { blue, blueGrey, deepOrange, lightBlue } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
 
export const AppTheme = createTheme({
  palette: {
    primary: {
        50 : '#f0e0e3',
        100 : '#d9b3b9',
        200 : '#c0808a',
        300 : '#a64d5b',
        400 : '#932638',
        500 : '#800015',
        600 : '#780012',
        700 : '#6d000f',
        800 : '#63000c',
        900 : '#500006',
        A100 : '#ff8385',
        A200 : '#ff5053',
        A400 : '#ff1d21',
        A700 : '#ff0308',
    },
    secondary: lightBlue,
    warning: deepOrange
  }
});