import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useContext
} from 'react';
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
import { Context } from '../../../Context/AuthContext';

import 'react-toastify/dist/ReactToastify.css';

export default function EditUserGroup(props) {
  const classes = useStyles();
  const { handleLogout } = useContext(Context);
  const timer = useRef();
  const [group, setGroup] = useState('');
  const [userPermissions, setUserPermissions] = useState([]);
  const [access, setAccess] = useState(['0']);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const idGroup = props.match.params.id;
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
        const { data } = await api.get(`/groups/details/${idGroup}`, {
          headers: {
            'X-CSRFToken': csrfToken
          }
        });
        setGroup(data.grupo);
        changeSizePermissionArray(data.acess.split(''));
      } catch (err) {
        const { data, status } = err.response;
        toast.error(`${data.detail}`);

        console.error(data);
        if (status === 401) {
          setTimeout(() => {
            handleLogout();
          }, 3500);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idGroup, csrfToken, handleLogout, userPermissions]);

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

        console.error(data.detail);
        if (status === 401) {
          setTimeout(() => {
            handleLogout();
          }, 5000);
        }
      }
    })();
  }, [csrfToken, handleLogout]);

  function handleFormatAccessUserArrayToString() {
    let accessFormated = access.join('').toString();
    return accessFormated;
  }

  async function handleEditUserGroup(e) {
    e.preventDefault();
    const accessFormated = handleFormatAccessUserArrayToString();

    const dataGorup = {
      nameGroup: group,
      accessGroup: accessFormated
    }

    console.log(dataGorup);

    try {
      await api.put(`groups/edit/${idGroup}`, dataGorup, {
        headers: {
          'X-CSRFToken': csrfToken
        }
      });

      handleButtonClickProgress();
      setTimeout(() => {
        toast.success('Grupo atualizado com sucesso!');
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

  /*
    Method for changing the size of the group's access array. Leaves the same size as the permissions array.

    Avoids errors in rendering group permissions.
  */
  const changeSizePermissionArray = useCallback((arrayForChange) => {
    console.log(arrayForChange.length);
    console.log(userPermissions.length);

    if (arrayForChange.length <= userPermissions.length) {
      console.log('array diferentes');
      while (arrayForChange.length <= userPermissions.length + 2) {
        arrayForChange.push('0');
        console.log('adicionou');
      }
    }
    setAccess(arrayForChange);
  }, [userPermissions]);

  return (
    <div className={classes.root}>
      <ToastContainer />
      <CssBaseline />
      <Menus title="Editar grupo" />
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
            id="edit-group-form"
            onSubmit={(e) => handleEditUserGroup(e)}
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
