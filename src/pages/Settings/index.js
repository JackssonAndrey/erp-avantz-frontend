import React, { useState, useEffect, useContext, useRef } from 'react';
import clsx from 'clsx';
import { toast, ToastContainer } from 'react-toastify';
import CssBaseline from '@material-ui/core/CssBaseline';
import SaveIcon from '@material-ui/icons/Save';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Container,
  makeStyles
} from '@material-ui/core';

import api from '../../services/api';
import Menus from '../../components/Menus';
import Copyright from '../../components/Copyright';
import getCookie from '../../utils/functions';
import { Context } from '../../Context/AuthContext';

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
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default function Settings() {
  const classes = useStyles();
  const { handleLogout } = useContext(Context);
  const timer = useRef();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  useEffect(() => {
    async function getUser() {
      try {
        await api.get('/users/profile');
      } catch (error) {
        const { data } = error.response;
        toast.error(`${data.detail}`);
        setTimeout(() => {
          handleLogout();
        }, 5000);
      }
    }
    getUser();
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const handleButtonClickProgress = () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      timer.current = window.setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 2000);
    }
  };

  async function handleChangePassword(e) {
    e.preventDefault();

    const csrfToken = getCookie('csrftoken');

    try {
      await api.put('/users/change_password/', {
        old_password: oldPassword,
        new_password: newPassword
      }, {
        headers: {
          'X-CSRFToken': csrfToken
        }
      });

      handleButtonClickProgress();
      setTimeout(() => {
        setNewPassword('');
        setOldPassword('');
        toast.success('Senha alterada com sucesso!');
      }, 2000);
    } catch (error) {
      const { data, status } = error.response;
      toast.error(`${data.detail}`);
      if (status === 403) {
        handleLogout();
      }
    }
  }

  return (
    <div className={classes.root}>
      <ToastContainer />
      <CssBaseline />
      <Menus title="Configurações" />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container className={classes.container} maxWidth="lg">
          <form
            onSubmit={(e) => handleChangePassword(e)}
          >
            <Card>
              <CardHeader
                subheader="Atualize sua senha"
                title="Senha"
              />
              <Divider />
              <CardContent>
                <TextField
                  fullWidth
                  label="Senha antiga"
                  margin="normal"
                  name="password"
                  onChange={(e) => setOldPassword(e.target.value)}
                  type="password"
                  value={oldPassword}
                  variant="outlined"
                  required
                />
                <TextField
                  fullWidth
                  label="Nova senha"
                  margin="normal"
                  name="confirm"
                  onChange={(e) => setNewPassword(e.target.value)}
                  type="password"
                  value={newPassword}
                  variant="outlined"
                  required
                />
              </CardContent>
              <Divider />
              <Box
                display="flex"
                justifyContent="flex-end"
                p={2}
              >
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  className={buttonClassname}
                  disabled={loading}
                  startIcon={<SaveIcon />}
                >
                  Salvar alterações
                  {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                </Button>
              </Box>
            </Card>
          </form>

          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
}
