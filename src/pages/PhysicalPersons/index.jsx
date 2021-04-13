import React from 'react';
import { ToastContainer } from 'react-toastify';
import {
  CssBaseline,
  Box,
  Container
} from '@material-ui/core';

import EnhancedTable from './ContentTable';
import Menus from '../../components/Menus';
import Copyright from '../../components/Copyright';
import useStyles from './styles/styles';

import 'react-toastify/dist/ReactToastify.css';

export default function LegalPersons() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ToastContainer />
      <CssBaseline />
      <Menus title="Pessoas Físicas" />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container className={classes.container} maxWidth="lg">
          {/* <PageHeader /> */}

          <EnhancedTable />
        </Container>
        <Box pt={4}>
          <Copyright />
        </Box>
      </main>
    </div>
  );
}
