import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useTheme } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { orange, red } from '@material-ui/core/colors';
import {
  Box,
  Container,
  CssBaseline,
  Card,
  CardContent,
  IconButton,
  Grid,
  TextField,
  AppBar,
  Tabs,
  Tab,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  CircularProgress,
  Button
} from '@material-ui/core';
import {
  ArrowBack,
  Edit,
  Delete,
  DeleteForever as DeleteForeverIcon
} from '@material-ui/icons';
import SwipeableViews from 'react-swipeable-views';

import Menus from '../../../components/Menus';
import Copyright from '../../../components/Copyright';
import api from '../../../services/api';
import history from '../../../services/history';
import getCookie from '../../../utils/functions';
import useStyles from './styles';

import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';

const initialStatePerson = {
  id_pessoa_cod: 0,
  id_instituicao_fk: 0,
  tipo: 1,
  sit: 2,
  forn: 0,
  cpfcnpj: "",
  nomeorrazaosocial: "",
  foto: "",
  img_bites: 0,
  limite: "",
  saldo: ""
}

const initialStatePhysicalPerson = {
  id_pessoa_fisica: 0,
  id_pessoa_cod_fk: 0,
  identidade: "",
  emissor_identidade: "",
  id_municipio_fk: "",
  id_uf_municipio_fk: "",
  data_de_nascimento: "",
  tratam: 0,
  apelido: "",
  sexo: "",
  pai: "",
  mae: "",
  profissao: "",
  ctps: "",
  salario: "",
  empresa: "",
  resp: "",
  cnpj: "",
  iest: "",
  imun: "",
  emprend: "",
  orendas: "",
  vrendas: "",
  irpf: 0,
  estcivil: "",
  depend: 0,
  pensao: "",
  conjuge: "",
  cpfconj: "",
  profconj: "",
  emprconj: "",
  rendaconj: "",
  telconj: "",
  mailconj: "",
  data_criacao: "",
  data_atualizacao: ""
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3} bgcolor="white" borderTop="1px solid #c7c7c7" >
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


export default function PhysicalPersonDetails(props) {
  const classes = useStyles();
  const theme = useTheme();
  const timer = useRef();
  const idPerson = props.match.params.id;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [defaultButton, setDefaultButton] = useState(false);
  const [valueTab, setValueTab] = useState(0);
  const [bankingReferences, setBankingReferences] = useState([{}]);
  const [person, setPerson] = useState(initialStatePerson);
  const [personAddress, setPersonAddress] = useState([{}]);
  const [personMail, setPersonMail] = useState([{}]);
  const [personPhone, setPersonPhone] = useState([{}]);
  const [physicalPerson, setPhysicalPerson] = useState(initialStatePhysicalPerson);
  const [personReferences, setPersonReferences] = useState([{}]);
  const [registeredBanks, setRegisteredBanks] = useState([]);
  const [counties, setCounties] = useState([{}]);
  const [openModal, setOpenModal] = useState(false);
  const [userPermissions, setUserPermissions] = useState([]);

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
    [classes.buttonError]: error,
    [classes.buttonDefault]: defaultButton
  });

  const handleChangeTab = (event, newValue) => {
    setValueTab(newValue);
  };

  const handleChangeIndex = (index) => {
    setValueTab(index);
  };

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
    const csrfToken = getCookie('csrftoken');

    (async () => {
      try {
        const { data } = await api.get(`/persons/physical/details/${idPerson}`, {
          headers: {
            'X-CSRFToken': csrfToken
          }
        });
        setPerson(data.person);
        setPhysicalPerson(data.personPhysical);
        setBankingReferences(data.bankingReferences);
        setPersonAddress(data.personAdress);
        setPersonMail(data.personMail);
        setPersonPhone(data.personPhone);
        setPersonReferences(data.personReferences);
      } catch (err) {
        // const { data } = err.response;
        toast.error('Não foi possível carregar os dados do registro.');
      }
    })();
  }, [idPerson]);

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    (async function () {
      try {
        const { data } = await api.get('/banking');
        setRegisteredBanks(data);
      } catch (err) {
        // const { data } = err.response;
        toast.error('Não foi possível selecionar os bancos pré cadastrados.');
        // console.log(data.datail);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/counties');
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
        const { data } = await api.get('/users/access');
        setUserPermissions(data.acess.split(''));
      } catch (err) {
        const { data } = err.response;
        toast.error(data.detail);
      }
    })();
  }, []);


  function handleChangeInputsPerson(e) {
    const { name, value } = e.target;
    setPerson({ ...person, [name]: value });
  }

  function handleChangeInputsPhysicalPerson(e) {
    const { name, value } = e.target;
    setPhysicalPerson({ ...physicalPerson, [name]: value });
  }

  function handleChangeInputsAddress(e) {
    const { name, value } = e.target;
    setPersonAddress([{ ...personAddress, [name]: value }]);
  }

  function handleChangeInputsPhone(e) {
    const { name, value } = e.target;
    setPersonPhone([{ ...personPhone, [name]: value }]);
  }

  function handleChangeInputsMails(e) {
    const { name, value } = e.target;
    setPersonMail([{ ...personMail, [name]: value }]);
  }

  function handleChangeInputsReferences(e) {
    const { name, value } = e.target;
    setPersonReferences([{ ...personReferences, [name]: value }]);
  }

  function handleChangeInputsBankingReferences(e) {
    const { name, value } = e.target;
    setBankingReferences([{ ...bankingReferences, [name]: value }]);
  }

  async function handleDeletePerson(id) {
    const csrftoken = getCookie('csrftoken');

    try {
      await api.put(`/persons/delete/${id}`, {
        headers: {
          'X-CSRFToken': csrftoken
        }
      });
      handleButtonClickProgress();
      setTimeout(() => {
        toast.success('Registro da pessoa deletado com sucesso!');
      }, 2000);
      setTimeout(() => {
        handleCloseModal();
        history.push('/physical/persons');
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
      <Menus title="Detalhes da pessoa" />
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
                <Link to="/physical/persons/" className="link">
                  <Tooltip title="Voltar" arrow>
                    <IconButton>
                      <ArrowBack />
                    </IconButton>
                  </Tooltip>
                </Link>

                {
                  userPermissions[1] === '1' && (
                    <Link to={`/physical/person/edit/${idPerson}`} className="link" >
                      <Tooltip title="Editar" arrow>
                        <IconButton >
                          <Edit style={{ color: orange[300] }} />
                        </IconButton>
                      </Tooltip>
                    </Link>
                  )
                }

                {
                  userPermissions[134] === '1' && (
                    <Tooltip title="Deletar" arrow>
                      <IconButton onClick={() => handleClickOpenModal()} aria-label="Deletar">
                        <Delete style={{ color: red[300] }} />
                      </IconButton>
                    </Tooltip>
                  )
                }
              </Box>
            </CardContent>
          </Card>

          <div className={classes.tabArea}>
            <AppBar position="static" color="default">
              <Tabs
                value={valueTab}
                onChange={handleChangeTab}
                aria-label="simple tabs example"
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Dados pessoais" {...a11yProps(0)} />
                <Tab label="Dados profissionais" {...a11yProps(1)} />
                <Tab label="Estado civil" {...a11yProps(2)} />
                <Tab label="Endereço" {...a11yProps(3)} />
                <Tab label="Contatos" {...a11yProps(4)} />
                <Tab label="Referências" {...a11yProps(5)} />
                <Tab label="Dados bancários" {...a11yProps(6)} />
                <Tab label="Financeiro" {...a11yProps(7)} />
                <Tab label="Opções" {...a11yProps(8)} />
              </Tabs>
            </AppBar>
            <SwipeableViews
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={valueTab}
              onChangeIndex={handleChangeIndex}
            >
              {/* DADOS PESSOAIS */}
              <TabPanel value={valueTab} index={0}>
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    item
                    xs={9}
                    sm={9}
                    xl={9}
                  >
                    <TextField
                      fullWidth
                      required
                      label="Nome"
                      name="nomeorrazaosocial"
                      variant="outlined"
                      value={person.nomeorrazaosocial}
                      onChange={(e) => handleChangeInputsPerson(e)}
                      disabled
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
                      required
                      label="CPF"
                      name="cpfcnpj"
                      variant="outlined"
                      value={person.cpfcnpj}
                      onChange={(e) => handleChangeInputsPerson(e)}
                      disabled
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
                      label="Identidade"
                      name="identidade"
                      variant="outlined"
                      value={physicalPerson.identidade === null ? 'Não informado' : physicalPerson.identidade}
                      onChange={(e) => handleChangeInputsPhysicalPerson(e)}
                      disabled
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
                      required
                      label="Órgão Emissor"
                      name="emissor_identidade"
                      variant="outlined"
                      value={physicalPerson.emissor_identidade === null ? 'Não informado' : physicalPerson.emissor_identidade}
                      onChange={(e) => handleChangeInputsPhysicalPerson(e)}
                      disabled
                    />
                  </Grid>

                  <Grid
                    item
                    xs={3}
                    sm={3}
                    xl={3}
                  >
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel id="select-orgao-emissor-label">Órgão Emissor/UF</InputLabel>
                      <Select
                        fullWidth
                        labelId="select-orgao-emissor-label"
                        id="select-orgao-emissor"
                        value={physicalPerson.id_uf_municipio_fk}
                        onChange={(e) => handleChangeInputsPhysicalPerson(e)}
                        label="Órgão Emissor/UF"
                        disabled
                        name="id_uf_municipio_fk"
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
                    xs={3}
                    sm={3}
                    xl={3}
                  >
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel id="select-sexo-label">Sexo</InputLabel>
                      <Select
                        labelId="select-sexo-label"
                        id="select-sexo"
                        value={physicalPerson.sexo}
                        onChange={(e) => handleChangeInputsPhysicalPerson(e)}
                        label="Sexo"
                        disabled
                        name="sexo"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value="Masculino">Masculino</MenuItem>
                        <MenuItem value="Feminino">Feminino</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    xs={3}
                    sm={3}
                    xl={3}
                  >
                    <TextField
                      fullWidth
                      required
                      type="date"
                      label="Data de nascimento"
                      name="data_de_nascimento"
                      variant="outlined"
                      value={physicalPerson.data_de_nascimento}
                      onChange={(e) => handleChangeInputsPhysicalPerson(e)}
                      disabled
                    />
                  </Grid>

                  <Grid
                    item
                    xs={3}
                    sm={3}
                    xl={3}
                  >
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel id="select-naturalidade-label">Naturalidade</InputLabel>
                      <Select
                        labelId="select-naturalidade-label"
                        id="select-naturalidade"
                        value={physicalPerson.id_municipio_fk}
                        onChange={(e) => handleChangeInputsPhysicalPerson(e)}
                        label="Naturalidade"
                        disabled
                        name="id_municipio_fk"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {
                          counties.map((countie, index) => (
                            <MenuItem key={index} value={countie.id_municipios}>{countie.descr}</MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    xs={3}
                    sm={3}
                    xl={3}
                  >
                    <TextField
                      fullWidth
                      required
                      label="Apelido"
                      name="apelido"
                      variant="outlined"
                      value={physicalPerson.apelido}
                      onChange={(e) => handleChangeInputsPhysicalPerson(e)}
                      disabled
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
                      required
                      label="Nome do pai"
                      name="pai"
                      variant="outlined"
                      value={physicalPerson.pai === null ? 'Não informado' : physicalPerson.pai}
                      onChange={(e) => handleChangeInputsPhysicalPerson(e)}
                      disabled
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
                      required
                      label="Nome da mãe"
                      name="mae"
                      variant="outlined"
                      value={physicalPerson.mae === null ? 'Não informado' : physicalPerson.mae}
                      onChange={(e) => handleChangeInputsPhysicalPerson(e)}
                      disabled
                    />
                  </Grid>
                </Grid>
              </TabPanel>
              {/* DADOS PROFISSIONAIS */}
              <TabPanel value={valueTab} index={1}>
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
                      label="Profissão"
                      name="profissao"
                      variant="outlined"
                      value={physicalPerson.profissao === null ? 'Não informado' : physicalPerson.profissao}
                      onChange={(e) => handleChangeInputsPhysicalPerson(e)}
                      disabled
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
                      label="CTPS"
                      name="ctps"
                      variant="outlined"
                      value={physicalPerson.ctps === null ? 'Não informado' : physicalPerson.ctps}
                      onChange={(e) => handleChangeInputsPhysicalPerson(e)}
                      disabled
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
                      required
                      label="Salário"
                      name="salario"
                      variant="outlined"
                      value={physicalPerson.salario === null ? 'Não informado' : physicalPerson.salario}
                      onChange={(e) => handleChangeInputsPhysicalPerson(e)}
                      disabled
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
                      required
                      label="Nome da empresa"
                      name="empresa"
                      variant="outlined"
                      value={physicalPerson.empresa === null ? 'Não informado' : physicalPerson.empresa}
                      onChange={(e) => handleChangeInputsPhysicalPerson(e)}
                      disabled
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
                      required
                      label="Reponsável empresa"
                      name="resp"
                      variant="outlined"
                      value={physicalPerson.resp === null ? 'Não informado' : physicalPerson.resp}
                      onChange={(e) => handleChangeInputsPhysicalPerson(e)}
                      disabled
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
                      required
                      label="CNPJ"
                      name="cnpj"
                      variant="outlined"
                      value={physicalPerson.cnpj === null ? 'Não informado' : physicalPerson.cnpj}
                      onChange={(e) => handleChangeInputsPhysicalPerson(e)}
                      disabled
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
                      required
                      label="Inscrição Municipal"
                      name="imun"
                      variant="outlined"
                      value={physicalPerson.imun === null ? 'Não informado' : physicalPerson.imun}
                      onChange={(e) => handleChangeInputsPhysicalPerson(e)}
                      disabled
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
                      required
                      label="Inscrição Estadual"
                      name="iest"
                      variant="outlined"
                      value={physicalPerson.iest === null ? 'Não informado' : physicalPerson.iest}
                      onChange={(e) => handleChangeInputsPhysicalPerson(e)}
                      disabled
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
                      required
                      label="Endereço da empresa"
                      name="emprend"
                      variant="outlined"
                      value={physicalPerson.emprend === null ? 'Não informado' : physicalPerson.emprend}
                      onChange={(e) => handleChangeInputsPhysicalPerson(e)}
                      disabled
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
                      required
                      label="Outras rendas"
                      name="orendas"
                      variant="outlined"
                      value={physicalPerson.orendas === null ? 'Não informado' : physicalPerson.orendas}
                      onChange={(e) => handleChangeInputsPhysicalPerson(e)}
                      disabled
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
                      required
                      label="Valor rendas"
                      name="vrendas"
                      variant="outlined"
                      value={physicalPerson.vrendas === null ? 'Não informado' : physicalPerson.vrendas}
                      onChange={(e) => handleChangeInputsPhysicalPerson(e)}
                      disabled
                    />
                  </Grid>

                  <Grid
                    item
                    xs={2}
                    sm={2}
                    xl={2}
                  >
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel id="select-irpf-label">Declara IRPF</InputLabel>
                      <Select
                        labelId="select-irpf-label"
                        id="select-irpf"
                        value={physicalPerson.irpf}
                        onChange={(e) => handleChangeInputsPhysicalPerson(e)}
                        label="Declara IRPF"
                        disabled
                        name="rpf"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={1}>Sim</MenuItem>
                        <MenuItem value={0}>Não</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </TabPanel>
              {/* ESTADO CIVIL */}
              <TabPanel value={valueTab} index={2} >
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    item
                    xl={3}
                    xs={3}
                    sm={3}
                  >
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel id="select-estcivil-label">Estado Civil</InputLabel>
                      <Select
                        labelId="select-estcivil-label"
                        id="select-estcivil"
                        value={physicalPerson.estcivil}
                        onChange={(e) => handleChangeInputsPhysicalPerson(e)}
                        label="Estado Civil"
                        disabled
                        name="estcivil"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={1}>Solteiro(a)</MenuItem>
                        <MenuItem value={2}>Casado(a)</MenuItem>
                        <MenuItem value={2}>Divorciado(a)</MenuItem>
                        <MenuItem value={2}>Viúvo(a)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={3}
                  style={{ marginTop: '20px' }}
                >
                  <Grid
                    item
                    xl={8}
                    xs={8}
                    sm={8}
                  >
                    <TextField
                      fullWidth
                      disabled
                      name="conjuge"
                      label="Nome do cônjugue"
                      variant="outlined"
                      value={physicalPerson.conjuge === null ? 'Não informado' : physicalPerson.conjuge}
                      onChange={(e) => handleChangeInputsPhysicalPerson(e)}
                    />
                  </Grid>

                  <Grid
                    item
                    xl={2}
                    xs={2}
                    sm={2}
                  >
                    <TextField
                      fullWidth
                      disabled
                      name="depend"
                      label="Núm. de dependentes"
                      variant="outlined"
                      type="number"
                      value={physicalPerson.depend === null ? 'Não informado' : physicalPerson.depend}
                      onChange={(e) => handleChangeInputsPhysicalPerson(e)}
                    />
                  </Grid>

                  <Grid
                    item
                    xl={2}
                    xs={2}
                    sm={2}
                  >
                    <TextField
                      fullWidth
                      disabled
                      name="pensao"
                      label="Pensão"
                      variant="outlined"
                      value={physicalPerson.pensao}
                      onChange={(e) => handleChangeInputsPhysicalPerson(e)}
                    />
                  </Grid>

                  <Grid
                    item
                    xl={3}
                    xs={3}
                    sm={3}
                  >
                    <TextField
                      fullWidth
                      disabled
                      name="cpfconj"
                      label="CPF do cônjugue"
                      variant="outlined"
                      value={physicalPerson.cpfconj === null ? 'Não informado' : physicalPerson.cpfconj}
                      onChange={(e) => handleChangeInputsPhysicalPerson(e)}
                    />
                  </Grid>

                  <Grid
                    item
                    xl={3}
                    xs={3}
                    sm={3}
                  >
                    <TextField
                      fullWidth
                      disabled
                      name="telconj"
                      label="Telefone do cônjugue"
                      variant="outlined"
                      value={physicalPerson.telconj === null ? 'Não informado' : physicalPerson.telconj}
                      onChange={(e) => handleChangeInputsPhysicalPerson(e)}
                    />
                  </Grid>

                  <Grid
                    item
                    xl={3}
                    xs={3}
                    sm={3}
                  >
                    <TextField
                      fullWidth
                      disabled
                      name="mailconj"
                      label="E-mail do cônjugue"
                      variant="outlined"
                      value={physicalPerson.mailconj === null ? 'Não informado' : physicalPerson.mailconj}
                      onChange={(e) => handleChangeInputsPhysicalPerson(e)}
                    />
                  </Grid>

                  <Grid
                    item
                    xl={3}
                    xs={3}
                    sm={3}
                  >
                    <TextField
                      fullWidth
                      disabled
                      name="rendaconj"
                      label="Renda do cônjugue"
                      variant="outlined"
                      value={physicalPerson.rendaconj}
                      onChange={(e) => handleChangeInputsPhysicalPerson(e)}
                    />
                  </Grid>

                  <Grid
                    item
                    xl={6}
                    xs={6}
                    sm={6}
                  >
                    <TextField
                      fullWidth
                      disabled
                      name="profconj"
                      label="Profissão do cônjugue"
                      variant="outlined"
                      value={physicalPerson.profconj === null ? 'Não informado' : physicalPerson.profconj}
                      onChange={(e) => handleChangeInputsPhysicalPerson(e)}
                    />
                  </Grid>

                  <Grid
                    item
                    xl={6}
                    xs={6}
                    sm={6}
                  >
                    <TextField
                      fullWidth
                      disabled
                      name="emprconj"
                      label="Empresa do cônjugue"
                      variant="outlined"
                      value={physicalPerson.emprconj === null ? 'Não informado' : physicalPerson.emprconj}
                      onChange={(e) => handleChangeInputsPhysicalPerson(e)}
                    />
                  </Grid>
                </Grid>
              </TabPanel>
              {/* ENDEREÇOS */}
              <TabPanel value={valueTab} index={3}>
                {
                  personAddress.length === 0 && (
                    <Typography component="h3" align="center" color="textSecondary">
                      Este registro não contém informações de endereço.
                    </Typography>
                  )
                }
                {
                  personAddress.map((address, index) => (
                    <Typography component="div" key={index}>
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
                            disabled
                            required
                            label="CEP"
                            name="cep"
                            variant="outlined"
                            value={address.cep}
                            onChange={(e) => handleChangeInputsAddress(e)}
                          />
                        </Grid>
                      </Grid>
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
                            disabled
                            required
                            label="Rua"
                            name="rua"
                            variant="outlined"
                            value={address.rua}
                            onChange={(e) => handleChangeInputsAddress(e)}
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
                            required
                            label="Bairro"
                            name="bairro"
                            variant="outlined"
                            value={address.bairro}
                            onChange={(e) => handleChangeInputsAddress(e)}
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
                            required
                            label="Número"
                            name="numero"
                            variant="outlined"
                            value={address.numero}
                            onChange={(e) => handleChangeInputsAddress(e)}
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
                            required
                            label="Complemento"
                            name="complemento"
                            variant="outlined"
                            value={address.complemento === null ? 'Não informado' : address.complemento}
                            onChange={(e) => handleChangeInputsAddress(e)}
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
                            required
                            label="Cidade"
                            name="cidade"
                            variant="outlined"
                            value={address.cidade}
                            onChange={(e) => handleChangeInputsAddress(e)}
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
                            required
                            label="Estado"
                            name="estado_endereco"
                            variant="outlined"
                            value={address.estado_endereco}
                            onChange={(e) => handleChangeInputsAddress(e)}
                          />
                        </Grid>
                      </Grid>
                      <Divider className={classes.divider} />
                    </Typography>
                  ))
                }

              </TabPanel>
              {/* CONTATOS */}
              <TabPanel value={valueTab} index={4}>
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    item
                    xs={5}
                    xl={5}
                    sm={5}
                  >
                    <Typography component="div" className={classes.containerInput}>
                      <p>Telefones</p>
                      {
                        personPhone.length === 0 && (
                          <Typography component="h3" align="center" color="textSecondary">
                            Este registro não contém informações sobre telefones
                          </Typography>
                        )
                      }
                      {
                        personPhone.map((phone, index) => (
                          <Typography component="div" key={index}>
                            <Grid
                              container
                              spacing={3}
                            >
                              <Grid
                                item
                                xs={8}
                                sm={8}
                                xl={8}
                              >
                                <TextField
                                  fullWidth
                                  disabled
                                  required
                                  label="Telefone"
                                  name="tel"
                                  variant="outlined"
                                  value={phone.tel}
                                  onChange={(e) => handleChangeInputsPhone(e)}
                                />
                              </Grid>
                            </Grid>
                            <Divider className={classes.divider} />
                          </Typography>
                        ))
                      }
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xl={2}
                    xs={2}
                    sm={2}
                  >
                    <Divider className={classes.dividerVertical} orientation="vertical" />
                  </Grid>
                  <Grid
                    item
                    xs={5}
                    xl={5}
                    sm={5}
                  >
                    <Typography component="div" className={classes.containerInput}>
                      <p>E-mails</p>
                      {
                        personMail.length === 0 && (
                          <Typography component="h3" align="center" color="textSecondary">
                            Este registro não contém informações sobre email
                          </Typography>
                        )
                      }
                      {
                        personMail.map((mail, index) => (
                          <Typography component="div" key={index}>
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
                                <TextField
                                  fullWidth
                                  disabled
                                  required
                                  label="E-mail"
                                  name="email"
                                  variant="outlined"
                                  value={mail.email}
                                  onChange={(e) => handleChangeInputsMails(e)}
                                />
                              </Grid>
                            </Grid>
                            <Divider className={classes.divider} />
                          </Typography>
                        ))
                      }
                    </Typography>
                  </Grid>
                </Grid>
              </TabPanel>
              {/* REFERÊNCIAS */}
              <TabPanel value={valueTab} index={5}>
                {
                  personReferences.length === 0 && (
                    <Typography component="h3" align="center" color="textSecondary">
                      Este registro não contém informações sobre referências
                    </Typography>
                  )
                }
                {
                  personReferences.map((reference, index) => (
                    <Typography
                      component="div"
                      key={index}
                    >
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
                            disabled
                            required
                            label="Nome"
                            name="nome"
                            variant="outlined"
                            value={reference.nome}
                            onChange={(e) => handleChangeInputsReferences(e)}
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
                            required
                            label="Tipo"
                            name="tipo"
                            variant="outlined"
                            value={reference.tipo}
                            onChange={(e) => handleChangeInputsReferences(e)}
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
                            required
                            label="Telefone"
                            name="tel"
                            variant="outlined"
                            value={reference.tel}
                            onChange={(e) => handleChangeInputsReferences(e)}
                          />
                        </Grid>

                        <Grid
                          item
                          xs={8}
                          sm={8}
                          xl={8}
                        >
                          <TextField
                            fullWidth
                            disabled
                            required
                            label="Endereço"
                            name="endereco"
                            variant="outlined"
                            value={reference.endereco}
                            onChange={(e) => handleChangeInputsReferences(e)}
                          />
                        </Grid>
                      </Grid>
                      <Divider className={classes.divider} />
                    </Typography>
                  ))
                }

              </TabPanel>
              {/* DADOS BANCÁRIOS */}
              <TabPanel value={valueTab} index={6}>
                {
                  bankingReferences.length === 0 && (
                    <Typography component="h3" align="center" color="textSecondary">
                      Este registro não contém informações bancárias
                    </Typography>
                  )
                }
                {
                  bankingReferences.map((banking, index) => (
                    <Typography component="div" key={index}>
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

                          {
                            registeredBanks.map((bank) => (
                              bank.id_bancos === banking.id_bancos_fk && (
                                <TextField
                                  key={bank.id_bancos}
                                  fullWidth
                                  disabled
                                  required
                                  label="Banco"
                                  name="id_bancos_fk"
                                  variant="outlined"
                                  value={bank.banco}
                                  onChange={(e) => handleChangeInputsBankingReferences(e)}
                                />
                              )
                            ))
                          }
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
                            required
                            label="Tipo"
                            name="tipo"
                            variant="outlined"
                            value={banking.tipo}
                            onChange={(e) => handleChangeInputsBankingReferences(e)}
                          />
                        </Grid>
                      </Grid>

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
                            disabled
                            required
                            label="Conta"
                            name="conta"
                            variant="outlined"
                            value={banking.conta}
                            onChange={(e) => handleChangeInputsBankingReferences(e)}
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
                            required
                            label="Agência"
                            name="agencia"
                            variant="outlined"
                            value={banking.agencia}
                            onChange={(e) => handleChangeInputsBankingReferences(e)}
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
                            required
                            type="date"
                            label="Abertura"
                            name="abertura"
                            variant="outlined"
                            value={moment(banking.abertura).format('YYYY-MM-DD')}
                            onChange={(e) => handleChangeInputsBankingReferences(e)}
                          />
                        </Grid>
                      </Grid>
                      <Divider className={classes.divider} />
                    </Typography>
                  ))
                }
              </TabPanel>
              {/* FINANCEIRO */}
              <TabPanel value={valueTab} index={7}>
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
                      disabled
                      label="Limite"
                      name="limite"
                      variant="outlined"
                      value={person.limite}
                      onChange={(e) => handleChangeInputsPerson(e)}
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
                      label="Saldo"
                      name="saldo"
                      variant="outlined"
                      value={person.saldo}
                      onChange={(e) => handleChangeInputsPerson(e)}
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
                      label="Capital"
                      name="capsocial"
                      variant="outlined"
                      value={physicalPerson.capsocial}
                      onChange={(e) => handleChangeInputsPhysicalPerson(e)}
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
                      label="Receitas"
                      name="faturamento"
                      variant="outlined"
                      value={physicalPerson.faturamento}
                      onChange={(e) => handleChangeInputsPhysicalPerson(e)}
                    />
                  </Grid>
                </Grid>
              </TabPanel>
              {/* OPÇÕES */}
              <TabPanel value={valueTab} index={8}>
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
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel id="select-provider-label">Fornecedor</InputLabel>
                      <Select
                        labelId="select-provider-label"
                        id="select-provider"
                        value={person.forn}
                        onChange={(e) => handleChangeInputsPerson(e)}
                        label="Fornecedor"
                        disabled
                        name="forn"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={1}>Sim</MenuItem>
                        <MenuItem value={0}>Não</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </TabPanel>
            </SwipeableViews>
          </div>
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
          <DialogTitle id="alert-dialog-title">Deletar registro de pessoa</DialogTitle>
          <Divider />
          <DialogContent className={classes.modalContent}>
            <div className={classes.divIconModal}>
              <DeleteForeverIcon className={classes.modalIcon} />
            </div>
            <DialogContentText id="alert-dialog-description" className={classes.modalContentText}>
              <p>Você realmente deseja deletar este registro? Esta operação não pode ser desfeita.</p>
            </DialogContentText>
          </DialogContent>
          <Divider />
          <DialogActions>
            <Button
              onClick={() => handleDeletePerson(idPerson)}
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
