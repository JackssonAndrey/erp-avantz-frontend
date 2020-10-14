import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import CssBaseline from '@material-ui/core/CssBaseline';

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';

import api from '../../services/api';
import Menus from '../../components/Menus';
import Copyright from '../../components/Copyright';
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
  }
}));

export default function Settings() {
  const classes = useStyles();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  async function handleChangePassword(e) {
    e.preventDefault();

    const csrfToken = getCookie('csrftoken');

    const { data, status } = await api.put('/users/change_password/', {
      old_password: oldPassword,
      new_password: newPassword
    }, {
      headers: {
        'X-CSRFToken': csrfToken
      }
    });

    if (status !== 200) {
      toast.error('Não foi possível alterar a senha, tente novamente!');
    }

    if (status === 200) {
      setNewPassword('');
      setOldPassword('');
      toast.success('Senha alterada com sucesso!');
    }

    console.log(data, status);
  }

  return (
    <div className={classes.root}>
      <ToastContainer />
      <CssBaseline />
      <Menus title="Configurações" />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container className={classes.container} maxWidth="lg">
          <form
            onSubmit={(e) => handleChangePassword(e)}
          >
            <Card>
              <CardHeader
                subheader="Atualize sua senha"
                title="Senha"
              />
              <Divider />
              <CardContent>
                <TextField
                  fullWidth
                  label="Senha antiga"
                  margin="normal"
                  name="password"
                  onChange={(e) => setOldPassword(e.target.value)}
                  type="password"
                  value={oldPassword}
                  variant="outlined"
                  required
                />
                <TextField
                  fullWidth
                  label="Nova senha"
                  margin="normal"
                  name="confirm"
                  onChange={(e) => setNewPassword(e.target.value)}
                  type="password"
                  value={newPassword}
                  variant="outlined"
                  required
                />
              </CardContent>
              <Divider />
              <Box
                display="flex"
                justifyContent="flex-end"
                p={2}
              >
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                >
                  Atualizar
                </Button>
              </Box>
            </Card>
          </form>

          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
}
