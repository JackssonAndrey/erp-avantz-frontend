import React, { useEffect, useState, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { ToastContainer, toast } from 'react-toastify';
import { orange, red } from '@material-ui/core/colors';
import { useTheme } from '@material-ui/core/styles';
import {
  Box,
  Container,
  CssBaseline,
  Card,
  CardContent,
  IconButton,
  Grid,
  TextField,
  Divider,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  CircularProgress,
  Button,
  Badge,
} from '@material-ui/core';

import {
  ArrowBack,
  Edit,
  Delete,
  DeleteForever as DeleteForeverIcon
} from '@material-ui/icons';

import moment from 'moment';

import Menus from '../../../components/Menus';
import Copyright from '../../../components/Copyright';
import api from '../../../services/api';
import history from '../../../services/history';
import getCookie from '../../../utils/functions';
import useStyles from './styles';
import { Context } from '../../../Context/AuthContext';

import 'react-toastify/dist/ReactToastify.css';

const initialStateInstitution = {
  ativo: 0,
  nome: "",
  razsoc: "",
  end: "",
  endnum: "",
  endcompl: "",
  bairro: "",
  cep: "",
  cidade: 0,
  uf: 0,
  cnpj: "",
  iest: "",
  imun: "",
  mail1: "",
  mail2: "",
  tel1: "",
  tel2: "",
  tel3: "",
  slogan: "",
  modulos: null
}

export default function DetailsInstitution(props) {
  const classes = useStyles();
  const theme = useTheme();
  const timer = useRef();
  const { handleLogout } = useContext(Context);
  const idInstitution = props.match.params.id;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [defaultButton, setDefaultButton] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [userPermissions, setUserPermissions] = useState([]);
  const [institution, setInstitution] = useState(initialStateInstitution);

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
    [classes.buttonError]: error,
    [classes.buttonDefault]: defaultButton
  });

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

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/users/access');
        setUserPermissions(data.acess.split(''));
      } catch (err) {
        const { data } = err.response;
        toast.error(data.detail);
      }
    })();
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    const csrfToken = getCookie('csrftoken');

    (async () => {
      try {
        const { data } = await api.get(`/institution/details/${idInstitution}/`, {
          headers: {
            'X-CSRFToken': csrfToken
          }
        });
        setInstitution(data);
      } catch (err) {
        const { data, status } = err.response;
        toast.error(`${data.detail}`);
        if (status === 401) {
          setTimeout(() => {
            handleLogout();
          }, 3000);
        }
      }
    })();
  }, [idInstitution, handleLogout]);

  function handleChangeInputsInstitution(e) {
    const { name, value } = e.target;
    setInstitution({ ...institution, [name]: value });
  }

  async function handleDelete(id) {
    const csrftoken = getCookie('csrftoken');

    try {
      await api.put(`/institution/deactivate/${id}`, {
        headers: {
          'X-CSRFToken': csrftoken
        }
      });
      handleButtonClickProgress();
      setTimeout(() => {
        toast.success('Registro da instituição foi desativado com sucesso!');
      }, 2000);
      setTimeout(() => {
        handleCloseModal();
        history.push('/institutions');
      }, 3000);
    } catch (err) {
      const { data } = err.response;
      handleButtonClickProgressError();
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
    }
  }


  return (
    <div className={classes.root}>
      <ToastContainer />
      <CssBaseline />
      <Menus title="Detalhes da instituição" />
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
                <Link to="/institutions" className="link">
                  <Tooltip title="Voltar" arrow>
                    <IconButton>
                      <ArrowBack />
                    </IconButton>
                  </Tooltip>
                </Link>

                <Link to={`/institution/edit/${idInstitution}`} className="link" >
                  <Tooltip title="Editar" arrow>
                    <IconButton>
                      <Edit style={{ color: orange[300] }} />
                    </IconButton>
                  </Tooltip>
                </Link>

                <Tooltip title="Deletar" arrow>
                  <IconButton onClick={() => handleClickOpenModal()} aria-label="Deletar">
                    <Delete style={{ color: red[300] }} />
                  </IconButton>
                </Tooltip>

              </Box>
            </CardContent>
          </Card>

          <Card style={{ marginTop: theme.spacing(3) }}>
            <CardContent>
              <Box>
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
                    {
                      institution.ativo === 1 ? (
                        <Badge
                          color="primary"
                          badgeContent="Ativo"
                          overlap="rectangle"
                          style={{ marginLeft: theme.spacing(3) }}
                        />
                      ) : (
                        <Badge
                          color="secondary"
                          badgeContent="Desativada"
                          overlap="rectangle"
                          style={{ marginLeft: theme.spacing(3) }}
                        />
                      )
                    }
                  </Grid>

                  <Grid
                    item
                    xs={6}
                    sm={6}
                    xl={6}
                  >
                    <TextField
                      fullWidth
                      disabled
                      label="Nome"
                      name="nome"
                      variant="outlined"
                      value={institution.nome}
                      onChange={(e) => handleChangeInputsInstitution(e)}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={6}
                    sm={6}
                    xl={6}
                  >
                    <TextField
                      fullWidth
                      disabled
                      label="Razão social"
                      name="razsoc"
                      variant="outlined"
                      value={institution.razsoc}
                      onChange={(e) => handleChangeInputsInstitution(e)}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={4}
                    sm={4}
                    xl={4}
                  >
                    <TextField
                      fullWidth
                      disabled
                      label="CNPJ"
                      name="cnpj"
                      variant="outlined"
                      value={institution.cnpj}
                      onChange={(e) => handleChangeInputsInstitution(e)}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={4}
                    sm={4}
                    xl={4}
                  >
                    <TextField
                      fullWidth
                      disabled
                      label="Inscrição Estadual"
                      name="iest"
                      variant="outlined"
                      value={institution.iest === null ? 'Não informado' : institution.iest}
                      onChange={(e) => handleChangeInputsInstitution(e)}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={4}
                    sm={4}
                    xl={4}
                  >
                    <TextField
                      fullWidth
                      disabled
                      label="Inscrição Municipal"
                      name="imun"
                      variant="outlined"
                      value={institution.imun === null ? 'Não informado' : institution.imun}
                      onChange={(e) => handleChangeInputsInstitution(e)}
                    />
                  </Grid>

                  <Divider />

                  <Grid
                    item
                    xs={3}
                    sm={3}
                    xl={3}
                  >
                    <TextField
                      fullWidth
                      disabled
                      label="CEP"
                      name="cep"
                      variant="outlined"
                      value={institution.cep === null ? 'Não informado' : institution.cep}
                      onChange={(e) => handleChangeInputsInstitution(e)}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={2}
                    sm={2}
                    xl={2}
                  >
                    <TextField
                      fullWidth
                      disabled
                      label="UF"
                      name="uf"
                      variant="outlined"
                      value={institution.uf === null ? 'Não informado' : institution.uf}
                      onChange={(e) => handleChangeInputsInstitution(e)}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={4}
                    sm={4}
                    xl={4}
                  >
                    <TextField
                      fullWidth
                      disabled
                      label="Cidade"
                      name="cidade"
                      variant="outlined"
                      value={institution.cidade === null ? 'Não informado' : institution.cidade}
                      onChange={(e) => handleChangeInputsInstitution(e)}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={6}
                    sm={6}
                    xl={6}
                  >
                    <TextField
                      fullWidth
                      disabled
                      label="Rua"
                      name="end"
                      variant="outlined"
                      value={institution.end === null ? 'Não informado' : institution.end}
                      onChange={(e) => handleChangeInputsInstitution(e)}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={3}
                    sm={3}
                    xl={3}
                  >
                    <TextField
                      fullWidth
                      disabled
                      label="Número"
                      name="endnum"
                      variant="outlined"
                      value={institution.endnum === null ? 'Não informado' : institution.endnum}
                      onChange={(e) => handleChangeInputsInstitution(e)}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={3}
                    sm={3}
                    xl={3}
                  >
                    <TextField
                      fullWidth
                      disabled
                      label="Bairro"
                      name="bairro"
                      variant="outlined"
                      value={institution.bairro === null ? 'Não informado' : institution.bairro}
                      onChange={(e) => handleChangeInputsInstitution(e)}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    xl={12}
                  >
                    <TextField
                      fullWidth
                      disabled
                      label="Complemento"
                      name="endcompl"
                      variant="outlined"
                      value={institution.endcompl === null ? 'Não informado' : institution.endcompl}
                      onChange={(e) => handleChangeInputsInstitution(e)}
                    />
                  </Grid>

                  <Divider />

                  <Grid
                    item
                    xs={4}
                    sm={4}
                    xl={4}
                  >
                    <TextField
                      fullWidth
                      disabled
                      label="Endereço de email primário"
                      name="mail1"
                      variant="outlined"
                      value={institution.mail1 === null ? 'Não informado' : institution.mail1}
                      onChange={(e) => handleChangeInputsInstitution(e)}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={4}
                    sm={4}
                    xl={4}
                  >
                    <TextField
                      fullWidth
                      disabled
                      label="Endereço de email secundário"
                      name="mail2"
                      variant="outlined"
                      value={institution.mail2 === null ? 'Não informado' : institution.mail2}
                      onChange={(e) => handleChangeInputsInstitution(e)}
                    />
                  </Grid>

                  <Divider />

                  <Grid
                    item
                    xs={3}
                    sm={3}
                    xl={3}
                  >
                    <TextField
                      fullWidth
                      disabled
                      label="Telefone 1"
                      name="tel1"
                      variant="outlined"
                      value={institution.tel1 === null ? 'Não informado' : institution.tel1}
                      onChange={(e) => handleChangeInputsInstitution(e)}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={3}
                    sm={3}
                    xl={3}
                  >
                    <TextField
                      fullWidth
                      disabled
                      label="Telefone 2"
                      name="tel2"
                      variant="outlined"
                      value={institution.tel2 === null ? 'Não informado' : institution.tel2}
                      onChange={(e) => handleChangeInputsInstitution(e)}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={3}
                    sm={3}
                    xl={3}
                  >
                    <TextField
                      fullWidth
                      disabled
                      label="Telefone 3"
                      name="tel3"
                      variant="outlined"
                      value={institution.tel3 === null ? 'Não informado' : institution.tel3}
                      onChange={(e) => handleChangeInputsInstitution(e)}
                    />
                  </Grid>

                  <Divider variant="fullWidth" />

                  <Grid
                    item
                    xs={4}
                    sm={4}
                    xl={4}
                  >
                    <TextField
                      fullWidth
                      disabled
                      label="Slogan"
                      name="slogan"
                      variant="outlined"
                      value={institution.slogan === null ? 'Não informado' : institution.slogan}
                      onChange={(e) => handleChangeInputsInstitution(e)}
                    />
                  </Grid>
                </Grid>
              </Box>
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
          <DialogTitle id="alert-dialog-title">Desativar registro da instituição</DialogTitle>
          <Divider />
          <DialogContent className={classes.modalContent}>
            <div className={classes.divIconModal}>
              <DeleteForeverIcon className={classes.modalIcon} />
            </div>
            <DialogContentText id="alert-dialog-description" className={classes.modalContentText}>
              <p>Você realmente deseja deletar este registro? Você pode ativar novamente depois.</p>
            </DialogContentText>
          </DialogContent>
          <Divider />
          <DialogActions>
            <Button
              onClick={() => handleDelete(idInstitution)}
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
