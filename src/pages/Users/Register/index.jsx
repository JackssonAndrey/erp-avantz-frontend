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
  OutlinedInput,
  InputAdornment,
  CircularProgress,
  FormHelperText
} from '@material-ui/core';
import { ArrowBack, Visibility, VisibilityOff } from '@material-ui/icons';

import Menus from '../../../components/Menus';
import Copyright from '../../../components/Copyright';
import api from '../../../services/api';
import history from '../../../services/history';
import getCookie from '../../../utils/functions';
import { Context } from '../../../Context/AuthContext';
import useStyles from './styles';

import 'react-toastify/dist/ReactToastify.css';
import { red } from '@material-ui/core/colors';

const initialStateUser = {
  username: '',
  password: '',
  firstName: '',
  lastName: '',
  email: '',
  idPerson: '',
  idInstitution: '',
  idGroup: '',
  active: 1,
  isAcite: true,
  access: ''
};

export default function RegisterUser() {
  const classes = useStyles();
  const { handleLogout } = useContext(Context);
  const timer = useRef();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [userData, setUserData] = useState(initialStateUser);
  const [access, setAccess] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);
  const [persons, setPersons] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [passwordNotIsEquals, setPasswordNotIsEquals] = useState(false);

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

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
    [classes.buttonError]: error,
  });

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    const csrfToken = getCookie('csrftoken');

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
  }, [handleLogout]);

  useEffect(() => {
    const csrfToken = getCookie('csrftoken');

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
  }, [handleLogout]);

  useEffect(() => {
    const csrfToken = getCookie('csrftoken');

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
  }, [handleLogout]);

  useEffect(() => {
    let userAccess = userGroups.filter(userGroup => {
      return userGroup.id_grupo === userData.idGroup;
    });
    if (userAccess.length > 0) {
      let userAccessArray = userAccess[0].acess.split('');
      setAccess(userAccessArray);
    }
  }, [userData.idGroup, userGroups]);

  function changeInputsUser(e) {
    const { value, name } = e.target;
    setUserData({ ...userData, [name]: value });
  }

  function handleClickShowPassword() {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  function handleClickShowPasswordConfirmation() {
    setShowPasswordConfirmation(!showPasswordConfirmation);
  };

  const handleMouseDownPasswordConfirmation = (event) => {
    event.preventDefault();
  };

  function verificationPassword() {
    if (userData.password !== passwordConfirmation) {
      setPasswordNotIsEquals(true);
    } else {
      setPasswordNotIsEquals(false);
    }
  }

  function handleFormatAccessUserArrayToString() {
    let elements = document.getElementById("form-register").elements;
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

  function handleRegisterNewUser(e) {
    e.preventDefault();
    const accessFormated = handleFormatAccessUserArrayToString();
    const csrfToken = getCookie('csrftoken');
    const { instit_id } = JSON.parse(localStorage.getItem('user'));

    api.post('/users/register', { ...userData, access: accessFormated, idInstitution: instit_id }, {
      headers: {
        'X-CSRFToken': csrfToken
      }
    }).then(response => {
      handleButtonClickProgress();
      setTimeout(() => {
        toast.success('Usuário cadastrado com sucesso!');
      }, 2000);
      setTimeout(() => {
        history.push('/users');
      }, 7000);
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

  function geraSenha() {
    const rand = (min, max) => Math.floor(Math.random() * (max - min) + min);
    const geraMaiuscula = () => String.fromCharCode(rand(65, 91));
    const geraMinuscula = () => String.fromCharCode(rand(97, 123));
    const geraNumero = () => String.fromCharCode(rand(48, 58));

    const senhaArray = [];
    const qtd = Number(8);

    for (let i = 0; i < qtd; i++) {
      senhaArray.push(geraMaiuscula());
      senhaArray.push(geraMinuscula());
      senhaArray.push(geraNumero());
    }
    const senhaGerada = senhaArray.join('').slice(0, qtd);
    setUserData({ ...userData, password: senhaGerada });
  }

  return (
    <div className={classes.root}>
      <ToastContainer />
      <CssBaseline />
      <Menus title="Cadastrar usuário" />
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
            id="form-register"
            onSubmit={(e) => handleRegisterNewUser(e)}
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
                      name="firstName"
                      variant="outlined"
                      value={userData.firstName}
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
                      name="lastName"
                      variant="outlined"
                      value={userData.lastName}
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
                      type="email"
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
                      <InputLabel id="isactive-select">Usuário ativo</InputLabel>
                      <Select
                        labelId="isactive-select"
                        id="isactive"
                        value={userData.isAcite}
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
                        name="idPerson"
                        value={userData.idPerson || 0}
                        onChange={(e) => changeInputsUser(e)}
                        label="Registro de pessoa"
                      >
                        <MenuItem value={0}>
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
                        value={userData.idGroup || ''}
                        onChange={(e) => changeInputsUser(e)}
                        label="Grupo"
                        name="idGroup"
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
                  <Grid
                    item
                    xs={3}
                    sm={3}
                    xl={3}
                  >
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel htmlFor="outlined-adornment-password">Senha</InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        value={userData.password}
                        onChange={(e) => changeInputsUser(e)}
                        name="password"
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        }
                        labelWidth={50}
                      />
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    xs={3}
                    sm={3}
                    xl={3}
                  >
                    <FormControl variant="outlined" fullWidth>
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
                              onMouseDown={handleMouseDownPasswordConfirmation}
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

                  <Grid
                    item
                    xs={3}
                    sm={3}
                    xl={3}
                  >
                    <Button
                      variant="contained"
                      color="default"
                      onClick={geraSenha}
                    >
                      Gerar senha
                    </Button>
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
                              {/* {
                                access[permission.id - 1] === '1'
                                  ? (
                                    <Checkbox
                                      edge="end"
                                      defaultChecked
                                      checked={checked.indexOf(permission.id) !== -1}
                                      onClick={handleToggle(permission.id)}
                                      tabIndex={-1}
                                      name={`${permission.id - 1}`}
                                      disableRipple
                                      color="primary"
                                      inputProps={{ 'aria-labelledby': `checkbox-list-label-${permission.id}` }}
                                    />
                                  ) : (
                                    <Checkbox
                                      edge="end"
                                      tabIndex={-1}
                                      onClick={handleToggle(permission.id)}
                                      checked={checked.indexOf(permission.id) !== -1}
                                      name={`${permission.id - 1}`}
                                      disableRipple
                                      color="primary"
                                      inputProps={{ 'aria-labelledby': `checkbox-list-label-${permission.id}` }}
                                    />
                                  )
                              } */}
                              <Checkbox
                                edge="end"
                                name={`${permission.id - 1}`}
                                checked={access[permission.id - 1] === '1' ? true : false}
                                tabIndex={-1}
                                disableRipple
                                color="primary"
                                inputProps={{ 'aria-labelledby': `checkbox-list-label-${permission.id}` }}
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
                        Salvar
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
