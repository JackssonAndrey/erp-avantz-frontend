import React, { useEffect, useState, useContext, useRef } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
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
  CircularProgress
} from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';

import Menus from '../../../components/Menus';
import Copyright from '../../../components/Copyright';
import api from '../../../services/api';
import getCookie from '../../../utils/functions';
import { Context } from '../../../Context/AuthContext';
import CSRFToken from '../../../Context/CSRFToken';
import useStyles from './styles';

import 'react-toastify/dist/ReactToastify.css';

export default function EditUser(props) {
  const classes = useStyles();
  const { handleLogout } = useContext(Context);
  const timer = useRef();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [access, setAccess] = useState([]);
  const [email, setEmail] = useState('');
  const [group, setGroup] = useState(0);
  const [idPescod, setIdPescod] = useState(0);
  const [userGroups, setUserGroups] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);
  const [persons, setPersons] = useState([]);

  const idUser = props.match.params.id;
  const csrfToken = getCookie('csrftoken');

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
    [classes.buttonError]: error,
  });

  useEffect(() => {
    api.get(`/users/details/${idUser}`, {
      headers: {
        'X-CSRFToken': csrfToken
      }
    }).then(response => {
      setFirstName(response.data.first_name);
      setLastName(response.data.last_name);
      setUsername(response.data.username);
      setAccess(response.data.acess.split(''));
      setEmail(response.data.email);
      setGroup(response.data.idgrp_id);
      setIdPescod(response.data.idpescod_id);
    }).catch(reject => {
      const { data } = reject.response;
      toast.error(`${data.detail}`);
      setTimeout(() => {
        handleLogout();
      }, 5000);
      console.log(data);
    });
  }, [idUser, csrfToken, handleLogout]);

  useEffect(() => {
    api.get('/groups/', {
      headers: {
        'X-CSRFToken': csrfToken
      }
    }).then(response => {
      setUserGroups(response.data);
    }).catch(reject => {
      const { data } = reject.response;
      toast.error(`${data.detail}`);
      setTimeout(() => {
        handleLogout();
      }, 5000);
      console.log(data);
    });
  }, [csrfToken, handleLogout]);

  useEffect(() => {
    api.get('/permissions/', {
      headers: {
        'X-CSRFToken': csrfToken
      }
    }).then(response => {
      setUserPermissions(response.data);
    }).catch(reject => {
      const { data } = reject.response;
      toast.error(`${data.detail}`);
      setTimeout(() => {
        handleLogout();
      }, 5000);
      console.log(data);
    });
  }, [csrfToken, handleLogout]);

  useEffect(() => {
    api.get('/persons/', {
      headers: {
        'X-CSRFToken': csrfToken
      }
    }).then(response => {
      setPersons(response.data);
    }).catch(reject => {
      const { data } = reject.response;
      toast.error(`${data.detail}`);
      setTimeout(() => {
        handleLogout();
      }, 5000);
      console.log(data);
    });
  }, [csrfToken, handleLogout]);

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  function handleFormatAccessUserArrayToString() {
    let elements = document.getElementById("form-edit").elements;
    let newArrayAccess = [];

    for (let i = 0; i < elements.length; i++) {
      let element = elements[i];
      if (element.type === "checkbox") {
        let position = element.name;
        if (element.checked === true) {
          newArrayAccess[position] = 1;
        } else {
          newArrayAccess[position] = 0;
        }
      }
    }
    let accessFormated = newArrayAccess.join('').toString();
    return accessFormated;
  }

  function handleEditUser(e) {
    e.preventDefault();
    const accessFormated = handleFormatAccessUserArrayToString();

    let data = {
      "username": username,
      "email": email,
      "firstName": firstName,
      "lastName": lastName,
      "idGroupUser": group,
      "idPerson": idPescod,
      "access": accessFormated
    };

    api.post(`/users/admin_edit/${idUser}`, data, {
      headers: {
        'X-CSRFToken': csrfToken
      }
    }).then(response => {
      handleButtonClickProgress();
      setTimeout(() => {
        toast.success('Dados alterados com sucesso!');
      }, 2000);
    }).catch(reject => {
      const { data } = reject.response;
      handleButtonClickProgressError();
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
    });

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
    setGroup(value);

    let userAccess = userGroups.filter(userGroup => {
      return userGroup.id_grupo === group;
    });
    if (userAccess.length > 0) {
      let userAccessArray = userAccess[0].acess.split('');
      setAccess(userAccessArray);
    }
  }

  const handleToggle = (value) => () => {
    if (access[value] === '1') {
      access.splice(value, 1, '0');
      let newArray = [...access];
      setAccess(newArray);
    } else {
      access.splice(value, 1, '1');
      let newArray = [...access];
      setAccess(newArray);
    }
  };

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
              </Box>
            </CardContent>
          </Card>
          <form
            autoComplete="off"
            id="form-edit"
            onSubmit={(e) => handleEditUser(e)}
          >
            <CSRFToken />
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
                      required
                      label="Username"
                      name="username"
                      variant="outlined"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
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
                    >
                      <InputLabel id="register-person-select" >Registro de pessoa</InputLabel>
                      <Select
                        labelId="register-person-select"
                        id="register-person"
                        value={idPescod || ''}
                        onChange={(e) => setIdPescod(e.target.value)}
                        label="Registro de pessoa"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {persons.map((person, index) => (
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
                        value={group || ''}
                        onChange={(e) => handleChangeGroup(e.target.value)}
                        label="Grupo"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {userGroups.map((userGroup, index) => (
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
                                name={`${permission.id - 1}`}
                                checked={access[permission.id - 1] === '1' ? true : false}
                                tabIndex={-1}
                                disableRipple
                                color="primary"
                                onClick={handleToggle(permission.id - 1)}
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
                    <Divider style={{ marginTop: '20px', marginBottom: '20px' }} />
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
        <Box pt={4}>
          <Copyright />
        </Box>
      </main>
    </div>
  );
}