import React, { useState, useEffect, useContext, useRef } from 'react';
import clsx from 'clsx';
import {
  CssBaseline,
  Box,
  Container,
  Grid,
  Avatar,
  Button,
  Divider,
  TextField,
  CircularProgress,
  Card,
  CardContent,
  Typography,
  CardActions,
  CardHeader
} from '@material-ui/core';

import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import SaveIcon from '@material-ui/icons/Save';
import { toast, ToastContainer } from 'react-toastify';
import moment from 'moment';

import api from '../../services/api';

import Menus from '../../components/Menus';
import Copyright from '../../components/Copyright';
import { Context } from '../../Context/AuthContext';
import getCookie from '../../utils/functions';
import useStyles from './styles';

import 'react-toastify/dist/ReactToastify.css';


export default function Profile() {
  const classes = useStyles();
  const { handleLogout } = useContext(Context);
  const timer = useRef();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loadingImageUpload, setLoadingImageUpload] = useState(false);
  const [successImageUpload, setSuccessImageUpload] = useState(false);
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dateJoined, setDateJoined] = useState('');
  const [imagePerfil, setImagePerfil] = useState('');
  const [image, setImage] = useState();

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
    [classes.buttonError]: error,
  });

  const buttonClassNameImageUpload = clsx({
    [classes.buttonSuccess]: successImageUpload,
  });

  useEffect(() => {
    async function getUser() {
      try {
        const { data } = await api.get('/users/profile');
        setFirstName(data.user.first_name);
        setLastName(data.user.last_name);
        setEmail(data.user.email);
        setDateJoined(data.user.date_joined);
        setUsername(data.user.username);
        setImagePerfil(data.user.foto);
      } catch (error) {
        const { data } = error.response;
        toast.error(`${data.detail}`);
        setTimeout(() => {
          handleLogout();
        }, 5000);
        console.log(data.detail);
      }
    }
    getUser();
  }, [handleLogout]);

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  async function handleChangeImagePerfil(e) {
    e.preventDefault();
    const csrfToken = getCookie('csrftoken');
    const formData = new FormData();
    formData.append('foto', image);

    if (image === '' || image === {} || image === undefined) {
      toast.error('Selecione uma imagem.');
      return;
    }

    try {
      const { data } = await api.post('/users/edit/image', formData,
        {
          headers: {
            'X-CSRFToken': csrfToken
          },
          // onUploadProgress: progressEvent => {
          //   console.log(`Upload progress: ${Math.round(progressEvent.loaded / progressEvent.total * 100)} %`);
          // }
        }
      );
      handleProgressImageUpload();
      setTimeout(() => {
        toast.success('Imagem de perfil alterada com sucesso!');
      }, 2000);
      setImagePerfil(data.imageURL);
    } catch (error) {
      // const { data } = error.response;
      handleButtonClickProgressError();
      setTimeout(() => {
        toast.error(`Não foi possível atualizar a imagem de perfil`);
      }, 2000);
      // console.log(data.detail);
    }
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

  function handleProgressImageUpload() {
    if (!loadingImageUpload) {
      setSuccessImageUpload(false);
      setLoadingImageUpload(true);
      timer.current = window.setTimeout(() => {
        setSuccessImageUpload(true);
        setLoadingImageUpload(false);
      }, 2000);
    }
  };

  async function handleEdit(e) {
    e.preventDefault();
    let user = JSON.parse(localStorage.getItem('user'));
    let userId = user.id;
    const csrfToken = getCookie('csrftoken');

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
            'X-CSRFToken': csrfToken
          }
        }
      );
      handleButtonClickProgress();
      setTimeout(() => {
        toast.success('Seus dados foram atualizados!');
      }, 2000);
    } catch (error) {
      const { data } = error.response;
      handleButtonClickProgressError();
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
      setTimeout(() => {
        handleLogout();
      }, 7000);
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
                    <Avatar src={`http://localhost:8000${imagePerfil}`} className={classes.large} />

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
                      Data de criação - {moment(dateJoined).format('DD/MM/YYYY')}
                    </Typography>
                  </Box>
                </CardContent>
                <Divider />
                <CardActions className={classes.cardActions}>
                  <form
                    autoComplete="off"
                    noValidate
                    onSubmit={(e) => handleChangeImagePerfil(e)}
                    style={{ width: '100%' }}
                  >
                    <Grid
                      container
                      spacing={3}
                      direction="row"
                      justify="center"
                      alignItems="center"
                    >
                      <Grid
                        item
                        sm={6}
                        md={6}
                        xs={6}
                      >
                        <input
                          accept="image/*"
                          className={classes.input}
                          id="contained-button-file"
                          type="file"
                          onChange={(e) => setImage(e.target.files[0])}
                        />
                        <label htmlFor="contained-button-file">
                          <Button
                            fullWidth
                            variant="outlined"
                            color="primary"
                            component="span"
                            startIcon={<CloudUploadIcon />}
                          >
                            Selecionar
                          </Button>
                        </label>
                      </Grid>
                      <Grid
                        item
                        sm={6}
                        md={6}
                        xs={6}
                      >
                        <Button
                          fullWidth
                          type="submit"
                          color="primary"
                          variant="contained"
                          className={buttonClassNameImageUpload}
                          disabled={loadingImageUpload}
                          startIcon={<SaveIcon />}
                        >
                          Salvar
                          {loadingImageUpload && <CircularProgress size={24} className={classes.buttonProgress} />}
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
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
                          value={JSON.parse(localStorage.getItem('institution'))}
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

        </Container>
        <Box pt={4}>
          <Copyright />
        </Box>
      </main>
    </div>
  );

}
