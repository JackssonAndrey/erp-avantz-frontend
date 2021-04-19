import React, { useState, useEffect, useContext, useRef } from 'react';
import clsx from 'clsx';
import { toast, ToastContainer } from 'react-toastify';
import {
  Visibility,
  VisibilityOff
} from '@material-ui/icons';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Container,
  CssBaseline,
  CircularProgress,
  FormHelperText,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Grid
} from '@material-ui/core';
import { red } from '@material-ui/core/colors';

import api from '../../services/api';
import Menus from '../../components/Menus';
import Copyright from '../../components/Copyright';
import getCookie from '../../utils/functions';
import { Context } from '../../Context/AuthContext';
import useStyles from './styles';

import 'react-toastify/dist/ReactToastify.css';

export default function Settings() {
  const classes = useStyles();
  const { handleLogout } = useContext(Context);
  const timer = useRef();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [passwordNotIsEquals, setPasswordNotIsEquals] = useState(false);

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
    [classes.buttonError]: error,
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
  }, [handleLogout]);

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  function handleClickShowPassword() {
    setShowPassword(!showPassword);
  }

  function handleClickShowPasswordConfirmation() {
    setShowPasswordConfirmation(!showPasswordConfirmation);
  }

  function handleClickShowOldPassword() {
    setShowOldPassword(!showOldPassword);
  }

  function verificationPassword() {
    if (newPassword !== passwordConfirmation) {
      setPasswordNotIsEquals(true);
    } else {
      setPasswordNotIsEquals(false);
    }
  }

  function handleButtonClickProgress() {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      timer.current = window.setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 2000);
    }
  };

  function handleButtonClickProgressError() {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      timer.current = window.setTimeout(() => {
        setError(true);
        setLoading(false);
      }, 2000);
    }
  }

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
        setPasswordConfirmation('');
        toast.success('Senha alterada com sucesso!');
      }, 2000);
    } catch (error) {
      const { data, status } = error.response;
      handleButtonClickProgressError();
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
      setTimeout(() => {
        if (status === 401) {
          handleLogout();
        }
      }, 7000);
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
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    item
                    xl={12}
                    xs={12}
                    sm={12}
                  >
                    <FormControl variant="outlined" fullWidth required>
                      <InputLabel htmlFor="outlined-adornment-password">Senha antiga</InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-password"
                        type={showOldPassword ? 'text' : 'password'}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        name="password"
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowOldPassword}
                              edge="end"
                            >
                              {showOldPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        }
                        labelWidth={100}
                      />
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xl={12}
                    xs={12}
                    sm={12}
                  >
                    <FormControl variant="outlined" fullWidth required>
                      <InputLabel htmlFor="new-password">Nova senha</InputLabel>
                      <OutlinedInput
                        id="new-password"
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        name="password"
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              edge="end"
                            >
                              {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        }
                        labelWidth={100}
                      />
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    xl={12}
                    xs={12}
                    sm={12}
                  >
                    <FormControl variant="outlined" fullWidth required>
                      <InputLabel htmlFor="confirm-password">Repita a senha</InputLabel>
                      <OutlinedInput
                        error={passwordNotIsEquals}
                        id="confirm-password"
                        type={showPasswordConfirmation ? 'text' : 'password'}
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        onKeyUp={() => verificationPassword()}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleClickShowPasswordConfirmation}
                              edge="end"
                            >
                              {showPasswordConfirmation ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        }
                        labelWidth={110}
                      />
                      <FormHelperText hidden={!passwordNotIsEquals} style={{ color: red[700] }}>
                        As senhas não são iguais
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
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
                  disabled={oldPassword === '' || newPassword === '' || passwordConfirmation === '' || passwordNotIsEquals ? true : false}
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
