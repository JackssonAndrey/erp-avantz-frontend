import React, { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { makeStyles } from '@material-ui/core/styles';
import { green, red } from '@material-ui/core/colors';
import {
  Box, Container, CssBaseline, Card, CardContent, IconButton, Grid, TextField, AppBar, Tabs, Tab, Typography, CircularProgress,
  Divider, Button, Tooltip, Dialog, DialogContent, DialogContentText, DialogActions, DialogTitle
} from '@material-ui/core';
import PropTypes from 'prop-types';

import { ArrowBack, Edit, Delete } from '@material-ui/icons';

import Menus from '../../../components/Menus';
import Copyright from '../../../components/Copyright';
import api from '../../../services/api';
import getCookie from '../../../utils/functions';

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
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  buttonError: {
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  cardContent: {
    marginTop: theme.spacing(3)
  },
  avatarLarge: {
    width: theme.spacing(10),
    height: theme.spacing(10)
  },
  tabArea: {
    marginTop: theme.spacing(3),
    boxShadow: '0 3px 3px #9e9e9e',
    minHeight: '400px',
    backgroundColor: '#FFF'
  },
  appBar: {
    backgroundColor: '#FFF'
  },
  containerInput: {
  }
}));

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

export default function EditLegalPerson(props) {
  const classes = useStyles();
  const timer = useRef();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const idPerson = props.match.params.id;
  const [valueTab, setValueTab] = useState(0);
  const [bankingReferences, setBankingReferences] = useState([{}]);
  const [person, setPerson] = useState(initialStatePerson);
  const [personAddress, setPersonAddress] = useState([{}]);
  const [personMail, setPersonMail] = useState([{}]);
  const [personPhone, setPersonPhone] = useState([{}]);
  const [legalPerson, setLegalPerson] = useState(initialStateLegalPerson);
  const [personReferences, setPersonReferences] = useState([{}]);
  const [openModalPhone, setOpenModalPhone] = useState(false);
  const [openModalMail, setOpenModalMail] = useState(false);
  const [openModalAddress, setOpenModalAddress] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mail, setMail] = useState('');
  const [address, setAddress] = useState([{}]);

  const handleClickOpenModalPhone = () => {
    setOpenModalPhone(true);
  };

  const handleCloseModalPhone = () => {
    setOpenModalPhone(false);
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

  const handleChangeTab = (event, newValue) => {
    setValueTab(newValue);
  };

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
    [classes.buttonError]: error,
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

  function handleAddNewPhone() {
    setPersonPhone([
      { tel: '' }
    ]);
  }

  function handleSubmitFormEdit(e) {
    e.preventDefault();


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
                            <IconButton aria-label="Deletar">
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
                    <TextField
                      fullWidth

                      required
                      label="Fornecedor"
                      name="forn"
                      variant="outlined"
                      value={person.forn === 1 ? 'Sim' : 'Não'}
                      onChange={(e) => handleChangeInputsPerson(e)}
                    />
                  </Grid>
                </Grid>
              </TabPanel>

              <Grid
                alignItems="flex-end"
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
            </form>
          </div>
        </Container>

        <Dialog
          open={openModalPhone}
          onClose={handleCloseModalPhone}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Adicionar número de telefone</DialogTitle>
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
          <DialogActions>
            <Button onClick={handleCloseModalPhone} style={{ color: red[300] }}>
              Cancelar
            </Button>
            <Button onClick={handleCloseModalPhone} color="primary" variant="contained" autoFocus>
              Salvar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openModalMail}
          onClose={handleCloseModalMail}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="sm"
        >
          <DialogTitle id="alert-dialog-title">Adicionar um novo endereço de e-mail</DialogTitle>
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
          <DialogActions>
            <Button onClick={handleCloseModalMail} style={{ color: red[300] }}>
              Cancelar
            </Button>
            <Button onClick={handleCloseModalMail} color="primary" variant="contained" autoFocus>
              Salvar
            </Button>
          </DialogActions>
        </Dialog>

        <Box pt={4}>
          <Copyright />
        </Box>
      </main>
    </div>
  );
}
