import { deepOrange } from "@mui/material/colors";
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
    secondary: {
        50 : '#e8f0f8',
        100 : '#c5daee',
        200 : '#9ec2e3',
        300 : '#77aad7',
        400 : '#5a97cf',
        500 : '#3d85c6',
        600 : '#377dc0',
        700 : '#2f72b9',
        800 : '#2768b1',
        900 : '#1a55a4',
        A100 : '#dae9ff',
        A200 : '#a7caff',
        A400 : '#74abff',
        A700 : '#5b9cff',
    },
    warning: deepOrange
  }
});