import React, { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { red } from '@material-ui/core/colors';
import {
  Box, Container, CssBaseline, Card, CardContent, IconButton, Grid, TextField, AppBar, Tabs, Tab, Typography, CircularProgress,
  Divider, Button, Tooltip, Dialog, DialogContent, DialogContentText, DialogActions, DialogTitle, Select, MenuItem, FormControl,
  InputLabel
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
  "id_pessoa_cod": 0,
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
  "id_pessoa_cod_fk": 0,
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
  "idPerson": 0,
  "referenceSituation": 1,
  "referenceType": "",
  "referenceName": "",
  "referencePhone": "",
  "referenceAdress": ""
}

export default function EditLegalPerson(props) {
  const classes = useStyles();
  const timer = useRef();
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
  const [loadingMail, setLoadingMail] = useState(false);
  const [successMail, setSuccessMail] = useState(false);
  const [errorMail, setErrorMail] = useState(false);
  const [loadingReference, setLoadingReference] = useState(false);
  const [successReference, setSuccessReference] = useState(false);
  const [errorReference, setErrorReference] = useState(false);
  const idPerson = props.match.params.id;
  const [valueTab, setValueTab] = useState(0);
  const [bankingReferences, setBankingReferences] = useState([{}]);
  const [person, setPerson] = useState(initialStatePerson);
  const [personAddress, setPersonAddress] = useState([{}]);
  const [addressId, setAddressId] = useState(0);
  const [personMail, setPersonMail] = useState([{}]);
  const [personPhone, setPersonPhone] = useState([{}]);
  const [phoneId, setPhoneId] = useState(0);
  const [legalPerson, setLegalPerson] = useState(initialStateLegalPerson);
  const [personReferences, setPersonReferences] = useState([{}]);
  const [openModalPhone, setOpenModalPhone] = useState(false);
  const [openModalRemovePhone, setOpenModalRemovePhone] = useState(false);
  const [openModalMail, setOpenModalMail] = useState(false);
  const [openModalAddress, setOpenModalAddress] = useState(false);
  const [openModalRemoveAddress, setOpenModalRemoveAddress] = useState(false);
  const [openModalReference, setOpenModalReference] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mail, setMail] = useState('');
  const [address, setAddress] = useState(initialStateAdress);
  const [reference, setReference] = useState(initialStateReference);


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
    setPhoneNumber('');
  };

  const handleClickOpenModalMail = () => {
    setOpenModalMail(true);
  };

  const handleCloseModalMail = () => {
    setOpenModalMail(false);
    setMail('');
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

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    const csrfToken = getCookie('csrftoken');
    api.get(`/persons/legal/details/${idPerson}`, {
      headers: {
        'X-CSRFToken': csrfToken
      }
    }).then(response => {
      const { data } = response;
      setBankingReferences(data.bankingReferences);
      setPerson(data.person);
      setPersonAddress(data.personAdress);
      setPersonMail(data.personMail);
      setPersonPhone(data.personPhone);
      setLegalPerson(data.personPhysical);
      setPersonReferences(data.personReferences);
    }).catch(reject => {
      console.log(reject);
    });
  }, [idPerson]);

  function handleChangeInputsPerson(e) {
    const { name, value } = e.target;
    setPerson({ ...person, [name]: value });
  }

  function handleChangeInputsLegalPerson(e) {
    const { name, value } = e.target;
    setLegalPerson({ ...legalPerson, [name]: value });
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

  function handleChangeReference(e) {
    const { name, value } = e.target;
    setReference({ ...reference, [name]: value });
  }

  function handleAddNewPhone(e) {
    e.preventDefault();
    const csrfToken = getCookie('csrftoken');

    let phones = [
      {
        "idPerson": Number(idPerson),
        "phoneSituation": 1,
        phoneNumber
      }
    ];

    api.post(`/phones/create`, { phones }, {
      headers: {
        'X-CSRFToken': csrfToken
      }
    }).then(response => {
      handleButtonClickProgressPhone();
      setTimeout(() => {
        toast.success('Telefone cadastrado com sucesso!');
      }, 2000);
    }).catch(reject => {
      handleButtonClickProgressErrorPhone();
      const { data } = reject.response;
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
    });
  }

  function handleAddNewAddress(e) {
    e.preventDefault();
    const csrfToken = getCookie('csrftoken');

    let adresses = [{ ...address, idPerson: Number(idPerson) }];

    api.post(`/adresses/create`, { adresses }, {
      headers: {
        headers: {
          'X-CSRFToken': csrfToken
        }
      }
    }).then(response => {
      handleButtonClickProgressAddress();
      setTimeout(() => {
        toast.success('Endereço cadastrado com sucesso!');
      }, 2000);
    }).catch(reject => {
      // const { data } = reject.response;
      console.log(reject);
      handleButtonClickProgressErrorAddress();
      setTimeout(() => {
        toast.error(`erro`);
      }, 2000);
    });
  }

  function handleAddNewMail(e) {
    e.preventDefault();
    const csrfToken = getCookie('csrftoken');

    let mails = [
      {
        "idPerson": Number(idPerson),
        "situation": 1,
        "userMail": mail
      }
    ];

    api.post(`/mails/create`, { mails }, {
      headers: {
        'X-CSRFToken': csrfToken
      }
    }).then(response => {
      handleButtonClickProgressMail();
      setTimeout(() => {
        toast.success('E-mail cadastrado com sucesso!');
      }, 2000);
    }).catch(reject => {
      handleButtonClickProgressErrorMail();
      const { data } = reject.response;
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
    });
  }

  function handleAddNewReference(e) {
    e.preventDefault();
    const csrfToken = getCookie('csrftoken');

    let personReferences = [{
      ...reference, "idPerson": Number(idPerson)
    }];

    api.post('/persons_references/create', { personReferences }, {
      headers: {
        'X-CSRFToken': csrfToken
      }
    }).then(response => {
      handleButtonClickProgressReference();
      setTimeout(() => {
        toast.success('Registro de referência cadastrado com sucesso!');
      }, 2000);
    }).catch(reject => {
      handleButtonClickProgressErrorReference();
      const { data } = reject.response;
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
    });
  }

  function handleSubmitFormEdit(e) {
    e.preventDefault();
  }

  function handleChangeAddress(e) {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  }

  function handleButtonClickProgressErrorAddress() {
    if (!loading) {
      setSuccessAddress(false);
      setLoadingAddress(true);
      timer.current = window.setTimeout(() => {
        setErrorAddress(true);
        setLoadingAddress(false);
      }, 2000);
    }
  }

  function handleButtonClickProgressAddress() {
    if (!loading) {
      setSuccessAddress(false);
      setLoadingAddress(true);
      timer.current = window.setTimeout(() => {
        setSuccessAddress(true);
        setLoadingAddress(false);
      }, 2000);
    }
  };

  function handleButtonClickProgressErrorRemoveAddress() {
    if (!loading) {
      setSuccessRemoveAddress(false);
      setLoadingRemoveAddress(true);
      timer.current = window.setTimeout(() => {
        setErrorRemoveAddress(true);
        setLoadingRemoveAddress(false);
      }, 2000);
    }
  }

  function handleButtonClickProgressRemoveAddress() {
    if (!loading) {
      setSuccessRemoveAddress(false);
      setLoadingRemoveAddress(true);
      timer.current = window.setTimeout(() => {
        setSuccessRemoveAddress(true);
        setLoadingRemoveAddress(false);
      }, 2000);
    }
  };

  function handleButtonClickProgressErrorRemovePhone() {
    if (!loading) {
      setSuccessRemovePhone(false);
      setLoadingRemovePhone(true);
      timer.current = window.setTimeout(() => {
        setErrorRemovePhone(true);
        setLoadingRemovePhone(false);
      }, 2000);
    }
  }

  function handleButtonClickProgressRemovePhone() {
    if (!loading) {
      setSuccessRemovePhone(false);
      setLoadingRemovePhone(true);
      timer.current = window.setTimeout(() => {
        setSuccessRemovePhone(true);
        setLoadingRemovePhone(false);
      }, 2000);
    }
  };

  function handleButtonClickProgressErrorPhone() {
    if (!loading) {
      setSuccessPhone(false);
      setLoadingPhone(true);
      timer.current = window.setTimeout(() => {
        setErrorPhone(true);
        setLoadingPhone(false);
      }, 2000);
    }
  }

  function handleButtonClickProgressPhone() {
    if (!loading) {
      setSuccessPhone(false);
      setLoadingPhone(true);
      timer.current = window.setTimeout(() => {
        setSuccessPhone(true);
        setLoadingPhone(false);
      }, 2000);
    }
  };

  function handleButtonClickProgressErrorMail() {
    if (!loading) {
      setSuccessMail(false);
      setLoadingMail(true);
      timer.current = window.setTimeout(() => {
        setErrorMail(true);
        setLoadingMail(false);
      }, 2000);
    }
  }

  function handleButtonClickProgressMail() {
    if (!loading) {
      setSuccessMail(false);
      setLoadingMail(true);
      timer.current = window.setTimeout(() => {
        setSuccessMail(true);
        setLoadingMail(false);
      }, 2000);
    }
  };

  function handleButtonClickProgressErrorReference() {
    if (!loading) {
      setSuccessReference(false);
      setLoadingReference(true);
      timer.current = window.setTimeout(() => {
        setErrorReference(true);
        setLoadingReference(false);
      }, 2000);
    }
  }

  function handleButtonClickProgressReference() {
    if (!loading) {
      setSuccessReference(false);
      setLoadingReference(true);
      timer.current = window.setTimeout(() => {
        setSuccessReference(true);
        setLoadingReference(false);
      }, 2000);
    }
  };

  function handleRemoveAddress(id) {
    console.log(id);
  }

  function handleRemovePhone(id) {
    console.log(id);
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
            <form onSubmit={(e) => handleSubmitFormEdit(e)} >
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
                        onClick={handleClickOpenModalAddress}
                      >
                        Adicionar
                      </Button>
                    </Tooltip>
                  </Grid>
                </Grid>
                <Divider style={{ marginBottom: '20px', marginTop: '20px' }} />
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

                            required
                            label="Estado"
                            name="estado_endereco"
                            variant="outlined"
                            value={address.estado_endereco}
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
                          xs={3}
                          sm={3}
                          xl={3}
                        >
                          <Tooltip title="Remover este endereço">
                            <Button
                              style={{ background: red[300], color: '#FFF' }}
                              variant="contained"
                              size="small"
                              onClick={() => handleClickOpenModalRemoveAddress(address.id_enderecos)}
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
                          onClick={handleClickOpenModalPhone}
                        >
                          Adicionar
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
                  {
                    personPhone.map((phone, index) => (
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
                              label="Telefone"
                              name="tel"
                              variant="outlined"
                              value={phone.tel}
                              onChange={(e) => handleChangeInputsPhone(e)}
                            />
                          </Grid>
                          <Tooltip title="Deletar">
                            <IconButton aria-label="Deletar" onClick={() => handleClickOpenModalRemovePhone(phone.id_telefone)}>
                              <Delete size={8} style={{ color: red[300] }} />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Typography>
                    ))
                  }
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
                          onClick={handleClickOpenModalMail}
                        >
                          Adicionar
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
                  {
                    personMail.map((mail, index) => (
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
                            <TextField
                              fullWidth

                              required
                              label="E-mail"
                              name="email"
                              variant="outlined"
                              value={mail.email}
                              onChange={(e) => handleChangeInputsMails(e)}
                            />
                          </Grid>
                          <Tooltip title="Deletar">
                            <IconButton aria-label="Deletar">
                              <Delete size={8} style={{ color: red[300] }} />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Typography>
                    ))
                  }
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
                        onClick={handleClickOpenModalReference}
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

                            required
                            label="Endereço"
                            name="endereco"
                            variant="outlined"
                            value={reference.endereco}
                            onChange={(e) => handleChangeInputsReferences(e)}
                          />
                        </Grid>
                      </Grid>
                    </Typography>
                  ))
                }

              </TabPanel>
              {/* DADOS BANCÁRIOS */}
              <TabPanel value={valueTab} index={4}>
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
                          <TextField
                            fullWidth

                            required
                            label="Banco"
                            name="id_bancos_fk"
                            variant="outlined"
                            value={banking.id_bancos_fk}
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

                            required
                            label="Abertura"
                            name="abertura"
                            variant="outlined"
                            value={banking.abertura}
                            onChange={(e) => handleChangeInputsBankingReferences(e)}
                          />
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
            </form>
          </div>
        </Container>

        {/* REGISTER PHONE MODAL */}
        <Dialog
          open={openModalPhone}
          onClose={handleCloseModalPhone}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Adicionar número de telefone</DialogTitle>
          <form onSubmit={(e) => handleAddNewPhone(e)}>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
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
                      required
                      label="Telefone"
                      name="tel"
                      variant="outlined"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </DialogContentText>
            </DialogContent>
            <Divider style={{ marginTop: '20px' }} />
            <DialogActions>
              <Box
                display="flex"
                justifyContent="flex-start"
                alignItems="flex-end"
                padding="15px"
              >
                <Button onClick={handleCloseModalPhone} style={{ color: red[300], marginRight: '10px' }}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  autoFocus
                  className={buttonClassnamePhone}
                  disabled={loadingPhone}
                >
                  Salvar
                {loadingPhone && <CircularProgress size={24} className={classes.buttonProgressPhone} />}
                </Button>
              </Box>
            </DialogActions>
          </form>
        </Dialog>

        {/* REGISTER MAIL MODAL */}
        <Dialog
          open={openModalMail}
          onClose={handleCloseModalMail}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="sm"
        >
          <DialogTitle id="alert-dialog-title">Adicionar um novo endereço de e-mail</DialogTitle>
          <form onSubmit={(e) => handleAddNewMail(e)}>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
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
                      required
                      label="E-mail"
                      name="mail"
                      variant="outlined"
                      value={mail}
                      onChange={(e) => setMail(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </DialogContentText>
            </DialogContent>
            <Divider style={{ marginTop: '20px' }} />
            <DialogActions>
              <Box
                display="flex"
                justifyContent="flex-start"
                alignItems="flex-end"
                padding="15px"
              >
                <Button onClick={handleCloseModalMail} style={{ color: red[300], marginRight: '10px' }}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  autoFocus
                  className={buttonClassnameMail}
                  disabled={loadingMail}
                >
                  Salvar
                {loadingMail && <CircularProgress size={24} className={classes.buttonProgressMail} />}
                </Button>
              </Box>
            </DialogActions>
          </form>
        </Dialog>

        {/* REGISTER ADDRESS MODAL */}
        <Dialog
          open={openModalAddress}
          onClose={handleCloseModalAddress}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
        >
          <form onSubmit={(e) => handleAddNewAddress(e)} autoComplete="false">
            <DialogTitle id="alert-dialog-title">Adicionar um novo endereço</DialogTitle>
            <DialogContent>
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
                    value={address.zipCode}
                    onChange={(e) => handleChangeAddress(e)}
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
                    value={address.street}
                    onChange={(e) => handleChangeAddress(e)}
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
                    onChange={(e) => handleChangeAddress(e)}
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
                    onChange={(e) => handleChangeAddress(e)}
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
                    onChange={(e) => handleChangeAddress(e)}
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
                    onChange={(e) => handleChangeAddress(e)}
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
                    value={address.stateAdress}
                    onChange={(e) => handleChangeAddress(e)}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <Divider style={{ marginTop: '20px' }} />
            <DialogActions>
              <Box
                display="flex"
                justifyContent="flex-start"
                alignItems="flex-end"
                padding="15px"
              >
                <Button onClick={handleCloseModalAddress} style={{ color: red[300], marginRight: '10px' }}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  autoFocus
                  className={buttonClassnameAddress}
                  disabled={loadingAddress}
                >
                  Salvar
                  {loadingAddress && <CircularProgress size={24} className={classes.buttonProgressAddress} />}
                </Button>
              </Box>
            </DialogActions>
          </form>
        </Dialog>

        {/* REGISTER REFERENCES MODAL */}
        <Dialog
          open={openModalReference}
          onClose={handleCloseModalReference}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
        >
          <DialogTitle id="alert-dialog-title">Adicionar um registro para referência</DialogTitle>
          <form onSubmit={(e) => handleAddNewReference(e)}>
            <DialogContent>
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
                    onChange={(e) => handleChangeReference(e)}
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
                    onChange={(e) => handleChangeReference(e)}
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
                    onChange={(e) => handleChangeReference(e)}
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
                    onChange={(e) => handleChangeReference(e)}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <Divider style={{ marginTop: '20px' }} />
            <DialogActions>
              <Box
                display="flex"
                justifyContent="flex-start"
                alignItems="flex-end"
                padding="15px"
              >
                <Button onClick={handleCloseModalReference} style={{ color: red[300], marginRight: '10px' }}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  autoFocus
                  className={buttonClassnameReference}
                  disabled={loadingReference}
                >
                  Salvar
                {loadingReference && <CircularProgress size={24} className={classes.buttonProgressReference} />}
                </Button>
              </Box>
            </DialogActions>
          </form>
        </Dialog>

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

        <Box pt={4}>
          <Copyright />
        </Box>
      </main>
    </div>
  );
}
