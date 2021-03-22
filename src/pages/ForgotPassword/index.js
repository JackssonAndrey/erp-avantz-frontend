import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import clsx from 'clsx';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  makeStyles
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { grey, green, red, blue } from '@material-ui/core/colors';
import CircularProgress from '@material-ui/core/CircularProgress';

import api from '../../services/api';
import getCookie from '../../utils/functions';
import Copyright from '../../components/Copyright';

import 'react-toastify/dist/ReactToastify.css';
import '../../global/global.css';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  subtitle: {
    marginTop: theme.spacing(2),
    color: grey[700]
  },
  buttonSuccess: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonError: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: red[500],
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
}));

function ForgotPassword() {
  const classes = useStyles();
  const timer = useRef();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
    [classes.buttonError]: error,
  });

  async function handleSendMail(e) {
    e.preventDefault();
    const csrfToken = getCookie('csrftoken');

    try {
      await api.post('/users/password_reset/', { email }, {
        headers: {
          'X-CSRFToken': csrfToken
        }
      });
      handleButtonClickProgress();
      setTimeout(() => {
        toast.success('E-mail enviado, verifique sua caixa de entrada!');
      }, 2000);
      return;
    } catch (error) {
      const { data } = error.response;
      handleButtonClickProgressError();
      setTimeout(() => {
        data.email.map(error => {
          return toast.error(`${error}`);
        });
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

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <ToastContainer />
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Recuperar senha
        </Typography>
        <Typography component="h3" className={classes.subtitle}>
          Enviaremos um token de recuperação para você, verifique seu e-mail.
        </Typography>
        <form className={classes.form} onSubmit={(e) => handleSendMail(e)} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Digite seu endereço de e-mail"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => { setEmail(e.target.value) }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={buttonClassname}
            disabled={loading}
          >
            Enviar
            {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/login" className="link-underlined">
                Já tem uma conta? Faça login.
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default ForgotPassword;
