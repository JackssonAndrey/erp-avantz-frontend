import React, { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import { ToastContainer, toast } from 'react-toastify';
import { red } from '@material-ui/core/colors';
import {
  Box,
  CssBaseline,
  IconButton,
  Grid,
  TextField,
  AppBar,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
  Divider,
  Button,
  Tooltip,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  FormHelperText
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import PropTypes from 'prop-types';
import { v4 as uuidV4 } from 'uuid';
import moment from 'moment';
import InputMask from 'react-input-mask';
import cep from 'cep-promise';

import { Delete } from '@material-ui/icons';

import api from '../../../../services/api';
import getCookie from '../../../../utils/functions';
import useStyles from './styles';

import 'react-toastify/dist/ReactToastify.css';

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

export default function LegalPersonModal() {
  const classes = useStyles();
  const timer = useRef();
  const theme = useTheme();

  const initialStatePerson = {
    personIsProvider: 0,
    personCNPJ: "",
    companyName: "",
    personPhoto: "",
    personLimit: 0,
    personBalance: 0,
  }

  const initialStateLegalPerson = {
    fantasyName: "",
    branch: "",
    companyType: "",
    shareCapital: 0,
    revenues: 0,
    taxation: 1,
    contact: "",
    openDate: moment().format('YYYY-MM-DD'),
    stateRegistrationCompany: "",
    municipalRegistrationCompany: "",
  }

  // SUCCESS AND ERRORS BUTTONS STATES
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
    [classes.buttonError]: error,
  });

  // PERSON STATE
  const [valueTab, setValueTab] = useState(0);
  const [bankingReferences, setBankingReferences] = useState([]);
  const [bankingReferenceId, setBankingReferenceId] = useState(0);
  const [person, setPerson] = useState(initialStatePerson);
  const [personAddress, setPersonAddress] = useState([]);
  const [addressId, setAddressId] = useState(0);
  const [personMail, setPersonMail] = useState([]);
  const [personMailId, setPersonMailId] = useState('');
  const [personPhone, setPersonPhone] = useState([]);
  const [phoneId, setPhoneId] = useState('');
  const [legalPerson, setLegalPerson] = useState(initialStateLegalPerson);
  const [personReferences, setPersonReferences] = useState([]);
  const [personReferenceId, setPersonReferenceId] = useState(0);
  const [isZipCodeValid, setIsZipCodeValid] = useState(true);
  const [errorMessageZipCode, setErrorMessageZipCode] = useState('');
  const [registeredBanks, setRegisteredBanks] = useState([]);

  // MODALS STATES
  const [openModalRemovePhone, setOpenModalRemovePhone] = useState(false);
  const [openModalRemoveAddress, setOpenModalRemoveAddress] = useState(false);
  const [openModalRemoveMail, setOpenModalRemoveMail] = useState(false);
  const [openModalRemoveReference, setOpenModalRemoveReference] = useState(false);
  const [openModalRemoveBankingReference, setOpenModalRemoveBankingReference] = useState(false);

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


  const handleChangeIndex = (index) => {
    setValueTab(index);
  };

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

  const handleClickOpenModalRemovePhone = (id) => {
    setOpenModalRemovePhone(true);
    setPhoneId(id);
  };

  const handleCloseModaRemovelPhone = () => {
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

  const handleChangeTab = (event, newValue) => {
    setValueTab(newValue);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  function handleChangeInputsPerson(e) {
    const { name, value } = e.target;
    setPerson({ ...person, [name]: value });
  }

  function handleChangeInputsLegalPerson(e) {
    const { name, value } = e.target;
    setLegalPerson({ ...legalPerson, [name]: value });
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

  function handleRemoveAddress(index) {
    const newArrayAddresses = personAddress.filter((address) => address.id !== index);

    setPersonAddress(newArrayAddresses);
    handleCloseModalRemoveAddress();
  }

  function handleRemovePhone(id) {
    const newArrayPhone = personPhone.filter((phone) => phone.id !== id);

    setPersonPhone(newArrayPhone);
    handleCloseModaRemovelPhone();
  }

  function handleRemoveMail(id) {
    const newArrayMails = personMail.filter((mail) => mail.id !== id);

    setPersonMail(newArrayMails);
    setPersonMailId('');
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

  // SUBMIT REGISTER FORM
  async function handleSubmitFormRegister(e) {
    e.preventDefault();
    const csrftoken = getCookie('csrftoken');

    const personData = {
      ...person,
      ...legalPerson,
      adresses: personAddress,
      phones: personPhone,
      mails: personMail,
      personReferences,
      bankingReferences
    }

    try {
      await api.post('/persons/legal/create/', personData, {
        headers: {
          'X-CSRFToken': csrftoken
        }
      });
      handleButtonClickProgress();
      setTimeout(() => {
        toast.success('Cadastro feito com sucesso!');
      }, 2000);
    } catch (err) {
      const { data } = err.response;
      handleButtonClickProgressError();
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
    }
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

  return (
    <>
      <ToastContainer />
      <CssBaseline />

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
          <Tab label="Endereço" {...a11yProps(1)} />
          <Tab label="Contatos" {...a11yProps(2)} />
          <Tab label="Referências" {...a11yProps(3)} />
          <Tab label="Dados bancários" {...a11yProps(4)} />
          <Tab label="Financeiro" {...a11yProps(5)} />
          <Tab label="Opções" {...a11yProps(6)} />
        </Tabs>
      </AppBar>
      <form onSubmit={(e) => handleSubmitFormRegister(e)} autoComplete="off">
        <Box
          display="flex"
          flexDirection="column"
        >
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
                  xs={6}
                  sm={6}
                  xl={6}
                >
                  <TextField
                    fullWidth
                    required
                    label="Razão social"
                    name="companyName"
                    variant="outlined"
                    value={person.companyName}
                    onChange={(e) => handleChangeInputsPerson(e)}

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
                    label="Nome fantasia"
                    name="fantasyName"
                    variant="outlined"
                    value={legalPerson.fantasyName}
                    onChange={(e) => handleChangeInputsLegalPerson(e)}
                  />
                </Grid>

                <Grid
                  item
                  xs={4}
                  sm={4}
                  xl={4}
                >
                  <InputMask mask="99.999.999/9999-99" value={person.personCNPJ} onChange={(e) => handleChangeInputsPerson(e)}>
                    <TextField
                      fullWidth
                      required
                      label="CNPJ"
                      name="personCNPJ"
                      variant="outlined"
                      value={person.personCNPJ}
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
                    required
                    label="Inscrição Estadual"
                    name="stateRegistrationCompany"
                    variant="outlined"
                    value={legalPerson.stateRegistrationCompany === null ? 'Não informado' : legalPerson.stateRegistrationCompany}
                    onChange={(e) => handleChangeInputsLegalPerson(e)}

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
                    name="municipalRegistrationCompany"
                    variant="outlined"
                    value={legalPerson.municipalRegistrationCompany === null ? 'Não informado' : legalPerson.municipalRegistrationCompany}
                    onChange={(e) => handleChangeInputsLegalPerson(e)}

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
                    name="openDate"
                    type="date"
                    label="Data de abertura"
                    variant="outlined"
                    value={legalPerson.openDate}
                    onChange={(e) => handleChangeInputsLegalPerson(e)}
                  />
                </Grid>

                <Grid
                  item
                  xs={5}
                  sm={5}
                  xl={5}
                >
                  <TextField
                    fullWidth
                    required
                    label="Ramo"
                    name="branch"
                    variant="outlined"
                    value={legalPerson.branch}
                    onChange={(e) => handleChangeInputsLegalPerson(e)}

                  />
                </Grid>

                <Grid
                  item
                  xs={4}
                  sm={4}
                  xl={4}
                >
                  <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id="select-company-type">Tipo da empresa</InputLabel>
                    <Select
                      labelId="select-company-type"
                      value={legalPerson.companyType}
                      onChange={(e) => handleChangeInputsLegalPerson(e)}
                      label="Tipo da empresa"
                      name="companyType"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="Sociedade Empresária Limitada">Sociedade Empresária Limitada</MenuItem>
                      <MenuItem value="Empresa Individual De Responsabilidade Limitada">Empresa Individual De Responsabilidade Limitada</MenuItem>
                      <MenuItem value="Empresa Individual">Empresa Individual</MenuItem>
                      <MenuItem value="Microempreendedor Individual">Microempreendedor Individual</MenuItem>
                      <MenuItem value="Sociedade Simples">Sociedade Simples</MenuItem>
                      <MenuItem value="Sociedade Anônima">Sociedade Anônima</MenuItem>
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
                    <InputLabel id="select-taxation">Tributação</InputLabel>
                    <Select
                      labelId="select-taxation"
                      value={legalPerson.taxation}
                      onChange={(e) => handleChangeInputsLegalPerson(e)}
                      label="Tributação"
                      name="taxation"
                    >
                      <MenuItem value={1}>
                        <em>Não especificado</em>
                      </MenuItem>
                      <MenuItem value={2}>Simples Nacional</MenuItem>
                      <MenuItem value={3}>Lucro Real</MenuItem>
                      <MenuItem value={4}>Lucro Presumido</MenuItem>
                    </Select>
                  </FormControl>
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
                    label="Contato na empresa"
                    name="contact"
                    variant="outlined"
                    value={legalPerson.contact}
                    onChange={(e) => handleChangeInputsLegalPerson(e)}

                  />
                </Grid>
              </Grid>
            </TabPanel>
            {/* ENDEREÇOS */}
            <TabPanel value={valueTab} index={1}>
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
                personAddress.map((addressValue, index) => (
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
                        <Tooltip title="Remover este endereço">
                          <Button
                            style={{ background: red[300], color: '#FFF' }}
                            variant="contained"
                            size="small"
                            onClick={() => handleClickOpenModalRemoveAddress(addressValue.id)}
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
                        <InputMask mask="99.999-999" value={addressValue.zipCode} onChange={(e) => handleChangeInputsAddress(e, index)}>
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
                          onFocus={(e) => searchZipCode(addressValue.zipCode, e, index)}
                          required
                          label="Rua"
                          name="street"
                          variant="outlined"
                          value={addressValue.street}
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
                          value={addressValue.neighborhood}
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
                          value={addressValue.numberHouse}
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
                          value={addressValue.complement === null ? 'Não informado' : addressValue.complement}
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
                          value={addressValue.city}
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
                          value={addressValue.state}
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
            <TabPanel value={valueTab} index={2}>
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
            <TabPanel value={valueTab} index={3}>
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
              <Divider style={{ marginBottom: '20px', marginTop: '20px' }} />
              {
                personReferences.length === 0 && (
                  <Typography component="h3" align="center" color="textSecondary">
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
                        <Tooltip title="Remover este registro">
                          <Button
                            style={{ background: red[300], color: '#FFF' }}
                            variant="contained"
                            size="small"
                            onClick={() => handleClickOpenModalRemoveReference(reference.id)}
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
                          onChange={(e) => handleChangeInputsReferences(e, index)}
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
                          onChange={(e) => handleChangeInputsReferences(e, index)}
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
                          onChange={(e) => handleChangeInputsReferences(e, index)}
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
                          name="referenceAddress"
                          variant="outlined"
                          value={reference.referenceAddress}
                          onChange={(e) => handleChangeInputsReferences(e, index)}
                        />
                      </Grid>
                    </Grid>
                    <Divider className={classes.divider} />
                  </Typography>
                ))
              }

            </TabPanel>
            {/* DADOS BANCÁRIOS */}
            <TabPanel value={valueTab} index={4}>
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
              <Divider style={{ marginBottom: '20px', marginTop: '20px' }} />
              {
                bankingReferences.length === 0 && (
                  <Typography component="h3" align="center" color="textSecondary">
                    Este registro não contém informações bancárias.
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
                          <InputLabel id="select-type-account">Tipo</InputLabel>
                          <Select
                            labelId="select-type-account"
                            id="type-account"
                            value={banking.type}
                            onChange={(e) => handleChangeInputsBankingReferences(e, index)}
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
                          value={banking.account}
                          onChange={(e) => handleChangeInputsBankingReferences(e, index)}
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
                          value={banking.agency}
                          onChange={(e) => handleChangeInputsBankingReferences(e, index)}
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
                          type="date"
                          required
                          label="Abertura"
                          name="opening"
                          variant="outlined"
                          value={banking.opening}
                          onChange={(e) => handleChangeInputsBankingReferences(e, index)}
                        />
                      </Grid>
                    </Grid>
                    <Divider className={classes.divider} />
                  </Typography>
                ))
              }
            </TabPanel>
            {/* FINANCEIRO */}
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
                  <TextField
                    fullWidth
                    required
                    label="Limite"
                    name="personLimit"
                    variant="outlined"
                    value={person.personLimit}
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
                    required
                    label="Saldo"
                    name="personBalance"
                    variant="outlined"
                    value={person.personBalance}
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
                    required
                    label="Capital"
                    name="shareCapital"
                    variant="outlined"
                    value={legalPerson.shareCapital}
                    onChange={(e) => handleChangeInputsLegalPerson(e)}
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
                    label="Receitas"
                    name="revenues"
                    variant="outlined"
                    value={legalPerson.revenues}
                    onChange={(e) => handleChangeInputsLegalPerson(e)}
                  />
                </Grid>
              </Grid>
            </TabPanel>
            {/* OPÇÕES */}
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
                  <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id="select-provider-label">Fornecedor</InputLabel>
                    <Select
                      labelId="select-provider-label"
                      id="select-provider"
                      value={person.personIsProvider}
                      onChange={(e) => handleChangeInputsPerson(e)}
                      label="Fornecedor"
                      name="personIsProvider"
                    >
                      <MenuItem value={1}>Sim</MenuItem>
                      <MenuItem value={0}>Não</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </TabPanel>

          </SwipeableViews>

          <Box>
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
                  className={buttonClassname}
                  disabled={loading}
                >
                  Salvar
                  {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                </Button>
              </Box>
            </Grid>
          </Box>
        </Box>
      </form>

      {/* REMOVE REGISTER PHONE */}
      <Dialog
        open={openModalRemovePhone}
        onClose={handleCloseModaRemovelPhone}
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
            <Button onClick={handleCloseModaRemovelPhone} style={{ color: red[300], marginRight: '10px' }}>
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
    </>
  );
}
