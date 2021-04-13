import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Box,
  Typography,
  Container
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { toast, ToastContainer } from 'react-toastify';

import { Context } from '../../Context/AuthContext';
import Copyright from '../../components/Copyright';
import useStyles from './styles';

import 'react-toastify/dist/ReactToastify.css';
import '../../global/global.css';


export default function Login() {
  const classes = useStyles();
  const { handleLogin, errors } = useContext(Context);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (errors.error !== '') {
      toast.error(`${errors.error}`);
    }
  }, [errors]);

  return (
    <Container component="main" maxWidth="xs">
      <ToastContainer />
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Bem vindo de volta, faça login novamente para ter acesso ao sistema!
        </Typography>
        <form className={classes.form} onSubmit={(e) => handleLogin(e, username, password)} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Usuário"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => { setUsername(e.target.value) }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => { setPassword(e.target.value) }}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Entrar
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/forgot-password" className="link-underlined">
                Esqueceu a senha?
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
