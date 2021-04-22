import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
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
  Button,
  CircularProgress,
  Tooltip,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  FormHelperText,
  OutlinedInput,
  InputAdornment
} from '@material-ui/core';

import Autocomplete from '@material-ui/lab/Autocomplete';
import { ArrowBack, Delete } from '@material-ui/icons';
import SwipeableViews from 'react-swipeable-views';
import InputMask from 'react-input-mask';
import cep from 'cep-promise';
import moment from 'moment';
import { v4 as uuidV4 } from 'uuid';

import Menus from '../../../components/Menus';
import Copyright from '../../../components/Copyright';
import api from '../../../services/api';
import history from '../../../services/history';
import getCookie from '../../../utils/functions';
import useStyles from './styles';

import 'react-toastify/dist/ReactToastify.css';

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
  id_municipio_fk: 0,
  id_uf_municipio_fk: 0,
  data_de_nascimento: moment().format('YYYY-MM-DD'),
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


export default function RegisterPhysicalPerson(props) {
  const classes = useStyles();
  const theme = useTheme();
  const timer = useRef();

  // SUCCESS AND ERRORS BUTTONS STATES
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  // PERSON STATE
  const [valueTab, setValueTab] = useState(0);
  const [bankingReferences, setBankingReferences] = useState([]);
  const [bankingReferenceId, setBankingReferenceId] = useState(0);
  const [person, setPerson] = useState(initialStatePerson);
  const [personAddress, setPersonAddress] = useState([]);
  const [addressId, setAddressId] = useState(0);
  const [personMail, setPersonMail] = useState([]);
  const [personMailId, setPersonMailId] = useState(0);
  const [personPhone, setPersonPhone] = useState([]);
  const [phoneId, setPhoneId] = useState(0);
  const [physicalPerson, setPhysicalPerson] = useState(initialStatePhysicalPerson);
  const [personReferences, setPersonReferences] = useState([]);
  const [personReferenceId, setPersonReferenceId] = useState(0);
  const [isZipCodeValid, setIsZipCodeValid] = useState(true);
  const [registeredBanks, setRegisteredBanks] = useState([]);
  const [errorMessageZipCode, setErrorMessageZipCode] = useState('');
  const [counties, setCounties] = useState([{}]);
  const [ufs, setUfs] = useState([{}]);

  // MODALS STATES
  const [openModalRemovePhone, setOpenModalRemovePhone] = useState(false);
  const [openModalRemoveAddress, setOpenModalRemoveAddress] = useState(false);
  const [openModalRemoveMail, setOpenModalRemoveMail] = useState(false);
  const [openModalRemoveReference, setOpenModalRemoveReference] = useState(false);
  const [openModalRemoveBankingReference, setOpenModalRemoveBankingReference] = useState(false);

  const buttonClassName = clsx({
    [classes.buttonSuccess]: success,
    [classes.buttonError]: error,
  });

  const handleChangeTab = (event, newValue) => {
    setValueTab(newValue);
  };

  const handleChangeIndex = (index) => {
    setValueTab(index);
  };


  const handleClickOpenModalRemovePhone = (id) => {
    setOpenModalRemovePhone(true);
    setPhoneId(id);
  };

  const handleCloseModaRemovePhone = () => {
    setOpenModalRemovePhone(false);
  };

  const handleClickOpenModalRemoveMail = (id) => {
    setOpenModalRemoveMail(true);
    setPersonMailId(id);
  };

  const handleCloseModalRemoveMail = () => {
    setOpenModalRemoveMail(false);
  };

  const handleClickOpenModalRemoveReference = (id) => {
    setOpenModalRemoveReference(true);
    setPersonReferenceId(id);
  };

  const handleCloseModalRemoveReference = () => {
    setOpenModalRemoveReference(false);
  };

  const handleClickOpenModalRemoveBankingReference = (id) => {
    setOpenModalRemoveBankingReference(true);
    setBankingReferenceId(id);
  };

  const handleCloseModalRemoveBankingReference = () => {
    setOpenModalRemoveBankingReference(false);
  };

  const handleClickOpenModalRemoveAddress = (id) => {
    setOpenModalRemoveAddress(true);
    setAddressId(id);
  };

  const handleCloseModalRemoveAddress = () => {
    setOpenModalRemoveAddress(false);
  };

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
        const { data } = await api.get('/counties/ufs');
        setUfs(data);
      } catch (err) {
        toast.error('Não foi possível pesquisar as UFs');
      }
    })();
  }, [counties]);

  function handleChangeInputsPerson(e) {
    const { name, value } = e.target;
    setPerson({ ...person, [name]: value });
  }

  function handleChangeInputsPhysicalPerson(e) {
    const { name, value } = e.target;
    setPhysicalPerson({ ...physicalPerson, [name]: value });
  }

  function handleChangeInputsAddress(e, position) {
    const { name, value } = e.target;
    const updatedPersonAddress = personAddress.map((addressValue, index) => {
      if (index === position) {
        return { ...addressValue, [name]: value }
      }
      return addressValue;
    });
    setPersonAddress(updatedPersonAddress);
  }

  function handleChangeInputsPhone(e, position) {
    const { name, value } = e.target;
    const updatedPersonPhone = personPhone.map((phone, index) => {
      if (index === position) {
        return { ...phone, [name]: value }
      }
      return phone;
    });
    setPersonPhone(updatedPersonPhone);
  }

  function handleChangeInputsMails(e, position) {
    const { name, value } = e.target;
    const updatedPersonMail = personMail.map((mail, index) => {
      if (index === position) {
        return { ...mail, [name]: value }
      }
      return mail;
    });
    setPersonMail(updatedPersonMail);
  }

  function handleChangeInputsReferences(e, position) {
    const { name, value } = e.target;
    const updatedPersonReferences = personReferences.map((reference, index) => {
      if (index === position) {
        return { ...reference, [name]: value }
      }
      return reference;
    });
    setPersonReferences(updatedPersonReferences);
  }

  function handleChangeInputsBankingReferences(e, position) {
    const { name, value } = e.target;
    const updatedBankingReference = bankingReferences.map((banking, index) => {
      if (index === position) {
        return { ...banking, [name]: value }
      }
      return banking;
    });
    setBankingReferences(updatedBankingReference);
  }

  // FUNCTIONS FOR THE ADD PERSON DATA
  function handleAddNewPhone() {
    setPersonPhone([
      ...personPhone,
      { id: uuidV4(), phoneNumber: '' }
    ]);
  }

  function handleAddNewAddress() {
    setPersonAddress([
      ...personAddress,
      {
        id: uuidV4(),
        origin: 1,
        street: "",
        numberHouse: "",
        complement: "",
        neighborhood: "",
        zipCode: "",
        city: "",
        state: ""
      }
    ]);
  }

  function handleAddNewMail() {
    setPersonMail([
      ...personMail,
      { id: uuidV4(), userMail: '' }
    ]);
  }

  function handleAddNewReference() {
    setPersonReferences([
      ...personReferences,
      {
        id: uuidV4(),
        referenceSituation: 1,
        referenceType: "",
        referenceName: "",
        referencePhone: "",
        referenceAdress: ""
      }
    ]);
  }

  function handleAddNewBankingReference() {
    setBankingReferences([
      ...bankingReferences,
      {
        id: uuidV4(),
        idBanking: '',
        situation: 1,
        agency: "",
        account: "",
        opening: moment().format('YYYY-MM-DD'),
        type: ""
      }
    ]);
  }

  // ----------------- FUNCTIONS FOR THE BUTTONS ANIMATIONS -----------------
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

  // ----------------- FUNCTIONS FOR THE BUTTONS ANIMATIONS -----------------

  // ----------------- REMOVE PERSON DATA -----------------
  function handleRemoveAddress(index) {
    const newArrayAddresses = personAddress.filter((address) => address.id !== index);

    setPersonAddress(newArrayAddresses);
    handleCloseModalRemoveAddress();
  }

  function handleRemovePhone(id) {
    const newArrayPhone = personPhone.filter((phone) => phone.id !== id);

    setPersonPhone(newArrayPhone);
    handleCloseModaRemovePhone();
  }

  function handleRemoveMail(id) {
    const newArrayMails = personMail.filter((mail) => mail.id !== id);

    setPersonMail(newArrayMails);
    handleCloseModalRemoveMail();
  }

  function handleRemoveReference(index) {
    const newArrayReferences = personReferences.filter((reference) => reference.id !== index);

    setPersonReferences(newArrayReferences);
    handleCloseModalRemoveReference();
  }

  function handleRemoveBankingReference(index) {
    const newArrayBankingReference = bankingReferences.filter((value) => value.id !== index);

    setBankingReferences(newArrayBankingReference);
    handleCloseModalRemoveBankingReference();
  }


  function searchZipCode(zipCode, e, position) {
    cep(zipCode).then((response) => {
      const { city, neighborhood, state, street } = response;
      const updatedAdress = Array.from(personAddress);

      updatedAdress[position].city = city;
      updatedAdress[position].neighborhood = neighborhood;
      updatedAdress[position].state = state;
      updatedAdress[position].street = street;

      setPersonAddress(updatedAdress);
      setIsZipCodeValid(true);
    }).catch((response) => {
      const { message } = response;
      setErrorMessageZipCode(message);
      setIsZipCodeValid(false);
    });
  }

  async function handleSubmitFormRegister(e) {
    e.preventDefault();
    const csrftoken = getCookie('csrftoken');

    const data = {
      ...person,
      ...physicalPerson,
      addresses: personAddress,
      phones: personPhone,
      mails: personMail,
      personReferences,
      bankingReferences
    };

    try {
      await api.post(`/persons/physical/create/`, data, {
        headers: {
          'X-CSRFToken': csrftoken
        }
      });

      handleButtonClickProgress();
      setTimeout(() => {
        toast.success('Registro cadastrado com sucesso.');
      }, 2000);
      setTimeout(() => {
        history.push('/physical/persons');
      }, 4000);
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
      <Menus title="Cadastrar Pessoa" />
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
                  <IconButton>
                    <ArrowBack />
                  </IconButton>
                </Link>
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
            <form onSubmit={(e) => handleSubmitFormRegister(e)} autoComplete="off">
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
                      />
                    </Grid>

                    <Grid
                      item
                      xs={3}
                      sm={3}
                      xl={3}
                    >
                      <InputMask mask="999.999.999-99" value={person.cpfcnpj} onChange={(e) => handleChangeInputsPerson(e)}>
                        <TextField
                          fullWidth
                          required
                          label="CPF"
                          name="cpfcnpj"
                          variant="outlined"
                        />
                      </InputMask>
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
                        value={physicalPerson.identidade}
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
                        required
                        label="Órgão Emissor"
                        name="emissor_identidade"
                        variant="outlined"
                        value={physicalPerson.emissor_identidade}
                        onChange={(e) => handleChangeInputsPhysicalPerson(e)}

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
                          name="id_uf_municipio_fk"
                        >
                          <MenuItem value={0}>
                            <em>None</em>
                          </MenuItem>
                          {
                            ufs.map((uf, index) => (
                              <MenuItem value={uf.id_municipios} key={index}>{uf.uf_sigla}</MenuItem>
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

                      />
                    </Grid>

                    <Grid
                      item
                      xs={3}
                      sm={3}
                      xl={3}
                    >
                      <Autocomplete
                        options={counties}
                        getOptionLabel={(option) => `${option.descr}, ${option.uf_sigla}`}
                        getOptionSelected={(option, value) => option.id_municipios === value.id_municipios}
                        onChange={(e, value) => {
                          if (value == null) {
                            setPhysicalPerson({ ...physicalPerson, id_municipio_fk: '' });
                          } else {
                            setPhysicalPerson({ ...physicalPerson, id_municipio_fk: value.id_municipios });
                          }
                        }}
                        renderInput={(params) => <TextField
                          {...params}
                          name="id_municipio_fk"
                          label="Naturalidade"
                          variant="outlined"
                        />
                        }
                      />
                      {/*
                      <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="select-naturalidade-label">Naturalidade</InputLabel>
                        <Select
                          labelId="select-naturalidade-label"
                          id="select-naturalidade"
                          value={physicalPerson.id_municipio_fk}
                          onChange={(e) => handleChangeInputsPhysicalPerson(e)}
                          label="Naturalidade"

                          name="id_municipio_fk"
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {
                            counties.map(countie => (
                              <MenuItem value={countie.id_municipios}>{countie.descr}</MenuItem>
                            ))
                          }
                        </Select>
                      </FormControl> */}
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
                        label="Nome do pai"
                        name="pai"
                        variant="outlined"
                        value={physicalPerson.pai}
                        onChange={(e) => handleChangeInputsPhysicalPerson(e)}

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
                        label="Nome da mãe"
                        name="mae"
                        variant="outlined"
                        value={physicalPerson.mae}
                        onChange={(e) => handleChangeInputsPhysicalPerson(e)}

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
                        value={physicalPerson.profissao}
                        onChange={(e) => handleChangeInputsPhysicalPerson(e)}

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
                        value={physicalPerson.ctps}
                        onChange={(e) => handleChangeInputsPhysicalPerson(e)}

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
                        value={physicalPerson.salario}
                        onChange={(e) => handleChangeInputsPhysicalPerson(e)}

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
                        value={physicalPerson.empresa}
                        onChange={(e) => handleChangeInputsPhysicalPerson(e)}

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
                        value={physicalPerson.resp}
                        onChange={(e) => handleChangeInputsPhysicalPerson(e)}

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
                        value={physicalPerson.cnpj}
                        onChange={(e) => handleChangeInputsPhysicalPerson(e)}

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
                        value={physicalPerson.imun}
                        onChange={(e) => handleChangeInputsPhysicalPerson(e)}

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
                        value={physicalPerson.iest}
                        onChange={(e) => handleChangeInputsPhysicalPerson(e)}

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
                        value={physicalPerson.emprend}
                        onChange={(e) => handleChangeInputsPhysicalPerson(e)}

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
                        value={physicalPerson.orendas}
                        onChange={(e) => handleChangeInputsPhysicalPerson(e)}

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
                        value={physicalPerson.vrendas}
                        onChange={(e) => handleChangeInputsPhysicalPerson(e)}

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

                          name="irpf"
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

                        name="conjuge"
                        label="Nome do cônjugue"
                        variant="outlined"
                        value={physicalPerson.conjuge}
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

                        name="depend"
                        label="Núm. de dependentes"
                        variant="outlined"
                        type="number"
                        value={physicalPerson.depend}
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

                        name="cpfconj"
                        label="CPF do cônjugue"
                        variant="outlined"
                        value={physicalPerson.cpfconj}
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

                        name="telconj"
                        label="Telefone do cônjugue"
                        variant="outlined"
                        value={physicalPerson.telconj}
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

                        name="mailconj"
                        label="E-mail do cônjugue"
                        variant="outlined"
                        value={physicalPerson.mailconj}
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

                        name="profconj"
                        label="Profissão do cônjugue"
                        variant="outlined"
                        value={physicalPerson.profconj}
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

                        name="emprconj"
                        label="Empresa do cônjugue"
                        variant="outlined"
                        value={physicalPerson.emprconj}
                        onChange={(e) => handleChangeInputsPhysicalPerson(e)}
                      />
                    </Grid>
                  </Grid>
                </TabPanel>
                {/* ENDEREÇOS */}
                <TabPanel value={valueTab} index={3}>
                  <Grid
                    item
                    xs={3}
                    sm={3}
                    xl={3}
                  >
                    <Tooltip title="Adicionar novo endereço">
                      <Button
                        color="primary"
                        variant="contained"
                        size="small"
                        onClick={handleAddNewAddress}
                      >
                        Adicionar
                      </Button>
                    </Tooltip>
                  </Grid>
                  <Divider style={{ marginBottom: '20px', marginTop: '20px' }} />
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
                          style={{ marginBottom: '20px' }}
                        >
                          <Grid
                            item
                            xs={3}
                            sm={3}
                            xl={3}
                          >
                            <Tooltip title="Remover este endereço">
                              <Button
                                style={{ background: red[300], color: '#FFF' }}
                                variant="contained"
                                size="small"
                                onClick={() => handleClickOpenModalRemoveAddress(address.id)}
                                startIcon={<Delete size={5} />}
                              >
                                Remover
                              </Button>
                            </Tooltip>
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
                            <InputMask mask="99.999-999" value={address.zipCode} onChange={(e) => handleChangeInputsAddress(e, index)}>
                              <TextField
                                fullWidth
                                required
                                error={!isZipCodeValid}
                                autoComplete="off"
                                label="CEP"
                                name="zipCode"
                                variant="outlined"
                              />
                            </InputMask>
                            {
                              (!isZipCodeValid) && (
                                <FormHelperText error >{errorMessageZipCode}</FormHelperText>
                              )
                            }
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
                              onFocus={(e) => searchZipCode(address.zipCode, e, index)}
                              required
                              label="Rua"
                              name="street"
                              variant="outlined"
                              value={address.street}
                              onChange={(e) => handleChangeInputsAddress(e, index)}
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
                              label="Bairro"
                              name="neighborhood"
                              variant="outlined"
                              value={address.neighborhood}
                              onChange={(e) => handleChangeInputsAddress(e, index)}
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
                              label="Número"
                              name="numberHouse"
                              variant="outlined"
                              value={address.numberHouse}
                              onChange={(e) => handleChangeInputsAddress(e, index)}
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
                              label="Complemento"
                              name="complement"
                              variant="outlined"
                              value={address.complement}
                              onChange={(e) => handleChangeInputsAddress(e, index)}
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
                              label="Cidade"
                              name="city"
                              variant="outlined"
                              value={address.city}
                              onChange={(e) => handleChangeInputsAddress(e, index)}
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
                              label="Estado"
                              name="state"
                              variant="outlined"
                              value={address.state}
                              onChange={(e) => handleChangeInputsAddress(e, index)}
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
                      <Grid
                        container
                        spacing={3}
                      >
                        <Grid
                          item
                          xs={5}
                          sm={5}
                          xl={5}
                        >
                          <Tooltip title="Adicionar novo telefone">
                            <Button
                              color="primary"
                              variant="contained"
                              size="small"
                              onClick={handleAddNewPhone}
                            >
                              Adicionar Telefone
                            </Button>
                          </Tooltip>
                        </Grid>
                      </Grid>
                      <Divider style={{ marginBottom: '20px', marginTop: '20px' }} />
                      <Typography component="div" className={classes.containerInput}>
                        <p className={classes.title}>Telefones</p>
                        {
                          personPhone.length === 0 && (
                            <Typography component="h3" align="center" color="textSecondary">
                              Este registro não contém informações sobre telefones
                            </Typography>
                          )
                        }
                        {
                          personPhone.map((phone, index) => (
                            <FormControl className={classes.inputList} variant="outlined" fullWidth key={index}>
                              <InputLabel>Telefone</InputLabel>
                              <OutlinedInput
                                onChange={(e) => handleChangeInputsPhone(e, index)}
                                fullWidth
                                required
                                label="Telefone"
                                value={phone.phoneNumber}
                                name="phoneNumber"
                                endAdornment={
                                  <InputAdornment position="end">
                                    <Tooltip title="Deletar">
                                      <IconButton
                                        aria-label="Deletar"
                                        onClick={() => handleClickOpenModalRemovePhone(phone.id)}
                                        edge="end"
                                      >
                                        <Delete size={8} style={{ color: red[300] }} />
                                      </IconButton>
                                    </Tooltip>
                                  </InputAdornment>
                                }
                                labelWidth={70}
                              />
                              <Divider className={classes.divider} />
                            </FormControl>
                          ))
                        }
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xl={1}
                      xs={1}
                      sm={1}
                    >
                      <Divider className={classes.dividerVertical} orientation="vertical" />
                    </Grid>
                    <Grid
                      item
                      xs={5}
                      xl={5}
                      sm={5}
                    >
                      <Grid
                        container
                        spacing={3}
                      >
                        <Grid
                          item
                          xs={5}
                          sm={5}
                          xl={5}
                        >
                          <Tooltip title="Adicionar novo email">
                            <Button
                              color="primary"
                              variant="contained"
                              size="small"
                              onClick={handleAddNewMail}
                            >
                              Adicionar E-mail
                            </Button>
                          </Tooltip>
                        </Grid>
                      </Grid>
                      <Divider style={{ marginBottom: '20px', marginTop: '20px' }} />
                      <Typography component="div" className={classes.containerInput}>
                        <p className={classes.title}>E-mails</p>
                        {
                          personMail.length === 0 && (
                            <Typography component="h3" align="center" color="textSecondary">
                              Este registro não contém informações sobre email
                            </Typography>
                          )
                        }
                        {
                          personMail.map((mail, index) => (
                            <FormControl className={classes.inputList} variant="outlined" fullWidth key={index}>
                              <InputLabel>E-mail</InputLabel>
                              <OutlinedInput
                                onChange={(e) => handleChangeInputsMails(e, index)}
                                fullWidth
                                required
                                value={mail.userMail}
                                label="E-mail"
                                name="userMail"
                                endAdornment={
                                  <InputAdornment position="end">
                                    <Tooltip title="Deletar">
                                      <IconButton
                                        aria-label="Deletar"
                                        onClick={() => handleClickOpenModalRemoveMail(mail.id)}
                                        edge="end"
                                      >
                                        <Delete size={8} style={{ color: red[300] }} />
                                      </IconButton>
                                    </Tooltip>
                                  </InputAdornment>
                                }
                                labelWidth={70}
                              />
                              <Divider className={classes.divider} />
                            </FormControl>
                          ))
                        }
                      </Typography>
                    </Grid>
                  </Grid>
                </TabPanel>
                {/* REFERÊNCIAS */}
                <TabPanel value={valueTab} index={5}>
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
                      <Tooltip title="Adicionar nova referência">
                        <Button
                          color="primary"
                          variant="contained"
                          size="small"
                          onClick={handleAddNewReference}
                        >
                          Adicionar
                        </Button>
                      </Tooltip>
                    </Grid>
                  </Grid>
                  {
                    personReferences.length === 0 && (
                      <Typography component="h3" align="center" style={{ marginTop: '30px' }} color="textSecondary">
                        Este registro não contém informações sobre referências.
                      </Typography>
                    )
                  }
                  {
                    personReferences.map((reference, index) => (
                      <Typography
                        component="div"
                        key={index}
                      >
                        <Divider style={{ marginBottom: '20px', marginTop: '20px' }} />

                        <Grid
                          container
                          spacing={3}
                          style={{ marginBottom: '20px' }}
                        >
                          <Grid
                            item
                            xs={3}
                            sm={3}
                            xl={3}
                          >
                            <Tooltip title="Remover este registro">
                              <Button
                                style={{ background: red[300], color: '#FFF' }}
                                variant="contained"
                                size="small"
                                onClick={() => handleClickOpenModalRemoveReference(reference.id)}
                                startIcon={<Delete />}
                              >
                                Remover
                              </Button>
                            </Tooltip>
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
                              required
                              label="Nome"
                              name="referenceName"
                              variant="outlined"
                              value={reference.referenceName}
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
                              required
                              label="Tipo"
                              name="referenceType"
                              variant="outlined"
                              value={reference.referenceType}
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
                              required
                              label="Telefone"
                              name="referencePhone"
                              variant="outlined"
                              value={reference.referencePhone}
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
                              required
                              label="Endereço"
                              name="referenceAdress"
                              variant="outlined"
                              value={reference.referenceAdress}
                              onChange={(e) => handleChangeInputsReferences(e)}
                            />
                          </Grid>
                        </Grid>
                      </Typography>
                    ))
                  }

                </TabPanel>
                {/* DADOS BANCÁRIOS */}
                <TabPanel value={valueTab} index={6}>
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
                      <Tooltip title="Adicionar nova conta">
                        <Button
                          color="primary"
                          variant="contained"
                          size="small"
                          onClick={handleAddNewBankingReference}
                        >
                          Adicionar
                        </Button>
                      </Tooltip>
                    </Grid>
                  </Grid>
                  {
                    bankingReferences.length === 0 && (
                      <Typography component="h3" align="center" style={{ marginTop: '30px' }} color="textSecondary">
                        Este registro não contém informações bancárias.
                      </Typography>
                    )
                  }
                  {
                    bankingReferences.map((banking, index) => (
                      <Typography component="div" key={index}>
                        <Divider style={{ marginBottom: '20px', marginTop: '20px' }} />
                        <Grid
                          container
                          spacing={3}
                          style={{ marginBottom: '20px' }}
                        >
                          <Grid
                            item
                            xs={3}
                            sm={3}
                            xl={3}
                          >
                            <Tooltip title="Remover este registro">
                              <Button
                                style={{ background: red[300], color: '#FFF' }}
                                variant="contained"
                                size="small"
                                onClick={() => handleClickOpenModalRemoveBankingReference(banking.id)}
                                startIcon={<Delete />}
                              >
                                Remover
                              </Button>
                            </Tooltip>
                          </Grid>
                        </Grid>
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
                            <FormControl variant="outlined" className={classes.formControl}>
                              <InputLabel id="select-banco-label">Banco</InputLabel>
                              <Select
                                labelId="select-banco-label"
                                id="select-banco"
                                value={banking.idBanking}
                                onChange={(e) => handleChangeInputsBankingReferences(e, index)}
                                label="Banco"
                                name="idBanking"
                                required
                              >
                                {
                                  registeredBanks.map(bank => (
                                    <MenuItem value={bank.id_bancos} key={bank.id_bancos}>{bank.banco}</MenuItem>
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
                              <InputLabel id="select-ref-banco-label">Tipo</InputLabel>
                              <Select
                                labelId="select-ref-banco-label"
                                id="select-ref-banco"
                                value={banking.type}
                                onChange={(e) => handleChangeInputsBankingReferences(e)}
                                label="Tipo"
                                name="type"
                                required
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                <MenuItem value="Conta corrente">Conta corrente</MenuItem>
                                <MenuItem value="Conta poupança">Conta poupança</MenuItem>
                                <MenuItem value="Conta salário">Conta salário</MenuItem>
                                <MenuItem value="Conta digital">Conta digital</MenuItem>
                                <MenuItem value="Conta universitária">Conta universitária</MenuItem>
                              </Select>
                            </FormControl>
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

                              required
                              label="Conta"
                              name="account"
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

                              required
                              label="Agência"
                              name="agency"
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

                              required
                              type="date"
                              label="Abertura"
                              name="opening"
                              variant="outlined"
                              value={moment(banking.abertura).format('YYYY-MM-DD')}
                              onChange={(e) => handleChangeInputsBankingReferences(e)}
                            />
                          </Grid>
                        </Grid>
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
              <Grid
                item
                xs={12}
                sm={12}
                xl={12}
              >
                <Divider style={{ marginTop: '20px' }} />
                <Box
                  display="flex"
                  justifyContent="flex-start"
                  alignItems="flex-end"
                  padding="20px"
                >
                  <Button
                    color="primary"
                    variant="contained"
                    type="submit"
                    className={buttonClassName}
                    disabled={loading}
                  >
                    Salvar
                    {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                  </Button>
                </Box>
              </Grid>
            </form>
          </div>
        </Container>


        {/* REMOVE REGISTER PHONE */}
        <Dialog
          open={openModalRemovePhone}
          onClose={handleCloseModaRemovePhone}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
        >
          <DialogTitle id="alert-dialog-title">Remover registro de telefone</DialogTitle>
          <DialogContent>

            <Typography>
              Deseja realmente excluir este registro de telefone?
            </Typography>
          </DialogContent>
          <Divider style={{ marginTop: '20px' }} />
          <DialogActions>
            <Box
              display="flex"
              justifyContent="flex-start"
              alignItems="flex-end"
              padding="15px"
            >
              <Button onClick={handleCloseModaRemovePhone} style={{ color: red[300], marginRight: '10px' }}>
                Cancelar
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                autoFocus
                onClick={() => handleRemovePhone(phoneId)}
              >
                Excluir
              </Button>
            </Box>
          </DialogActions>
        </Dialog>

        {/* REMOVE REGISTER ADDRESS */}
        <Dialog
          open={openModalRemoveAddress}
          onClose={handleCloseModalRemoveAddress}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
        >
          <DialogTitle id="alert-dialog-title">Remover registro de endereço</DialogTitle>
          <DialogContent>
            <Typography>
              Deseja realmente excluir este registro de endereço?
            </Typography>
          </DialogContent>
          <Divider style={{ marginTop: '20px' }} />
          <DialogActions>
            <Box
              display="flex"
              justifyContent="flex-start"
              alignItems="flex-end"
              padding="15px"
            >
              <Button onClick={handleCloseModalRemoveAddress} style={{ color: red[300], marginRight: '10px' }}>
                Cancelar
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                autoFocus
                onClick={() => handleRemoveAddress(addressId)}
              >
                Excluir
              </Button>
            </Box>
          </DialogActions>
        </Dialog>

        {/* REMOVE REGISTER MAIL */}
        <Dialog
          open={openModalRemoveMail}
          onClose={handleCloseModalRemoveMail}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
        >
          <DialogTitle id="alert-dialog-title">Remover registro de e-mail</DialogTitle>
          <DialogContent>
            <Typography>
              Deseja realmente excluir este registro de e-mail?
            </Typography>
          </DialogContent>
          <Divider style={{ marginTop: '20px' }} />
          <DialogActions>
            <Box
              display="flex"
              justifyContent="flex-start"
              alignItems="flex-end"
              padding="15px"
            >
              <Button onClick={handleCloseModalRemoveMail} style={{ color: red[300], marginRight: '10px' }}>
                Cancelar
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                autoFocus
                onClick={() => handleRemoveMail(personMailId)}
              >
                Excluir
              </Button>
            </Box>
          </DialogActions>
        </Dialog>

        {/* REMOVE REGISTER REFERENCE */}
        <Dialog
          open={openModalRemoveReference}
          onClose={handleCloseModalRemoveReference}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
        >
          <DialogTitle id="alert-dialog-title">Remover registro de referência pessoal</DialogTitle>
          <DialogContent>
            <Typography>
              Deseja realmente excluir este registro de referência pessoal?
            </Typography>
          </DialogContent>
          <Divider style={{ marginTop: '20px' }} />
          <DialogActions>
            <Box
              display="flex"
              justifyContent="flex-start"
              alignItems="flex-end"
              padding="15px"
            >
              <Button onClick={handleCloseModalRemoveReference} style={{ color: red[300], marginRight: '10px' }}>
                Cancelar
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                autoFocus
                onClick={() => handleRemoveReference(personReferenceId)}
              >
                Excluir
              </Button>
            </Box>
          </DialogActions>
        </Dialog>

        {/* REMOVE REGISTER BANKING */}
        <Dialog
          open={openModalRemoveBankingReference}
          onClose={handleCloseModalRemoveBankingReference}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
        >
          <DialogTitle id="alert-dialog-title">Remover registro de referência pessoal</DialogTitle>
          <DialogContent>
            <Typography>
              Deseja realmente excluir este registro de referência pessoal?
            </Typography>
          </DialogContent>
          <Divider style={{ marginTop: '20px' }} />
          <DialogActions>
            <Box
              display="flex"
              justifyContent="flex-start"
              alignItems="flex-end"
              padding="15px"
            >
              <Button onClick={handleCloseModalRemoveBankingReference} style={{ color: red[300], marginRight: '10px' }}>
                Cancelar
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                autoFocus
                onClick={() => handleRemoveBankingReference(bankingReferenceId)}
              >
                Excluir
              </Button>
            </Box>
          </DialogActions>
        </Dialog>

        <Box pt={4}>
          <Copyright />
        </Box>
      </main>
    </div>
  );
}
