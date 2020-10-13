import React, { useState, useEffect } from 'react';
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

import api from '../../services/api';

import ImagePerfil from '../../assets/images/admin.png';

import Menus from '../../components/Menus';
import Copyright from '../../components/Copyright';

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
  }
}));

export default function Profile() {
  const classes = useStyles();
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [institution, setInstituition] = useState('');
  const [dateJoined, setDateJoined] = useState('');
  const [userData, setUserData] = useState({});


  useEffect(() => {
    async function getUser() {
      try {
        const { data } = await api.get('/users/profile');
        setUserData(data.user);
        setFirstName(data.user.first_name);
        setLastName(data.user.last_name);
        setEmail(data.user.email);
        setInstituition(data.user.instit_id);
        setDateJoined(data.user.date_joined);
        setUsername(data.user.username);
      } catch (error) {
        console.log(error);
      }
    }
    getUser();
  }, []);

  function formatDate(date) {
    let dateFormated = Date.parse(date);
    return dateFormated.toLocaleString();
  }

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

  async function handleEdit(e) {
    e.preventDefault();
    let { id: userId } = localStorage.getItem('user');
    let csrftoken = getCookie('csrftoken');

    try {
      const response = await api.post('/users/edit',
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

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Menus title="Profile" />
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
                      startIcon={<SaveIcon />}
                    >
                      Salvar alterações
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
