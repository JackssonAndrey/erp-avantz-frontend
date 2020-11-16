import React, { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { makeStyles } from '@material-ui/core/styles';
import { green, red, blue } from '@material-ui/core/colors';
import {
  Box, Container, CssBaseline, Card, CardContent, IconButton, Grid, TextField, List, ListItem, ListItemText, Divider,
  ListItemSecondaryAction, Checkbox, Button, CircularProgress
} from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';

import Menus from '../../../components/Menus';
import Copyright from '../../../components/Copyright';
import api from '../../../services/api';
import history from '../../../services/history';
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
    color: blue[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  buttonError: {
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[700],
    },
  },
  cardContent: {
    marginTop: theme.spacing(3)
  },
  avatarLarge: {
    width: theme.spacing(10),
    height: theme.spacing(10)
  }
}));

export default function RegisterUserGroup() {
  const classes = useStyles();
  const timer = useRef();
  const [group, setGroup] = useState('');
  const [userPermissions, setUserPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const csrfToken = getCookie('csrftoken');

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
    api.get('/permissions/', {
      headers: {
        'X-CSRFToken': csrfToken
      }
    }).then(result => {
      setUserPermissions(result.data);
    }).catch(reject => {
      console.log(reject);
    });
  }, [csrfToken]);

  function handleFormatAccessUserArrayToString() {
    let elements = document.getElementById("register-group-form").elements;
    let newArrayAccess = [];

    for (let i = 0, element; element = elements[i++];) {
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

  function handleRegisterUserGroup(e) {
    e.preventDefault();
    const accessFormated = handleFormatAccessUserArrayToString();

    api.post('groups/register', { nameGroup: group, access: accessFormated }, {
      headers: {
        'X-CSRFToken': csrfToken
      }
    }).then(result => {
      handleButtonClickProgress();
      setTimeout(() => {
        toast.success('Grupo cadastrado com sucesso!');
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

  return (
    <div className={classes.root}>
      <ToastContainer />
      <CssBaseline />
      <Menus title="Cadastrar grupo" />
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
            id="register-group-form"
            onSubmit={(e) => handleRegisterUserGroup(e)}
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
                      label="Nome"
                      name="name"
                      variant="outlined"
                      value={group}
                      onChange={(e) => setGroup(e.target.value)}
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
                        <h2>Permissões do grupo</h2>
                        <Divider />
                        {userPermissions.map(permission => (
                          <ListItem key={permission.id} role={undefined} dense button>
                            <ListItemText primary={permission.descr} />
                            <ListItemSecondaryAction>
                              <Checkbox
                                edge="end"
                                name={`${permission.id - 1}`}
                                id={`${permission.id - 1}`}
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                // defaultChecked
                                // checked={checked}
                                // onChange={() => setChecked(!checked)}
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
