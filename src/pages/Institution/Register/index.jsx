import React, { useEffect, useState, useRef, useContext, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import cep from 'cep-promise';

import { ToastContainer, toast } from 'react-toastify';
import { useTheme } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';
import InputMask from 'react-input-mask';

import {
  Box,
  Container,
  CssBaseline,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Grid,
  TextField,
  Divider,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slide,
  FormHelperText
} from '@material-ui/core';

import {
  ArrowBack,
  Add as AddIcon
} from '@material-ui/icons';

import Menus from '../../../components/Menus';
import Copyright from '../../../components/Copyright';
import api from '../../../services/api';
import history from '../../../services/history';
import getCookie from '../../../utils/functions';
import useStyles from './styles';
import { Context } from '../../../Context/AuthContext';
import LegalPersonModal from './LegalPersonModal';

import 'react-toastify/dist/ReactToastify.css';

const initialStateInstitution = {
  idmatriz: 0,
  idpjur: 0,
  ativo: 0,
  nome: "",
  razsoc: "",
  end: "",
  endnum: "",
  endcompl: "",
  bairro: "",
  cep: "",
  id_municipio: "",
  id_uf: "",
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

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function RegisterInstitution() {
  const classes = useStyles();
  const theme = useTheme();
  const timer = useRef();
  const { handleLogout } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [defaultButton, setDefaultButton] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [institution, setInstitution] = useState(initialStateInstitution);
  const [institutions, setInstitutions] = useState([]);
  const [counties, setCounties] = useState([{}]);
  const [cities, setCities] = useState([{}]);
  const [legalPersons, setLegalPersons] = useState([{}]);
  const [isZipCodeValid, setIsZipCodeValid] = useState(true);
  const [errorMessageZipCode, setErrorMessageZipCode] = useState('');

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
    searchLegalPersons();
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
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    (async () => {
      const csrftoken = getCookie('csrftoken');

      try {
        const { data } = await api.get('/institution', {
          headers: {
            'X-CSRFToken': csrftoken
          }
        });

        setInstitutions(data);
      } catch (err) {
        const { data, status } = err.response;
        toast.error(`${data.detail}`);
        if (status === 401) {
          setTimeout(() => {
            handleLogout();
          }, 4000);
        }
      }
    })();
  }, [handleLogout]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/counties/ufs');
        setCounties(data);
      } catch (err) {
        // const { data } = err.response;
        toast.error('Não foi possível pesquisar os dados dos municípios.');
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/counties/cities/${institution.id_uf}`);
        setCities(data);
      } catch (err) {
        const { data } = err.response;
        console.error(`${data.detail}`);
      }
    })();
  }, [institution.id_uf]);

  useEffect(() => {
    searchLegalPersons();
  }, [handleLogout]);

  async function searchLegalPersons() {
    const csrftoken = getCookie('csrftoken');
    try {
      const { data } = await api.get('/persons/legal', {
        headers: {
          'X-CSRFToken': csrftoken
        }
      });
      setLegalPersons(data);
    } catch (error) {
      const { data } = error.response;
      toast.error(`${data.detail}`);
    }
  }

  function handleChangeInputsInstitution(e) {
    const { name, value } = e.target;
    setInstitution({ ...institution, [name]: value });
  }

  async function handleRegister(e) {
    e.preventDefault();
    const csrftoken = getCookie('csrftoken');

    try {
      await api.post('/institution/create', institution, {
        headers: {
          'X-CSRFToken': csrftoken
        }
      });
      handleButtonClickProgress();
      setTimeout(() => {
        toast.success('Cadastro feito com sucesso!');
      }, 2000);
      setTimeout(() => {
        history.push('/institutions');
      }, 5000);
    } catch (err) {
      const { data } = err.response;
      handleButtonClickProgressError();
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
    }
  }

  function searchZipCode(zipCode) {
    cep(zipCode).then((response) => {
      const { neighborhood, street } = response;

      setInstitution({ ...institution, bairro: neighborhood });
      setInstitution({ ...institution, end: street });

      setIsZipCodeValid(true);
    }).catch((response) => {
      const { message } = response;
      setErrorMessageZipCode(message);
      setIsZipCodeValid(false);
    });
  }

  return (
    <div className={classes.root}>
      <ToastContainer />
      <CssBaseline />
      <Menus title="Cadastro de instituição" />
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
              </Box>
            </CardContent>
          </Card>

          <Card style={{ marginTop: theme.spacing(3) }}>
            <form onSubmit={(e) => handleRegister(e)}>
              <CardContent>
                <Box>
                  <Grid
                    container
                    spacing={3}
                  >
                    <Grid
                      item
                      xs={2}
                      sm={2}
                      xl={2}
                    >
                      <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="select-ativo-label">Ativo</InputLabel>
                        <Select
                          fullWidth
                          labelId="select-ativo-label"
                          id="select-ativo"
                          value={institution.ativo}
                          onChange={(e) => handleChangeInputsInstitution(e)}
                          label="Ativo"
                          name="ativo"
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value={1}>Sim</MenuItem>
                          <MenuItem value={0}>Não</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xs={4}
                      sm={4}
                      xl={4}
                    >
                      <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="select-matriz-label">Selecione a Matriz</InputLabel>
                        <Select
                          fullWidth
                          labelId="select-matriz-label"
                          id="select-matriz"
                          value={institution.idmatriz || 0}
                          onChange={(e) => handleChangeInputsInstitution(e)}
                          label="Selecione a matriz"
                          name="idmatriz"
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value={0}>Esta é a matriz</MenuItem>
                          {
                            institutions.map((instit, index) => (
                              <MenuItem value={instit.id_instituicao} key={index}>{instit.razsoc}</MenuItem>
                            ))
                          }
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xs={5}
                      sm={5}
                      xl={5}
                    >
                      <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="select-idpjur-label">Registro da pessoa</InputLabel>
                        <Select
                          fullWidth
                          labelId="select-idpjur-label"
                          id="select-idpjur"
                          value={institution.idpjur || ""}
                          onChange={(e) => handleChangeInputsInstitution(e)}
                          label="Registro da pessoa"
                          name="idpjur"
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {
                            legalPersons.map((person, index) => (
                              <MenuItem value={person.id_pessoa_cod} key={index}>{person.nomeorrazaosocial}</MenuItem>
                            ))
                          }
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xs={1}
                      xl={1}
                      sm={1}
                    >
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={handleClickOpenModal}
                        color="primary"
                      >
                        <AddIcon />
                      </Button>
                    </Grid>

                    <Grid
                      item
                      xs={6}
                      sm={6}
                      xl={6}
                    >
                      <TextField
                        fullWidth
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
                      <InputMask mask="99.999.999/9999-99" value={institution.cnpj} onChange={(e) => handleChangeInputsInstitution(e)}>
                        <TextField
                          fullWidth
                          label="CNPJ"
                          name="cnpj"
                          variant="outlined"
                        />
                      </InputMask>
                    </Grid>

                    <Grid
                      item
                      xs={4}
                      sm={4}
                      xl={4}
                    >
                      <TextField
                        fullWidth
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
                        label="Inscrição Municipal"
                        name="imun"
                        variant="outlined"
                        value={institution.imun === null ? 'Não informado' : institution.imun}
                        onChange={(e) => handleChangeInputsInstitution(e)}
                      />
                    </Grid>
                  </Grid>

                  <Divider style={{ margin: theme.spacing(3) }} />

                  <Grid
                    container
                    spacing={3}
                  >

                    <Grid
                      item
                      xs={3}
                      sm={3}
                      xl={3}
                    >
                      <InputMask mask="99.999-999" value={institution.cep} onChange={(e) => handleChangeInputsInstitution(e)}>
                        <TextField
                          fullWidth
                          error={!isZipCodeValid}
                          autoComplete="off"
                          label="CEP"
                          name="cep"
                          variant="outlined"
                        />
                      </InputMask>
                      {
                        (!isZipCodeValid) && (
                          <FormHelperText error >{errorMessageZipCode}</FormHelperText>
                        )
                      }
                    </Grid>

                    <Grid
                      item
                      xs={2}
                      sm={2}
                      xl={2}
                    >
                      <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="select-uf-label">UF</InputLabel>
                        <Select
                          fullWidth
                          labelId="select-uf-label"
                          id="select-uf"
                          value={institution.id_uf || ""}
                          onChange={(e) => handleChangeInputsInstitution(e)}
                          label="UF"
                          name="id_uf"
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {
                            counties.map((countie, index) => (
                              <MenuItem key={index} value={countie.id_municipios}>{countie.uf_sigla}</MenuItem>
                            ))
                          }
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xs={4}
                      sm={4}
                      xl={4}
                    >
                      <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="select-cidade-label">Cidade</InputLabel>
                        <Select
                          fullWidth
                          labelId="select-cidade-label"
                          id="select-cidade"
                          value={institution.id_municipio || ""}
                          onChange={(e) => handleChangeInputsInstitution(e)}
                          label="Cidade"
                          name="id_municipio"
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {
                            cities.map((citie, index) => (
                              <MenuItem key={index} value={citie.id_municipios}>{citie.descr}</MenuItem>
                            ))
                          }
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xs={6}
                      sm={6}
                      xl={6}
                    >
                      <TextField
                        fullWidth
                        onFocus={(e) => searchZipCode(institution.cep)}
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
                        label="Bairro"
                        name="bairro"
                        variant="outlined"
                        value={institution.bairro}
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
                        label="Complemento"
                        name="endcompl"
                        variant="outlined"
                        value={institution.endcompl === null ? 'Não informado' : institution.endcompl}
                        onChange={(e) => handleChangeInputsInstitution(e)}
                      />
                    </Grid>
                  </Grid>

                  <Divider style={{ margin: theme.spacing(3) }} />

                  <Grid
                    container
                    spacing={3}
                  >
                    <Grid
                      item
                      xs={4}
                      sm={4}
                      xl={4}
                    >
                      <TextField
                        fullWidth
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
                        label="Endereço de email secundário"
                        name="mail2"
                        variant="outlined"
                        value={institution.mail2 === null ? 'Não informado' : institution.mail2}
                        onChange={(e) => handleChangeInputsInstitution(e)}
                      />
                    </Grid>
                  </Grid>

                  <Divider style={{ margin: theme.spacing(3) }} />

                  <Grid
                    container
                    spacing={3}
                  >
                    <Grid
                      item
                      xs={3}
                      sm={3}
                      xl={3}
                    >
                      <TextField
                        fullWidth
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
                        label="Telefone 3"
                        name="tel3"
                        variant="outlined"
                        value={institution.tel3 === null ? 'Não informado' : institution.tel3}
                        onChange={(e) => handleChangeInputsInstitution(e)}
                      />
                    </Grid>
                  </Grid>

                  <Divider style={{ margin: theme.spacing(3) }} />

                  <Grid
                    container
                    spacing={3}
                  >
                    <Grid
                      item
                      xs={6}
                      sm={6}
                      xl={6}
                    >
                      <TextField
                        fullWidth
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
              <Divider />
              <CardActions
                style={{ padding: theme.spacing(2) }}
              >
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    item
                    xs={12}
                    xl={12}
                    sm={12}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      className={buttonClassname}
                      disabled={loading}
                    >
                      {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                      Salvar
                    </Button>
                  </Grid>
                </Grid>
              </CardActions>
            </form>

          </Card>
        </Container>

        <Box pt={4}>
          <Copyright />
        </Box>

        <Dialog fullScreen open={openModal} onClose={handleCloseModal} TransitionComponent={Transition}>
          <DialogTitle style={{ background: blue[900] }}>
            <Button autoFocus color="secondary" variant="contained" onClick={handleCloseModal}>
              Fechar
            </Button>
          </DialogTitle>
          <DialogContent dividers style={{ padding: '0' }}>
            <LegalPersonModal />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
