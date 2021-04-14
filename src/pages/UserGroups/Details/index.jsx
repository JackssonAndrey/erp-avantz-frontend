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
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemSecondaryAction,
  Checkbox,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  CircularProgress,
  Button
} from '@material-ui/core';
import {
  ArrowBack,
  Edit,
  Delete,
  DeleteForever as DeleteForeverIcon
} from '@material-ui/icons';

import Menus from '../../../components/Menus';
import Copyright from '../../../components/Copyright';
import api from '../../../services/api';
import history from '../../../services/history';
import getCookie from '../../../utils/functions';
import useStyles from './styles';

import 'react-toastify/dist/ReactToastify.css';


export default function UserGroupDetails(props) {
  const classes = useStyles();
  const timer = useRef();
  const [group, setGroup] = useState('');
  const [userPermissions, setUserPermissions] = useState([]);
  const [access, setAccess] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [defaultButton, setDefaultButton] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const idGroup = props.match.params.id;
  const csrfToken = getCookie('csrftoken');

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
    [classes.buttonError]: error,
    [classes.buttonDefault]: defaultButton
  });

  useEffect(() => {
    api.get(`/groups/details/${idGroup}`, {
      headers: {
        'X-CSRFToken': csrfToken
      }
    }).then(result => {
      setGroup(result.data.grupo);
      setAccess(result.data.acess.split(''));
    }).catch(reject => {
      const { data } = reject.response;
      toast.error(`${data.detail}`);
      console.log(data);
    });
  }, [idGroup, csrfToken]);

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

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const handleClickOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setDefaultButton(true);
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

  function handleDeleteGroupUser(id) {
    const csrftoken = getCookie('csrftoken');

    api.delete(`/groups/delete/${id}`, {
      headers: {
        'X-CSRFToken': csrftoken
      }
    }).then(result => {
      handleButtonClickProgress();
      setTimeout(() => {
        toast.success('Grupo deletado com sucesso!');
      }, 2000);
      setTimeout(() => {
        handleCloseModal();
        history.push('/users');
      }, 3500);
    }).catch(reject => {
      const { data } = reject.response;
      handleButtonClickProgressError();
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
    });
  }

  return (
    <div className={classes.root}>
      <ToastContainer />
      <CssBaseline />
      <Menus title="Detalhes do grupo" />
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
                  <Tooltip title="Voltar">
                    <IconButton>
                      <ArrowBack />
                    </IconButton>
                  </Tooltip>
                </Link>

                <Link to={`/groups/edit/${idGroup}`} className="link" >
                  <Tooltip title="Editar">
                    <IconButton>
                      <Edit style={{ color: orange[300] }} />
                    </IconButton>
                  </Tooltip>
                </Link>

                <Tooltip title="Deletar">
                  <IconButton onClick={() => handleClickOpenModal()} aria-label="Deletar">
                    <Delete style={{ color: red[300] }} />
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
                    <List >
                      <h2>Permissões do grupo {group}</h2>
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

        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Deletar grupo de usuário</DialogTitle>
          <Divider />
          <DialogContent className={classes.modalContent}>
            <div className={classes.divIconModal}>
              <DeleteForeverIcon className={classes.modalIcon} />
            </div>
            <DialogContentText id="alert-dialog-description" className={classes.modalContentText}>
              <p>Você realmente deseja deletar este grupo? Esta operação não pode ser desfeita.</p>
            </DialogContentText>
          </DialogContent>
          <Divider />
          <DialogActions>
            <Button
              onClick={() => handleDeleteGroupUser(idGroup)}
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
