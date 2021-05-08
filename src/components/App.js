import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import deepOrange from '@material-ui/core/colors/deepOrange';
import blue from '@material-ui/core/colors/blue';

import AppRouter from './Routes/AppRouter';
import SnackbarMessage from './Snackbar'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: deepOrange[500],
    },
    secondary: {
      main: blue['A200'],
    },
  },
});


const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRouter />
      <SnackbarMessage />
    </ThemeProvider>

  );
};

export default App;
