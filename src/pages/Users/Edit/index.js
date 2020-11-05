import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import {
  Box, Container, CssBaseline, Card, CardContent, IconButton, Grid, TextField, List, ListItem, ListItemText, Divider,
  ListItemSecondaryAction, Checkbox, Button, Select, MenuItem, InputLabel, FormControl
} from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';

import Menus from '../../../components/Menus';
import Copyright from '../../../components/Copyright';
import api from '../../../services/api';
import getCookie from '../../../utils/functions';

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
  cardContent: {
    marginTop: theme.spacing(3)
  },
  avatarLarge: {
    width: theme.spacing(10),
    height: theme.spacing(10)
  }
}));

export default function EditUser(props) {
  const classes = useStyles();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [access, setAccess] = useState([]);
  const [dateJoined, setDateJoined] = useState('');
  const [email, setEmail] = useState('');
  const [group, setGroup] = useState(0);
  const [idPescod, setIdPescod] = useState(0);
  const [userGroups, setUserGroups] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);
  const [nameGroup, setNameGroup] = useState('');
  const [persons, setPersons] = useState([]);

  const idUser = props.match.params.id;
  const csrfToken = getCookie('csrftoken');

  useEffect(() => {
    api.get(`/users/users/${idUser}`, {
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
      setIdPescod(response.data.idpescod_id);
    }).catch(reject => {
      console.log(reject);
    });
  }, [idUser]);

  useEffect(() => {
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
    });
  }, [userGroups]);

  useEffect(() => {
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

  useEffect(() => {
    api.get('/persons/', {
      headers: {
        'X-CSRFToken': csrfToken
      }
    }).then(response => {
      setPersons(response.data);
    }).catch(reject => {
      console.log(reject);
    });
  }, []);

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
                      onChange={(e) => setGroup(e.target.value)}
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
                            {
                              access[permission.id] === '1' ? (
                                <Checkbox
                                  edge="end"
                                  checked
                                  disabled
                                  tabIndex={-1}
                                  disableRipple
                                />
                              ) : (
                                  <Checkbox
                                    edge="end"
                                    disabled
                                    tabIndex={-1}
                                    disableRipple
                                  />
                                )
                            }
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
                    >
                      Salvar alterações
                    </Button>
                  </Box>

                </Grid>
              </Grid>
            </CardContent>
          </Card>

        </Container>
        <Box pt={4}>
          <Copyright />
        </Box>
      </main>
    </div>
  );
}
