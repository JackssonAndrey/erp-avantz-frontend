import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import api from '../../services/api';
import Menus from '../../components/Menus';
import Copyright from '../../components/Copyright';

import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  rootForm: {},
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    alignItems: 'center'
  },
  input: {
    display: 'none',
  },
  large: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    marginBottom: theme.spacing(4)
  },
  form: {
    width: '100%',
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center'
  }
}));

export default function Settings() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <ToastContainer />
      <CssBaseline />
      <Menus title="Configurações" />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container className={classes.container} maxWidth="lg">


          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
}
