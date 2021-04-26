import React, { useEffect, useState, useRef, useCallback } from 'react';
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
  CircularProgress
} from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';

import Menus from '../../../components/Menus';
import Copyright from '../../../components/Copyright';
import api from '../../../services/api';
import history from '../../../services/history';
import getCookie from '../../../utils/functions';
import useStyles from './styles';

import 'react-toastify/dist/ReactToastify.css';

export default function RegisterUserGroup() {
  const classes = useStyles();
  const timer = useRef();
  const [group, setGroup] = useState('');
  const [userPermissions, setUserPermissions] = useState([]);
  const [access, setAccess] = useState(['0']);
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
        console.error(data.detail, status);
      }
    })();
  }, [csrfToken]);

  useEffect(() => {
    changeSizePermissionArray(['0']);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPermissions]);

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

  function handleFormatAccessUserArrayToString() {
    let accessFormated = access.join('').toString();
    return accessFormated;
  }

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

  async function handleRegisterUserGroup(e) {
    e.preventDefault();
    const accessFormated = handleFormatAccessUserArrayToString();

    try {
      await api.post('groups/register', { nameGroup: group, access: accessFormated }, {
        headers: {
          'X-CSRFToken': csrfToken
        }
      });

      handleButtonClickProgress();
      setTimeout(() => {
        toast.success('Grupo cadastrado com sucesso!');
      }, 2000);
      setTimeout(() => {
        history.push('/users');
      }, 4000);
    } catch (err) {
      const { data } = err.response;
      handleButtonClickProgressError();
      setTimeout(() => {
        toast.error(`${data.detail}`);
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
                                name={`${permission.posicao_rotina}`}
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                checked={access[permission.posicao_rotina - 1] === '1' ? true : false}
                                onClick={handleToggle(permission.posicao_rotina - 1)}
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
