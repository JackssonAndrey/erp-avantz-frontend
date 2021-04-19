import React, { useEffect, useState, useRef, useContext } from 'react';
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
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
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
import { Context } from '../../../Context/AuthContext';

import 'react-toastify/dist/ReactToastify.css';
import history from '../../../services/history';

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
  acess: '',
  date_joined: ''
};

export default function Users(props) {
  const classes = useStyles();
  const timer = useRef();
  const { handleLogout } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [defaultButton, setDefaultButton] = useState(false);
  const [loadingDisableUser, setLoadingDisableUser] = useState(false);
  const [successDisableUser, setSuccessDisableUser] = useState(false);
  const [errorDisableUser, setErrorDisableUser] = useState(false);
  const [defaultButtonDisableUser, setDefaultButtonDisableUser] = useState(false);
  const [userData, setUserData] = useState(initialStateUser);

  const [access, setAccess] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);
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
    (async () => {
      try {
        const csrfToken = getCookie('csrftoken');
        const { data } = await api.get(`/users/details/${idUser}`, {
          headers: {
            'X-CSRFToken': csrfToken
          }
        });
        setUserData(data);
        setAccess(data.acess.split(''));
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

  function changeInputsUser(e) {
    const { value, name } = e.target;
    setUserData({ ...userData, [name]: value });
  }

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
                    disabled
                    label="Segundo nome"
                    name="last_name"
                    variant="outlined"
                    value={userData.last_name}
                    onChange={(e) => changeInputsUser(e)}
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
                    value={userData.email}
                    onChange={(e) => changeInputsUser(e)}
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
                  <TextField
                    fullWidth
                    disabled
                    label="Data de criação"
                    name="date_joined"
                    variant="outlined"
                    value={moment(userData.date_joined).format('DD/MM/YYYY')}
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
                    disabled
                    label="Usuário ativo"
                    name="is_active"
                    variant="outlined"
                    value={userData.is_active === true ? 'Sim' : 'Não'}
                    onChange={(e) => changeInputsUser(e)}
                  />
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
                    disabled
                  >
                    <InputLabel id="user-group-select" >Grupo</InputLabel>
                    <Select
                      labelId="user-group-select"
                      id="user-group"
                      value={userData.idgrp_id}
                      onChange={(e) => changeInputsUser(e)}
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
                        <ListItem key={permission.id} role={undefined} dense button>
                          <ListItemText primary={permission.descr} />
                          <ListItemSecondaryAction>
                            <Checkbox
                              edge="end"
                              disabled
                              checked={access[permission.posicao_rotina - 1] === '1' ? true : false}
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
