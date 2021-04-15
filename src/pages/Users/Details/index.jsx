import React, { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { orange, red } from '@material-ui/core/colors';
import {
  Box,
  Container,
  CssBaseline,
  Card,
  CardContent,
  IconButton,
  Grid,
  TextField,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemSecondaryAction,
  Checkbox,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  DialogActions,
  CircularProgress
} from '@material-ui/core';
import {
  ArrowBack,
  Edit,
  Delete as DeleteIcon,
  DeleteForever as DeleteForeverIcon,
  Close as CloseIcon
} from '@material-ui/icons';
import moment from 'moment';

import Menus from '../../../components/Menus';
import Copyright from '../../../components/Copyright';
import api from '../../../services/api';
import getCookie from '../../../utils/functions';
import useStyles from './styles';

import 'react-toastify/dist/ReactToastify.css';
import history from '../../../services/history';

export default function Users(props) {
  const classes = useStyles();
  const timer = useRef();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [defaultButton, setDefaultButton] = useState(false);
  const [loadingDisableUser, setLoadingDisableUser] = useState(false);
  const [successDisableUser, setSuccessDisableUser] = useState(false);
  const [errorDisableUser, setErrorDisableUser] = useState(false);
  const [defaultButtonDisableUser, setDefaultButtonDisableUser] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [access, setAccess] = useState([]);
  const [dateJoined, setDateJoined] = useState('');
  const [email, setEmail] = useState('');
  const [group, setGroup] = useState('');
  const [isActive, setIsActive] = useState('');
  const [userGroups, setUserGroups] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);
  const [nameGroup, setNameGroup] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const idUser = props.match.params.id;

  const buttonClassNameDisableUser = clsx({
    [classes.buttonSuccess]: successDisableUser,
    [classes.buttonError]: errorDisableUser,
    [classes.buttonDefault]: defaultButtonDisableUser
  });

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
    [classes.buttonError]: error,
    [classes.buttonDefault]: defaultButton
  });

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


  useEffect(() => {
    const csrfToken = getCookie('csrftoken');
    api.get(`/users/details/${idUser}`, {
      headers: {
        'X-CSRFToken': csrfToken
      }
    }).then(response => {
      setFirstName(response.data.first_name);
      setLastName(response.data.last_name);
      setUsername(response.data.username);
      setAccess(response.data.acess.split(''));
      setDateJoined(response.data.date_joined);
      setEmail(response.data.email);
      setGroup(response.data.idgrp_id);
      setIsActive(response.data.is_active);
    }).catch(reject => {
      console.log(reject);
    });
  }, [idUser]);

  useEffect(() => {
    const csrfToken = getCookie('csrftoken');
    api.get('/groups/', {
      headers: {
        'X-CSRFToken': csrfToken
      }
    }).then(response => {
      setUserGroups(response.data);
    }).catch(reject => {
      console.log(reject);
    });
  }, []);

  useEffect(() => {
    userGroups.map(userGroup => {
      if (userGroup.id_grupo === group) {
        setNameGroup(userGroup.grupo);
      }
      return true;
    });
  }, [userGroups, group]);

  useEffect(() => {
    const csrfToken = getCookie('csrftoken');
    api.get('/permissions/', {
      headers: {
        'X-CSRFToken': csrfToken
      }
    }).then(response => {
      setUserPermissions(response.data);
    }).catch(reject => {
      console.log(reject);
    });
  }, []);

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

  return (
    <div className={classes.root}>
      <ToastContainer />
      <CssBaseline />
      <Menus title="Detalhes do usuário" />
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

                <Link to={`/users/edit/${idUser}`} className="link" >
                  <IconButton>
                    <Edit style={{ color: orange[300] }} />
                  </IconButton>
                </Link>

                <Tooltip title="Deletar">
                  <IconButton onClick={() => handleClickOpenModal(idUser)} aria-label="Deletar">
                    <DeleteIcon size={8} style={{ color: red[300] }} />
                  </IconButton>
                </Tooltip>
              </Box>
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
                    <Avatar className={classes.avatarLarge} />
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={6}
                  sm={6}
                  xl={6}
                >
                  <TextField
                    fullWidth
                    disabled
                    label="Primeiro nome"
                    name="firstName"
                    variant="outlined"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
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
                    disabled
                    label="Segundo nome"
                    name="lastName"
                    variant="outlined"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Grid>

                <Grid
                  item
                  xs={8}
                  sm={8}
                  xl={8}
                >
                  <TextField
                    fullWidth
                    disabled
                    label="E-mail"
                    name="email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Grid>

                <Grid
                  item
                  xs={4}
                  sm={4}
                  xl={4}
                >
                  <TextField
                    fullWidth
                    disabled
                    label="Username"
                    name="username"
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                    disabled
                    label="Data de criação"
                    name="dateJoined"
                    variant="outlined"
                    value={moment(dateJoined).format('DD/MM/YYYY')}
                    onChange={(e) => setDateJoined(e.target.value)}
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
                    disabled
                    label="Usuário ativo"
                    name="isActive"
                    variant="outlined"
                    value={isActive === true ? 'Sim' : 'Não'}
                    onChange={(e) => setIsActive(e.target.value)}
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
                    disabled
                    label="Grupo"
                    name="groups"
                    variant="outlined"
                    value={nameGroup}
                    onChange={(e) => setNameGroup(e.target.value)}
                  />
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
                        <ListItem key={permission.id} role={undefined} dense button>
                          <ListItemText primary={permission.descr} />
                          <ListItemSecondaryAction>
                            <Checkbox
                              edge="end"
                              disabled
                              checked={access[permission.id - 1] === '1' ? true : false}
                              tabIndex={-1}
                              disableRipple
                              color="primary"
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

        </Container>
        <Box pt={4}>
          <Copyright />
        </Box>

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
      </main>
    </div>
  );
}
