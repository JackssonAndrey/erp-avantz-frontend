import React, { useEffect, useState, useContext, useRef } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { red } from '@material-ui/core/colors';
import {
  Box,
  Container,
  CssBaseline,
  Card,
  CardContent,
  IconButton,
  Grid,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemSecondaryAction,
  Checkbox,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@material-ui/core';
import {
  ArrowBack,
  Info as InfoIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  DeleteForever as DeleteForeverIcon
} from '@material-ui/icons';

import Menus from '../../../components/Menus';
import Copyright from '../../../components/Copyright';
import api from '../../../services/api';
import getCookie from '../../../utils/functions';
import { Context } from '../../../Context/AuthContext';
import useStyles from './styles';

import 'react-toastify/dist/ReactToastify.css';
import history from '../../../services/history';
import { useCallback } from 'react';

const initialStateUser = {
  id: '',
  username: '',
  password: '',
  first_name: '',
  last_name: '',
  email: '',
  idpescod_id: 0,
  instit_id: '',
  idgrp_id: 0,
  active: 1,
  is_active: true,
  acess: ''
};

export default function EditUser(props) {
  const classes = useStyles();
  const { handleLogout } = useContext(Context);
  const timer = useRef();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [userData, setUserData] = useState(initialStateUser);
  const [openModal, setOpenModal] = useState(false);

  const [loadingDisableUser, setLoadingDisableUser] = useState(false);
  const [successDisableUser, setSuccessDisableUser] = useState(false);
  const [errorDisableUser, setErrorDisableUser] = useState(false);
  const [defaultButtonDisableUser, setDefaultButtonDisableUser] = useState(false);

  const [access, setAccess] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);
  const [persons, setPersons] = useState([]);

  const idUser = props.match.params.id;
  const csrfToken = getCookie('csrftoken');
  const [userLoggedPermissions, setUserLoggedPermissions] = useState([]);


  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
    [classes.buttonError]: error,
  });

  const buttonClassNameDisableUser = clsx({
    [classes.buttonSuccess]: successDisableUser,
    [classes.buttonError]: errorDisableUser,
    [classes.buttonDefault]: defaultButtonDisableUser
  });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/users/details/${idUser}`, {
          headers: {
            'X-CSRFToken': csrfToken
          }
        });
        setUserData(data);
        changeSizePermissionArray(data.acess.split(''));
      } catch (err) {
        const { data, status } = err.response;
        toast.error(`${data.detail}`);
        if (status === 401) {
          setTimeout(() => {
            handleLogout();
          }, 3500);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idUser, csrfToken, handleLogout]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/groups/', {
          headers: {
            'X-CSRFToken': csrfToken
          }
        });
        setUserGroups(data);
      } catch (err) {
        const { data, status } = err.response;
        toast.error(`${data.detail}`);
        if (status === 401) {
          setTimeout(() => {
            handleLogout();
          }, 3500);
        }
        console.log(data);
      }
    })();
  }, [csrfToken, handleLogout]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/permissions/', {
          headers: {
            'X-CSRFToken': csrfToken
          }
        });
        setUserPermissions(data);
      } catch (err) {
        const { data, status } = err.response;
        toast.error(`${data.detail}`);
        if (status === 401) {
          setTimeout(() => {
            handleLogout();
          }, 5000);
        }
      }
    })();
  }, [csrfToken, handleLogout]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/persons/', {
          headers: {
            'X-CSRFToken': csrfToken
          }
        });
        setPersons(data);
      } catch (err) {
        const { data } = err.response;
        toast.error(`${data.detail}`);
        console.error(data);
      }
    })();
  }, [csrfToken, handleLogout]);

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/users/access');
        setUserLoggedPermissions(data.acess.split(''));
      } catch (err) {
        const { data } = err.response;
        toast.error(data.detail);
      }
    })();
  }, []);

  function changeInputsUser(e) {
    const { value, name } = e.target;
    setUserData({ ...userData, [name]: value });
  }

  function handleFormatAccessUserArrayToString() {
    let accessFormated = access.join('').toString();

    return accessFormated;
  }

  async function handleEditUser(e) {
    e.preventDefault();
    const accessFormated = handleFormatAccessUserArrayToString();

    const data = {
      username: userData.username,
      firstName: userData.first_name,
      lastName: userData.last_name,
      email: userData.email,
      access: accessFormated,
      idGroupUser: userData.idgrp_id,
      idPerson: userData.idpescod_id
    }

    try {
      await api.put(`/users/admin_edit/${idUser}`, data, {
        headers: {
          'X-CSRFToken': csrfToken
        }
      });

      handleButtonClickProgress();
      setTimeout(() => {
        toast.success('Dados alterados com sucesso!');
      }, 2000);

      setTimeout(() => {
        history.push(`/users/details/${idUser}`);
      }, 3500);

    } catch (err) {
      const { data } = err.response;
      handleButtonClickProgressError();
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
    }
  }

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

  function handleChangeGroup(value) {
    setUserData({ ...userData, idgrp_id: value });

    userGroups.filter((userGroup) => {
      if (userGroup.id_grupo === value) {
        changeSizePermissionArray(userGroup.acess.split(''));
      }
      return null;
    });
  }

  const handleClickOpenModal = (id) => {
    setOpenModal(true);
  };


  const handleCloseModal = () => {
    setOpenModal(false);
  };


  function handleButtonDisableUserProgressError() {
    if (!loadingDisableUser) {
      setSuccessDisableUser(false);
      setLoadingDisableUser(true);
      timer.current = window.setTimeout(() => {
        setErrorDisableUser(true);
        setLoadingDisableUser(false);
      }, 2000);
    }
  }

  function handleButtonDisableUserProgress() {
    if (!loadingDisableUser) {
      setSuccessDisableUser(false);
      setLoadingDisableUser(true);
      timer.current = window.setTimeout(() => {
        setSuccessDisableUser(true);
        setLoadingDisableUser(false);
      }, 2000);
    }
  };

  const handleToggle = (value) => () => {
    const indexExists = access.find((element, index) => {
      return index === value;
    });

    if (indexExists !== undefined) {
      if (access[value] === '1') {
        access.splice(value, 1, '0');
        let newArray = [...access];
        setAccess(newArray);
      } else {
        access.splice(value, 1, '1');
        let newArray = [...access];
        setAccess(newArray);
      }
    } else {
      const newArray = Array.from(access);
      newArray.push('0');
      setAccess(newArray);
    }

  };

  async function handleDisableUser(id) {
    const csrftoken = getCookie('csrftoken');

    try {
      await api.put(`/users/disable/${id}`, { idUser }, {
        headers: {
          'X-CSRFToken': csrftoken
        }
      });
      handleButtonDisableUserProgress();
      setTimeout(() => {
        toast.success('Usuário desabilitado com sucesso!');
      }, 2000);
      setTimeout(() => {
        handleCloseModal();
        setDefaultButtonDisableUser(true);
      }, 3500);
      setTimeout(() => {
        history.push('/users');
      }, 3800);
    } catch (err) {
      const { data } = err.response;
      handleButtonDisableUserProgressError();
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
    }
  }

  async function handleDeleteUser(id) {
    const csrftoken = getCookie('csrftoken');

    try {
      await api.put(`/users/delete/${id}`, { idUser }, {
        headers: {
          'X-CSRFToken': csrftoken
        }
      });
      handleButtonClickProgress();
      setTimeout(() => {
        toast.success('Usuário deletado com sucesso!');
      }, 2000);
      setTimeout(() => {
        handleCloseModal();
      }, 3500);
      setTimeout(() => {
        history.push('/users');
      }, 3800);
    } catch (err) {
      const { data } = err.response;
      handleButtonClickProgressError();
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
    }
  }

  /*
    Method for changing the size of the group's access array. Leaves the same size as the permissions array.

    Avoids errors in rendering group permissions.
  */
  const changeSizePermissionArray = useCallback((arrayForChange) => {
    if (arrayForChange.length <= userPermissions.length) {
      while (arrayForChange.length <= userPermissions.length + 2) {
        arrayForChange.push('0');
      }
    }
    setAccess(arrayForChange);
  }, [userPermissions]);

  return (
    <div className={classes.root}>
      <ToastContainer />
      <CssBaseline />
      <Menus title="Editar usuário" />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container className={classes.container} maxWidth="lg">
          <Card>
            <CardContent>
              <Box
                maxWidth={600}
                display="flex"
                justifyContent="flex-start"
              >
                <Link to="/users" className="link">
                  <IconButton>
                    <ArrowBack />
                  </IconButton>
                </Link>

                {
                  userLoggedPermissions[132] === '1' && (
                    <Tooltip title="Deletar" arrow>
                      <IconButton onClick={() => handleClickOpenModal(idUser)} aria-label="Deletar">
                        <DeleteIcon size={8} style={{ color: red[300] }} />
                      </IconButton>
                    </Tooltip>
                  )
                }

              </Box>
            </CardContent>
          </Card>
          <form
            autoComplete="off"
            id="form-edit"
            onSubmit={(e) => handleEditUser(e)}
          >
            <Card className={classes.cardContent}>
              <CardContent>
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    item
                    xs={6}
                    sm={6}
                    xl={6}
                  >
                    <TextField
                      fullWidth
                      required
                      label="Primeiro nome"
                      name="first_name"
                      variant="outlined"
                      value={userData.first_name}
                      onChange={(e) => changeInputsUser(e)}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={6}
                    sm={6}
                    xl={6}
                  >
                    <TextField
                      fullWidth
                      label="Segundo nome"
                      name="last_name"
                      variant="outlined"
                      value={userData.last_name}
                      onChange={(e) => changeInputsUser(e)}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={6}
                    sm={6}
                    xl={6}
                  >
                    <TextField
                      fullWidth
                      label="E-mail"
                      name="email"
                      variant="outlined"
                      value={userData.email}
                      onChange={(e) => changeInputsUser(e)}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={3}
                    sm={3}
                    xl={3}
                  >
                    <TextField
                      fullWidth
                      required
                      label="Username"
                      name="username"
                      variant="outlined"
                      value={userData.username}
                      onChange={(e) => changeInputsUser(e)}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={3}
                    sm={3}
                    xl={3}
                  >
                    <FormControl
                      variant="outlined"
                      fullWidth
                      required
                    >
                      <InputLabel id="isactive-select" >Usuário ativo</InputLabel>
                      <Select
                        labelId="isactive-select"
                        id="is_active"
                        value={userData.is_active}
                        onChange={(e) => changeInputsUser(e)}
                        label="Usuário ativo"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={true}>
                          Sim
                        </MenuItem>
                        <MenuItem value={false}>
                          Não
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    xs={6}
                    sm={6}
                    xl={6}
                  >
                    <FormControl
                      variant="outlined"
                      fullWidth
                      required
                    >
                      <InputLabel id="register-person-select" >Registro de pessoa</InputLabel>
                      <Select
                        labelId="register-person-select"
                        id="register-person"
                        value={userData.idpescod_id}
                        onChange={(e) => changeInputsUser(e)}
                        label="Registro de pessoa"
                        name="idpescod_id"
                      >
                        <MenuItem value={0}>
                          <em>None</em>
                        </MenuItem>
                        {persons && persons.map((person, index) => (
                          <MenuItem value={person.id_pessoa_cod} key={index} >{person.nomeorrazaosocial}</MenuItem>
                        ))}

                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    xs={6}
                    sm={6}
                    xl={6}
                  >
                    <FormControl
                      variant="outlined"
                      fullWidth
                      required
                    >
                      <InputLabel id="user-group-select" >Grupo</InputLabel>
                      <Select
                        labelId="user-group-select"
                        id="user-group"
                        value={userData.idgrp_id}
                        onChange={(e) => handleChangeGroup(e.target.value)}
                        label="Grupo"
                        name="idgrp_id"
                      >
                        <MenuItem value={0}>
                          <em>None</em>
                        </MenuItem>
                        {userGroups && userGroups.map((userGroup, index) => (
                          <MenuItem value={userGroup.id_grupo} key={index} >{userGroup.grupo}</MenuItem>
                        ))}

                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card className={classes.cardContent}>
              <CardContent>
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    xl={12}
                  >
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <List >
                        <h2>Permissões do usuário</h2>
                        <Divider />
                        {userPermissions.map(permission => (
                          <ListItem
                            key={permission.id}
                            role={undefined}
                            dense
                            button
                            divider
                          >
                            <ListItemText primary={permission.descr} />
                            <ListItemSecondaryAction>
                              <Checkbox
                                edge="end"
                                name={`${permission.posicao_rotina}`}
                                checked={access[permission.posicao_rotina - 1] === '1' ? true : false}
                                tabIndex={-1}
                                disableRipple
                                color="primary"
                                onClick={handleToggle(permission.posicao_rotina - 1)}
                              />
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={12}
                    xl={12}
                  >
                    <Box
                      display="flex"
                      justifyContent="flex-start"
                    >
                      <p className={classes.textInfo}>
                        <InfoIcon size={8} color="disabled" style={{ marginRight: '5px' }} /> Revise todoas as permissões antes de salvar as alterações.
                      </p>
                    </Box>
                    <Divider style={{ marginBottom: '20px' }} />
                    <Box
                      display="flex"
                      justifyContent="flex-start"
                    >
                      <Button
                        color="primary"
                        variant="contained"
                        type="submit"
                        className={buttonClassname}
                        disabled={loading}
                      >
                        Salvar alterações
                        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                      </Button>
                    </Box>

                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </form>
        </Container>
        {/* DELETE USER MODAL */}
        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Deletar usuário
            <IconButton aria-label="close" className={classes.closeButton} onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent className={classes.modalContent} dividers>
            <div className={classes.divIconModal}>
              <DeleteForeverIcon className={classes.modalIcon} />
            </div>
            <DialogContentText variant="h6" id="alert-dialog-description" className={classes.modalContentText}>
              Você realmente deseja deletar este usuário? Esta operação não pode ser desfeita.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => handleDisableUser(idUser)}
              color="primary"
              className={buttonClassNameDisableUser}
              disabled={loadingDisableUser}
              variant="contained"
            >
              Apenas desativar
              {loadingDisableUser && <CircularProgress size={24} className={classes.buttonProgress} />}
            </Button>

            <Button
              onClick={() => handleDeleteUser(idUser)}
              color="secondary"
              className={buttonClassname}
              disabled={loading}
              variant="contained"
            >
              Deletar
              {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </Button>

            <Button onClick={handleCloseModal} color="primary" variant="outlined" autoFocus>
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>
        <Box pt={4}>
          <Copyright />
        </Box>
      </main>
    </div>
  );
}
