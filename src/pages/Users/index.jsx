import React from 'react';
import { ToastContainer } from 'react-toastify';
import {
  CssBaseline,
  Box,
  Container
} from '@material-ui/core';

import PageHeader from './PageHeader';
import EnhancedTable from './Content';
import Menus from '../../components/Menus';
import Copyright from '../../components/Copyright';
import useStyles from './styles';

import 'react-toastify/dist/ReactToastify.css';

export default function Users() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ToastContainer />
      <CssBaseline />
      <Menus title="Usuários" />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container className={classes.container} maxWidth="lg">
          <PageHeader />

          <EnhancedTable />
        </Container>
        <Box pt={4}>
          <Copyright />
        </Box>
      </main>
    </div>
  );
}
