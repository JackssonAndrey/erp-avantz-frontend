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
  Container
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import CircularProgress from '@material-ui/core/CircularProgress';

import api from '../../services/api';
import Copyright from '../../components/Copyright';
import useStyles from './styles';

import 'react-toastify/dist/ReactToastify.css';
import '../../global/global.css';



function ResetPassword() {
  const classes = useStyles();
  const timer = useRef();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
    [classes.buttonError]: error,
  });

  const handleChangePassword = async (e) => {
    e.preventDefault();

    try {
      await api.post('/users/password_reset/confirm/', { token, password });
      handleButtonClickProgress();
      setTimeout(() => {
        toast.success('Senha alterada, faça login agora!');
      }, 2000);
    } catch (error) {
      const { data } = error.response;
      handleButtonClickProgressError();
      setTimeout(() => {
        data.email.map(error => {
          toast.error(`${error}`);
        });
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
          Crie uma nova senha
        </Typography>
        <Typography component="h3" className={classes.subtitle}>
          Crie uma senha segura e de fácil memorização. Guarde-a bem e não compartilhe com ninguém.
        </Typography>
        <form className={classes.form} onSubmit={(e) => handleChangePassword(e)} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="token"
            label="Digite o token que foi enviado para o seu e-mail"
            name="token"
            autoComplete="token"
            autoFocus
            value={token}
            onChange={(e) => { setToken(e.target.value) }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="password"
            label="Digite uma nova senha"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
                Faça login.
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

export default ResetPassword;
