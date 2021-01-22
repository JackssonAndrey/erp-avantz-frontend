import React, { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { red } from '@material-ui/core/colors';
import {
  Box, Container, CssBaseline, Card, CardContent, IconButton, Grid, TextField, AppBar, Tabs, Tab, Typography, CircularProgress,
  Divider, Button, Tooltip, Dialog, DialogContent, DialogActions, DialogTitle, Select, MenuItem, FormControl,
  InputLabel, OutlinedInput, InputAdornment
} from '@material-ui/core';
import PropTypes from 'prop-types';

import { ArrowBack, Delete } from '@material-ui/icons';

import Menus from '../../../components/Menus';
import Copyright from '../../../components/Copyright';
import api from '../../../services/api';
import getCookie from '../../../utils/functions';
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

const initialStatePerson = {
  "id_instituicao_fk": 0,
  "tipo": 0,
  "sit": 0,
  "forn": 0,
  "cpfcnpj": "",
  "nomeorrazaosocial": "",
  "foto": "",
  "img_bites": 0,
  "limite": "0",
  "saldo": "0"
}

const initialStateLegalPerson = {
  "fantasia": "",
  "ramo": "",
  "inscricao_estadual": "",
  "inscricao_municipal": "",
  "tipo_empresa": "",
  "capsocial": "0",
  "faturamento": "0",
  "tribut": 0,
  "contato": 0,
  "data_abertura": "",
  "data_criacao": ""
}

const initialStateAdress = {
  "origin": 1,
  "street": "",
  "numberHouse": "",
  "complement": "",
  "neighborhood": "",
  "zipCode": "",
  "city": "",
  "stateAdress": ""
}

const initialStateReference = {
  "referenceSituation": 1,
  "referenceType": "",
  "referenceName": "",
  "referencePhone": "",
  "referenceAdress": ""
}

const initialStateBankingReference = {
  "idBanking": 0,
  "situation": 1,
  "agency": "",
  "account": "",
  "opening": "",
  "type": ""
}

export default function RegisterLegalPerson(props) {
  const classes = useStyles();
  const timer = useRef();
  const idPerson = props.match.params.id;

  // SUCCESS AND ERRORS BUTTONS STATES
  const [loading, setLoading] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [successAddress, setSuccessAddress] = useState(false);
  const [errorAddress, setErrorAddress] = useState(false);
  const [loadingRemoveAddress, setLoadingRemoveAddress] = useState(false);
  const [successRemoveAddress, setSuccessRemoveAddress] = useState(false);
  const [errorRemoveAddress, setErrorRemoveAddress] = useState(false);
  const [loadingPhone, setLoadingPhone] = useState(false);
  const [successPhone, setSuccessPhone] = useState(false);
  const [errorPhone, setErrorPhone] = useState(false);
  const [loadingRemovePhone, setLoadingRemovePhone] = useState(false);
  const [successRemovePhone, setSuccessRemovePhone] = useState(false);
  const [errorRemovePhone, setErrorRemovePhone] = useState(false);
  const [loadingRemoveMail, setLoadingRemoveMail] = useState(false);
  const [successRemoveMail, setSuccessRemoveMail] = useState(false);
  const [errorRemoveMail, setErrorRemoveMail] = useState(false);
  const [loadingMail, setLoadingMail] = useState(false);
  const [successMail, setSuccessMail] = useState(false);
  const [errorMail, setErrorMail] = useState(false);
  const [loadingReference, setLoadingReference] = useState(false);
  const [successReference, setSuccessReference] = useState(false);
  const [errorReference, setErrorReference] = useState(false);
  const [loadingRemoveReference, setLoadingRemoveReference] = useState(false);
  const [successRemoveReference, setSuccessRemoveReference] = useState(false);
  const [errorRemoveReference, setErrorRemoveReference] = useState(false);
  const [loadingBankingReference, setLoadingBankingReference] = useState(false);
  const [successBankingReference, setSuccessBankingReference] = useState(false);
  const [errorBankingReference, setErrorBankingReference] = useState(false);
  const [loadingRemoveBankingReference, setLoadingRemoveBankingReference] = useState(false);
  const [successRemoveBankingReference, setSuccessRemoveBankingReference] = useState(false);
  const [errorRemoveBankingReference, setErrorRemoveBankingReference] = useState(false);

  // PERSON STATE
  const [valueTab, setValueTab] = useState(0);
  const [bankingReferences, setBankingReferences] = useState([{}]);
  const [bankingReferenceId, setBankingReferenceId] = useState(0);
  const [person, setPerson] = useState(initialStatePerson);
  const [personAddress, setPersonAddress] = useState([initialStateAdress]);
  const [addressId, setAddressId] = useState(0);
  const [personMail, setPersonMail] = useState([{ userMail: '' }]);
  const [personMailId, setPersonMailId] = useState(0);
  const [personPhone, setPersonPhone] = useState([{ phoneNumber: '' }]);
  const [phoneId, setPhoneId] = useState(0);
  const [legalPerson, setLegalPerson] = useState(initialStateLegalPerson);
  const [personReferences, setPersonReferences] = useState([{}]);
  const [personReferenceId, setPersonReferenceId] = useState(0);

  // MODALS STATES
  const [openModalPhone, setOpenModalPhone] = useState(false);
  const [openModalRemovePhone, setOpenModalRemovePhone] = useState(false);
  const [openModalMail, setOpenModalMail] = useState(false);
  const [openModalAddress, setOpenModalAddress] = useState(false);
  const [openModalRemoveAddress, setOpenModalRemoveAddress] = useState(false);
  const [openModalRemoveMail, setOpenModalRemoveMail] = useState(false);
  const [openModalReference, setOpenModalReference] = useState(false);
  const [openModalRemoveReference, setOpenModalRemoveReference] = useState(false);
  const [openModalBankingReference, setOpenModalBankingReference] = useState(false);
  const [openModalRemoveBankingReference, setOpenModalRemoveBankingReference] = useState(false);

  // REGISTER STATE
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mail, setMail] = useState('');
  const [address, setAddress] = useState(initialStateAdress);
  const [reference, setReference] = useState(initialStateReference);
  const [banking, setBanking] = useState(initialStateBankingReference);

  const handleClickOpenModalPhone = () => {
    setOpenModalPhone(true);
  };

  const handleCloseModalPhone = () => {
    setOpenModalPhone(false);
    setPhoneNumber('');
  };

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

  const handleClickOpenModalMail = () => {
    setOpenModalMail(true);
  };

  const handleCloseModalMail = () => {
    setOpenModalMail(false);
    setMail('');
  };

  const handleClickOpenModalBankingReference = () => {
    setOpenModalBankingReference(true);
  };

  const handleCloseModalBankingReference = () => {
    setOpenModalBankingReference(false);
  };

  const handleClickOpenModalAddress = () => {
    setOpenModalAddress(true);
  };

  const handleCloseModalAddress = () => {
    setOpenModalAddress(false);
  };

  const handleClickOpenModalRemoveAddress = (id) => {
    setOpenModalRemoveAddress(true);
    setAddressId(id);
  };

  const handleCloseModalRemoveAddress = () => {
    setOpenModalRemoveAddress(false);
  };

  const handleClickOpenModalReference = () => {
    setOpenModalReference(true);
  };

  const handleCloseModalReference = () => {
    setOpenModalReference(false);
  };

  const handleChangeTab = (event, newValue) => {
    setValueTab(newValue);
  };

  const buttonClassnameAddress = clsx({
    [classes.buttonSuccessAddress]: successAddress,
    [classes.buttonErrorAddress]: errorAddress,
  });

  const buttonClassnameRemoveAddress = clsx({
    [classes.buttonSuccessRemoveAddress]: successRemoveAddress,
    [classes.buttonErrorRemoveAddress]: errorRemoveAddress,
  });

  const buttonClassnameRemoveMail = clsx({
    [classes.buttonSuccessRemoveMail]: successRemoveMail,
    [classes.buttonErrorRemoveMail]: errorRemoveMail,
  });

  const buttonClassnameRemoveReference = clsx({
    [classes.buttonSuccessRemoveReference]: successRemoveReference,
    [classes.buttonErrorRemoveReference]: errorRemoveReference,
  });

  const buttonClassnamePhone = clsx({
    [classes.buttonSuccessPhone]: successPhone,
    [classes.buttonErrorPhone]: errorPhone,
  });

  const buttonClassnameRemovePhone = clsx({
    [classes.buttonSuccessRemovePhone]: successRemovePhone,
    [classes.buttonErrorRemovePhone]: errorRemovePhone,
  });

  const buttonClassnameMail = clsx({
    [classes.buttonSuccessMail]: successMail,
    [classes.buttonErrorMail]: errorMail,
  });

  const buttonClassnameReference = clsx({
    [classes.buttonSuccessReference]: successReference,
    [classes.buttonErrorReference]: errorReference,
  });

  const buttonClassnameBankingReference = clsx({
    [classes.buttonSuccessBankingReference]: successBankingReference,
    [classes.buttonErrorBankingReference]: errorBankingReference,
  });

  const buttonClassnameRemoveBankingReference = clsx({
    [classes.buttonSuccessRemoveBankingReference]: successRemoveBankingReference,
    [classes.buttonErrorRemoveBankingReference]: errorRemoveBankingReference,
  });

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
    console.log(personPhone);
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

  function handleChangeInputsBanking(e) {
    const { name, value } = e.target;
    setBanking({ ...banking, [name]: value });
  }

  function handleChangeReference(e) {
    const { name, value } = e.target;
    setReference({ ...reference, [name]: value });
  }

  function handleAddNewPhone() {
    setPersonPhone([
      ...personPhone,
      { phoneNumber: '' }
    ]);
  }

  function handleAddNewAddress() {
    setPersonAddress([
      ...personAddress,
      initialStateAdress
    ]);
  }

  function handleAddNewMail() {
    setPersonMail([
      ...personMail,
      { userMail: '' }
    ]);
  }

  function handleAddNewReference() {
    setPersonReferences([
      ...personReferences,
      initialStateReference
    ]);
  }

  function handleAddNewBankingReference() {
    setBankingReferences([
      ...bankingReferences,
      initialStateBankingReference
    ]);
  }

  function handleSubmitFormRegister(e) {
    e.preventDefault();
  }

  function handleChangeAddress(e) {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  }

  function handleButtonClickProgressErrorReference() {
    if (!errorReference) {
      setSuccessReference(false);
      setLoadingReference(true);
      timer.current = window.setTimeout(() => {
        setErrorReference(true);
        setLoadingReference(false);
      }, 2000);
    }
  }

  function handleButtonClickProgressReference() {
    if (!loadingReference) {
      setSuccessReference(false);
      setLoadingReference(true);
      timer.current = window.setTimeout(() => {
        setSuccessReference(true);
        setLoadingReference(false);
      }, 2000);
    }
  };

  function handleRemoveAddress(index) {
    const personAddressCopy = Array.from(personAddress);
    personAddressCopy.splice(index, 1);
    setPersonAddress(personAddressCopy);
    handleCloseModalRemoveAddress();
    console.log(personAddress);
  }

  function handleRemovePhone(index) {
    const personPhoneCopy = Array.from(personPhone);
    const elRemovido = personPhoneCopy.splice(index, 1);
    console.log(`elemento removido ->`, elRemovido);
    console.log(`array atualizado ->`, personPhoneCopy);
    setPersonPhone(personPhoneCopy);
    handleCloseModaRemovelPhone();
    console.log('array antigo atualizado', personPhone);
  }

  function handleRemoveMail(index) {
    const personMailCopy = Array.from(personMail);
    personMailCopy.splice(index, 1);
    setPersonMail(personMailCopy);
    handleCloseModalRemoveMail();
  }

  function handleRemoveReference(index) {
    const personReferenceCopy = Array.from(personReferences);
    personReferenceCopy.splice(index, 1);
    setPersonReferences(personReferenceCopy);
    handleCloseModalRemoveReference();
  }

  function handleRemoveBankingReference(index) {
    const bankingReferenceCopy = Array.from(bankingReferences);
    bankingReferenceCopy.splice(index, 1);
    setBankingReferences(bankingReferenceCopy);
    handleCloseModalRemoveBankingReference();
  }

  return (
    <div className={classes.root}>
      <ToastContainer />
      <CssBaseline />
      <Menus title="Cadastro de pessoa jurídica" />
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
                <Link to="/legal/persons/" className="link">
                  <IconButton>
                    <ArrowBack />
                  </IconButton>
                </Link>
              </Box>
            </CardContent>
          </Card>

          <div className={classes.tabArea}>
            <AppBar position="static" className={classes.appBar}>
              <Tabs
                value={valueTab}
                onChange={handleChangeTab}
                aria-label="simple tabs example"
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label="Dados pessoais" {...a11yProps(0)} />
                <Tab label="Endereço" {...a11yProps(1)} />
                <Tab label="Contatos" {...a11yProps(2)} />
                <Tab label="Referências" {...a11yProps(3)} />
                <Tab label="Dados bancários" {...a11yProps(4)} />
                <Tab label="Opções" {...a11yProps(5)} />
              </Tabs>
            </AppBar>
            <form onSubmit={(e) => handleSubmitFormRegister(e)} >
              <Box
                display="flex"
                flexDirection="column"
              >
                <Box flexGrow={1}>
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
                          name="nomeorrazaosocial"
                          variant="outlined"
                          value={person.nomeorrazaosocial}
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
                          name="fantasia"
                          variant="outlined"
                          value={legalPerson.fantasia}
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
                          label="CNPJ"
                          name="cpfcnpj"
                          variant="outlined"
                          value={person.cpfcnpj}
                          onChange={(e) => handleChangeInputsPerson(e)}

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
                          name="inscricao_estadual"
                          variant="outlined"
                          value={legalPerson.inscricao_estadual === null ? 'Não informado' : legalPerson.inscricao_estadual}
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
                          name="inscricao_municipal"
                          variant="outlined"
                          value={legalPerson.inscricao_municipal === null ? 'Não informado' : legalPerson.inscricao_municipal}
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
                          label="Data de abertura"
                          name="data_abertura"
                          variant="outlined"
                          value={legalPerson.data_abertura}
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
                          name="ramo"
                          variant="outlined"
                          value={legalPerson.ramo}
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
                          label="Tipo da empresa"
                          name="tipo_empresa"
                          variant="outlined"
                          value={legalPerson.tipo_empresa}
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
                              <TextField
                                fullWidth

                                required
                                label="CEP"
                                name="zipCode"
                                variant="outlined"
                                value={addressValue.cep}
                                onChange={(e) => handleChangeInputsAddress(e, index)}
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

                                required
                                label="Rua"
                                name="street"
                                variant="outlined"
                                value={addressValue.rua}
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
                                value={addressValue.bairro}
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
                                value={addressValue.numero}
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
                                value={addressValue.complemento === null ? 'Não informado' : addressValue.complemento}
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
                                value={addressValue.cidade}
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
                                name="stateAdress"
                                variant="outlined"
                                value={addressValue.estado_endereco}
                                onChange={(e) => handleChangeInputsAddress(e, index)}
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
                              <Tooltip title="Remover este endereço">
                                <Button
                                  style={{ background: red[300], color: '#FFF' }}
                                  variant="contained"
                                  size="small"
                                  onClick={() => handleClickOpenModalRemoveAddress(index)}
                                >
                                  Remover
                            </Button>
                              </Tooltip>
                            </Grid>
                          </Grid>
                        </Typography>
                      ))
                    }

                  </TabPanel>
                  {/* CONTATOS */}
                  <TabPanel value={valueTab} index={2}>
                    <Typography component="div" className={classes.containerInput}>
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
                      {
                        personPhone.length === 0 && (
                          <Typography component="h3" align="center" color="textSecondary">
                            Este registro não contém informações sobre telefones
                          </Typography>
                        )
                      }
                      <Typography component="div">
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

                            {
                              personPhone.map((phone, index) => (
                                <FormControl className={classes.inputList} variant="outlined" fullWidth key={index}>
                                  <InputLabel>Telefone</InputLabel>
                                  <OutlinedInput
                                    value={phone.tel}
                                    onChange={(e) => handleChangeInputsPhone(e, index)}
                                    fullWidth
                                    required
                                    label="Telefone"
                                    name="phoneNumber"
                                    endAdornment={
                                      <InputAdornment position="end">
                                        <Tooltip title="Deletar">
                                          <IconButton
                                            aria-label="Deletar"
                                            onClick={() => handleClickOpenModalRemovePhone(index)}
                                            edge="end"
                                          >
                                            <Delete size={8} style={{ color: red[300] }} />
                                          </IconButton>
                                        </Tooltip>
                                      </InputAdornment>
                                    }
                                    labelWidth={70}
                                  />
                                </FormControl>
                              ))
                            }
                          </Grid>
                        </Grid>
                      </Typography>
                    </Typography>
                    <Typography component="div" style={{ marginTop: '20px' }} className={classes.containerInput}>
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
                      {
                        personMail.length === 0 && (
                          <Typography component="h3" align="center" color="textSecondary">
                            Este registro não contém informações sobre email
                          </Typography>
                        )
                      }

                      <Typography component="div">
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
                              personMail.map((mail, index) => (
                                <FormControl className={classes.inputList} variant="outlined" fullWidth key={index}>
                                  <InputLabel>E-mail</InputLabel>
                                  <OutlinedInput
                                    value={mail.email}
                                    onChange={(e) => handleChangeInputsMails(e, index)}
                                    fullWidth
                                    required
                                    label="E-mail"
                                    name="userMail"
                                    endAdornment={
                                      <InputAdornment position="end">
                                        <Tooltip title="Deletar">
                                          <IconButton
                                            aria-label="Deletar"
                                            onClick={() => handleClickOpenModalRemoveMail(index)}
                                            edge="end"
                                          >
                                            <Delete size={8} style={{ color: red[300] }} />
                                          </IconButton>
                                        </Tooltip>
                                      </InputAdornment>
                                    }
                                    labelWidth={70}
                                  />
                                </FormControl>
                              ))
                            }
                          </Grid>
                        </Grid>
                      </Typography>
                    </Typography>
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

                                required
                                label="Nome"
                                name="nome"
                                variant="outlined"
                                value={reference.nome}
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
                                name="tipo"
                                variant="outlined"
                                value={reference.tipo}
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
                                name="tel"
                                variant="outlined"
                                value={reference.tel}
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
                                name="endereco"
                                variant="outlined"
                                value={reference.endereco}
                                onChange={(e) => handleChangeInputsReferences(e, index)}
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
                              <Tooltip title="Remover este registro">
                                <Button
                                  style={{ background: red[300], color: '#FFF' }}
                                  variant="contained"
                                  size="small"
                                  onClick={() => handleClickOpenModalRemoveReference(reference.id_referencia)}
                                >
                                  Remover
                            </Button>
                              </Tooltip>
                            </Grid>
                          </Grid>
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
                              <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel id="demo-simple-select-outlined-label">Banco</InputLabel>
                                <Select
                                  labelId="demo-simple-select-outlined-label"
                                  id="demo-simple-select-outlined"
                                  value={banking.id_bancos_fk}
                                  onChange={(e) => handleChangeInputsBankingReferences(e, index)}
                                  label="Banco"
                                  name="idBanking"
                                  required
                                  autoWidth={false}
                                  labelWidth={3}
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
                              <TextField
                                fullWidth

                                required
                                label="Tipo"
                                name="type"
                                variant="outlined"
                                value={banking.tipo}
                                onChange={(e) => handleChangeInputsBankingReferences(e, index)}
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

                                required
                                label="Conta"
                                name="account"
                                variant="outlined"
                                value={banking.conta}
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
                                value={banking.agencia}
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

                                required
                                label="Abertura"
                                name="opening"
                                variant="outlined"
                                value={banking.abertura}
                                onChange={(e) => handleChangeInputsBankingReferences(e, index)}
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
                              <Tooltip title="Remover este registro">
                                <Button
                                  style={{ background: red[300], color: '#FFF' }}
                                  variant="contained"
                                  size="small"
                                  onClick={() => handleClickOpenModalRemoveBankingReference(index)}
                                >
                                  Remover
                            </Button>
                              </Tooltip>
                            </Grid>
                          </Grid>
                        </Typography>
                      ))
                    }
                  </TabPanel>
                  {/* OPÇÕES */}
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
                        <FormControl variant="outlined" className={classes.formControl}>
                          <InputLabel id="demo-simple-select-outlined-label">Fornecedor</InputLabel>
                          <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={person.forn}
                            onChange={(e) => handleChangeInputsPerson(e)}
                            label="Fornecedor"
                            autoWidth={false}
                            labelWidth={3}
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

                </Box>

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
                      // className={buttonClassname}
                      // disabled={loading}
                      >
                        Salvar
                        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                      </Button>
                    </Box>
                  </Grid>
                </Box>
              </Box>


            </form>
          </div>
        </Container>

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
                className={buttonClassnameRemovePhone}
                disabled={loadingRemovePhone}
                onClick={() => handleRemovePhone(phoneId)}
              >
                Excluir
                  {loadingRemovePhone && <CircularProgress size={24} className={classes.buttonProgressRemovePhone} />}
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
                className={buttonClassnameRemoveAddress}
                disabled={loadingRemoveAddress}
                onClick={() => handleRemoveAddress(addressId)}
              >
                Excluir
                  {loadingRemoveAddress && <CircularProgress size={24} className={classes.buttonProgressRemoveAddress} />}
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
                className={buttonClassnameRemoveMail}
                disabled={loadingRemoveMail}
                onClick={() => handleRemoveMail(personMailId)}
              >
                Excluir
                  {loadingRemoveMail && <CircularProgress size={24} className={classes.buttonProgressRemoveMail} />}
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
                className={buttonClassnameRemoveReference}
                disabled={loadingRemoveReference}
                onClick={() => handleRemoveReference(personReferenceId)}
              >
                Excluir
                  {loadingRemoveReference && <CircularProgress size={24} className={classes.buttonProgressRemoveReference} />}
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
                className={buttonClassnameRemoveBankingReference}
                disabled={loadingRemoveBankingReference}
                onClick={() => handleRemoveBankingReference(bankingReferenceId)}
              >
                Excluir
                  {loadingRemoveReference && <CircularProgress size={24} className={classes.buttonProgressRemoveBankingReference} />}
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
