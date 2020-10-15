import React, { useState, useEffect, useContext, useRef } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import SaveIcon from '@material-ui/icons/Save';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import { Card, CardContent, Typography, CardActions, CardHeader } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';


import api from '../../services/api';

import ImagePerfil from '../../assets/images/admin.png';

import Menus from '../../components/Menus';
import Copyright from '../../components/Copyright';
import { Context } from '../../Context/AuthContext';

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
}));

export default function Profile() {
  const classes = useStyles();
  const { handleLogout } = useContext(Context);
  const timer = useRef();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [institution, setInstituition] = useState('');
  const [dateJoined, setDateJoined] = useState('');

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  useEffect(() => {
    async function getUser() {
      try {
        const { data } = await api.get('/users/profile');
        setFirstName(data.user.first_name);
        setLastName(data.user.last_name);
        setEmail(data.user.email);
        setInstituition(data.user.instit_id);
        setDateJoined(data.user.date_joined);
        setUsername(data.user.username);
      } catch (error) {
        toast.error(`Não foi possível carregar seus dados, faça login novamente! ${error.message || error}`);
        // setTimeout(() => {
        //   handleLogout();
        // }, 5000);
        console.log(error.message || error);
      }
    }
    getUser();
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  const handleButtonClickProgress = () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      timer.current = window.setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 2000);
    }
  };

  async function handleEdit(e) {
    e.preventDefault();
    let user = JSON.parse(localStorage.getItem('user'));
    let userId = user.id;
    let csrftoken = getCookie('csrftoken');

    try {
      await api.post('/users/edit',
        {
          userId,
          firstName,
          lastName,
          email
        },
        {
          headers: {
            'X-CSRFToken': csrftoken
          }
        }
      );
      handleButtonClickProgress();
      setTimeout(() => {
        toast.success('Seus dados foram atualizados!');
      }, 2000);
    } catch (error) {
      toast.error('Token expirado, faça login novamente!');
      setTimeout(() => {
        handleLogout();
      }, 5000);
      console.log(error.message);
    }
  }

  return (
    <div className={classes.root}>
      <ToastContainer />
      <CssBaseline />
      <Menus title="Perfil" />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container className={classes.container} maxWidth="lg">
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              sm={4}
              lg={4}
              md={6}
              xs={12}
            >
              <Card>
                <CardContent>
                  <Box
                    alignItems="center"
                    display="flex"
                    flexDirection="column"
                  >
                    <Avatar alt="Remy Sharp" src={ImagePerfil} className={classes.large} />

                    <Typography
                      color="textPrimary"
                      gutterBottom
                      variant="h6"
                    >
                      {username}
                    </Typography>

                    <Typography
                      color="textSecondary"
                      variant="body1"
                    >
                      {
                        dateJoined
                      }
                    </Typography>
                  </Box>
                </CardContent>
                <Divider />
                <CardActions>
                  <Box
                    display="flex"
                    justifyContent="center"
                  >
                    <input
                      accept="image/*"
                      className={classes.input}
                      id="contained-button-file"
                      type="file"
                    />
                    <label htmlFor="contained-button-file">
                      <Button fullWidth variant="text" color="primary" component="span" startIcon={<CloudUploadIcon />}>
                        Alterar imagem
                    </Button>
                    </label>
                  </Box>

                </CardActions>
              </Card>
            </Grid>
            <Grid
              item
              sm={8}
              lg={8}
              md={6}
              xs={12}
            >
              <form
                autoComplete="off"
                noValidate
                onSubmit={(e) => handleEdit(e)}
              >
                <Card>
                  <CardHeader
                    title="Perfil"
                    subheader="Suas informações pessoais"
                  />
                  <Divider />
                  <CardContent>
                    <Grid
                      container
                      spacing={3}
                    >
                      <Grid
                        item
                        md={6}
                        xs={12}
                      >
                        <TextField
                          autoComplete="off"
                          fullWidth
                          helperText="Please specify the first name"
                          label="First name"
                          name="firstName"
                          required
                          variant="outlined"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </Grid>
                      <Grid
                        item
                        md={6}
                        xs={12}
                      >
                        <TextField
                          fullWidth
                          label="Last name"
                          name="lastName"
                          required
                          variant="outlined"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </Grid>
                      <Grid
                        item
                        md={12}
                        xs={12}
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
                        md={12}
                        xs={12}
                      >
                        <TextField
                          fullWidth
                          label="Instituição"
                          name="instituicao"
                          disabled
                          variant="outlined"
                          value={institution}
                          onChange={(e) => setInstituition(e.target.value)}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                  <Divider />
                  <Box
                    display="flex"
                    justifyContent="flex-end"
                    p={2}
                  >
                    <Button
                      color="primary"
                      variant="contained"
                      type="submit"
                      className={buttonClassname}
                      disabled={loading}
                      startIcon={<SaveIcon />}
                    >
                      Salvar alterações
                    {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                    </Button>
                  </Box>
                </Card>
              </form>
            </Grid>
          </Grid>

          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );

}
