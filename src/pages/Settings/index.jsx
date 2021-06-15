import React, { useState, useEffect, useContext, useRef } from 'react';
import clsx from 'clsx';
import { toast, ToastContainer } from 'react-toastify';
import { useTheme } from '@material-ui/core/styles';
import {
  Visibility,
  VisibilityOff,
  Close as CloseIcon
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
  Grid,
  TextField,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';
import { red } from '@material-ui/core/colors';

import api from '../../services/api';
import Menus from '../../components/Menus';
import Copyright from '../../components/Copyright';
import getCookie from '../../utils/functions';
import { Context } from '../../Context/AuthContext';
import useStyles from './styles';

import 'react-toastify/dist/ReactToastify.css';

const initialStateSettings = {
  id: 0,
  cfg1: "",
  cfg2: "",
  cfg3: "",
  cfg4: "",
  cfg5: "",
  cfg6: "",
  cfg7: "",
  cfg8: "",
  cfg9: "",
  cfg10: "",
  cfg11: "",
  cfg12: "",
  cfg13: "",
  cfg14: "",
  cfg15: "",
  cfg16: "",
  cfg17: "",
  cfg18: "",
  cfg19: "",
  cfg20: "",
  cfg21: "",
  cfg22: "",
  cfg23: "",
  cfg24: "",
  cfg25: "",
  cfg26: "",
  cfg27: "",
  cfg28: "",
  cfg29: "",
  cfg30: "",
  cfg31: "",
  cfg32: ""
}

export default function Settings() {
  const classes = useStyles();
  const { handleLogout } = useContext(Context);
  const timer = useRef();
  const theme = useTheme();
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
  const [settings, setSettings] = useState(initialStateSettings);
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [errorSettings, setErrorSettings] = useState(false);
  const [successSettings, setSuccessSettings] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
    [classes.buttonError]: error,
  });

  const buttonClassNameSettings = clsx({
    [classes.buttonSuccess]: successSettings,
    [classes.buttonError]: errorSettings,
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

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/settings');
        setSettings(data);
      } catch (error) {
        const { data } = error.response;
        toast.error(`${data.detail}`);
      }
    })();
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

  function handleButtonSettingsProgress() {
    if (!loadingSettings) {
      setSuccessSettings(false);
      setLoadingSettings(true);
      timer.current = window.setTimeout(() => {
        setSuccessSettings(true);
        setLoadingSettings(false);
      }, 2000);
    }
  };

  function handleButtonSettingsProgressError() {
    if (!loadingSettings) {
      setSuccessSettings(false);
      setLoadingSettings(true);
      timer.current = window.setTimeout(() => {
        setErrorSettings(true);
        setLoadingSettings(false);
      }, 2000);
    }
  }

  function handleChangeInputs(e) {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  }

  const handleClickOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
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

  async function handleUpdateSystemSettings() {
    const csrfToken = getCookie('csrftoken');

    try {
      handleButtonSettingsProgress();

      await api.put('/settings/update/', settings, {
        headers: {
          'X-CSRFToken': csrfToken
        }
      });
      setTimeout(() => {
        toast.success('Configurações alteradas com sucesso!');
        handleCloseModal();
      }, 2000);
    } catch (error) {
      const { data, status } = error.response;
      handleButtonSettingsProgressError();
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
          <Card
            style={{
              marginBottom: theme.spacing(3)
            }}
          >
            <CardHeader
              subheader="Atualize as configurações do sistema."
              title="Configurações do Sistema"
            />
            <Divider />
            <CardContent>
              <Grid
                container
                spacing={3}
                style={{
                  marginBottom: theme.spacing(2)
                }}
              >
                <Grid
                  item
                  xl={4}
                  xs={4}
                  sm={4}
                >
                  <TextField
                    fullWidth
                    label="Site"
                    name="cfg8"
                    required
                    variant="outlined"
                    value={settings.cfg8}
                    onChange={(e) => handleChangeInputs(e)}
                  />
                </Grid>
              </Grid>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  item
                  xl={3}
                  xs={3}
                  sm={3}
                >
                  <TextField
                    fullWidth
                    label="Nome Tabela de Preços 1"
                    name="cfg19"
                    required
                    variant="outlined"
                    value={settings.cfg19}
                    onChange={(e) => handleChangeInputs(e)}
                  />
                </Grid>
                <Grid
                  item
                  xl={3}
                  xs={3}
                  sm={3}
                >
                  <TextField
                    fullWidth
                    label="Nome Tabela de Preços 2"
                    name="cfg20"
                    required
                    variant="outlined"
                    value={settings.cfg20}
                    onChange={(e) => handleChangeInputs(e)}
                  />
                </Grid>
                <Grid
                  item
                  xl={3}
                  xs={3}
                  sm={3}
                >
                  <TextField
                    fullWidth
                    label="Nome Tabela de Preços 3"
                    name="cfg21"
                    required
                    variant="outlined"
                    value={settings.cfg21}
                    onChange={(e) => handleChangeInputs(e)}
                  />
                </Grid>

                <Grid
                  item
                  xl={3}
                  xs={3}
                  sm={3}
                >
                  <TextField
                    fullWidth
                    required
                    label="Percentual Lucro Padrão"
                    name="cfg22"
                    variant="outlined"
                    value={settings.cfg22}
                    onChange={(e) => handleChangeInputs(e)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">%</InputAdornment>,
                    }}
                  />
                </Grid>

                <Grid
                  item
                  xl={3}
                  xs={3}
                  sm={3}
                >
                  <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id="select-option2-label">Opção Tabela 2</InputLabel>
                    <Select
                      fullWidth
                      labelId="select-option2-label"
                      id="select-option2"
                      value={settings.cfg23}
                      onChange={(e) => handleChangeInputs(e)}
                      label="Opção Tabela 2"
                      name="cfg23"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="1">
                        Acréscimo
                      </MenuItem>
                      <MenuItem value="2">
                        Desconto
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xl={3}
                  xs={3}
                  sm={3}
                >
                  <TextField
                    fullWidth
                    required
                    label="Percentual Tab. 2 sobre 1"
                    name="cfg24"
                    variant="outlined"
                    value={settings.cfg24}
                    onChange={(e) => handleChangeInputs(e)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">%</InputAdornment>,
                    }}
                  />
                </Grid>

                <Grid
                  item
                  xl={3}
                  xs={3}
                  sm={3}
                >
                  <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id="select-option3-label">Opção Tabela 3</InputLabel>
                    <Select
                      fullWidth
                      labelId="select-option3-label"
                      id="select-option3"
                      value={settings.cfg25}
                      onChange={(e) => handleChangeInputs(e)}
                      label="Opção Tabela 3"
                      name="cfg25"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="1">
                        Acréscimo
                      </MenuItem>
                      <MenuItem value="2">
                        Desconto
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xl={3}
                  xs={3}
                  sm={3}
                >
                  <TextField
                    fullWidth
                    required
                    label="Percentual Tab. 3 sobre 1"
                    name="cfg26"
                    variant="outlined"
                    value={settings.cfg26}
                    onChange={(e) => handleChangeInputs(e)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">%</InputAdornment>,
                    }}
                  />
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
                onClick={handleClickOpenModal}
              >
                Salvar alterações
                {loadingSettings && <CircularProgress size={24} className={classes.buttonProgress} />}
              </Button>
            </Box>
          </Card>

          <Card>
            <form
              onSubmit={(e) => handleChangePassword(e)}
            >
              <CardHeader
                subheader="Atualize sua senha."
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
            </form>
          </Card>

          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>

        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Atualizar configurações</DialogTitle>
          <IconButton aria-label="close" className={classes.closeButton} onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
          <Divider />
          <DialogContent className={classes.modalContent}>
            <DialogContentText id="alert-dialog-description" className={classes.modalContentText}>
              <p>Você deseja realmente atualizar as configurações do sistema? Esta operação não pode ser desfeita.</p>
            </DialogContentText>
          </DialogContent>
          <Divider />
          <DialogActions>
            <Button
              onClick={() => handleUpdateSystemSettings()}
              color="primary"
              className={buttonClassNameSettings}
              disabled={loadingSettings}
              variant="contained"
            >
              Sim
              {loadingSettings && <CircularProgress size={24} className={classes.buttonProgress} />}
            </Button>
            <Button onClick={handleCloseModal} color="secondary" variant="contained" autoFocus>
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>
      </main>
    </div>
  );
}
