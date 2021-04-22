import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';

import AppRouter from './Routes/AppRouter';
import SnackbarMessage from './Snackbar'
const App = () => {
  return (
    <div>
      <CssBaseline />
      <AppRouter />
      <SnackbarMessage />
    </div>
  );
};

export default App;
