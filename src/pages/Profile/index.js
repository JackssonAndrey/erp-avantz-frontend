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

import api from '../../services/api';

import ImagePerfil from '../../assets/images/admin.png';
import Menus from '../../components/Menus';
import Copyright from '../../components/Copyright';
import { Context } from '../../Context/AuthContext';
import getCookie from '../../utils/functions';

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
  cardActions: {
    justifyContent: 'center'
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
  const [imagePerfil, setImagePerfil] = useState('');
  const [image, setImage] = useState();

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
        const { data } = error.response;
        toast.error(`${data.detail}`);
        setTimeout(() => {
          handleLogout();
        }, 5000);
        console.log(data.detail);
      }
    }
    getUser();
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    async function getImageUser() {
      try {
        const { data } = await api.get('/imagem/list');
        setImagePerfil(data.imagem);
      } catch (error) {
        const { data } = error.response;
        toast.error(`Não foi possível carregar a imagem de perfil, ${data.detail}`);
        console.log(data.detail);
      }
    }
    getImageUser();
  }, []);

  async function handleChangeImagePerfil(e) {
    e.preventDefault();
    const csrfToken = getCookie('csrftoken');
    let { id, instit_id } = JSON.parse(localStorage.getItem('user'));
    const formData = new FormData();
    formData.append('imagem', image);
    formData.append('user', id);
    formData.append('instit', instit_id);
    console.log(image);

    if (image === '' || image === {} || image === undefined) {
      toast.error('Selecione uma imagem.');
      return;
    }

    try {
      await api.post('/imagem/upload',
        {
          imagem: image,
          user: id,
          instit: instit_id
        },
        {
          headers: {
            'X-CSRFToken': csrfToken
          }
        }
      );
      handleButtonClickProgress();
      setTimeout(() => {
        toast.success('Imagem de perfil alterada com sucesso!');
      }, 2000);
    } catch (error) {
      const { data } = error.response;
      toast.error(`Não foi possível atualizar a imagem de perfil`);
      console.log(data.detail);
    }
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
      toast.error(`${data.detail}`);
      setTimeout(() => {
        handleLogout();
      }, 5000);
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
                    <Avatar alt="Remy Sharp" src={imagePerfil} className={classes.large} />

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
                <CardActions className={classes.cardActions}>
                  <form
                    autoComplete="off"
                    noValidate
                    onSubmit={(e) => handleChangeImagePerfil(e)}>
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
                          <Button fullWidth variant="text" color="primary" component="span" startIcon={<CloudUploadIcon />}>
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
                          startIcon={<SaveIcon />}
                        >
                          Salvar
                          {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
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
