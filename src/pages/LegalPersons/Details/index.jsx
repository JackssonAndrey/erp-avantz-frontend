import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { makeStyles } from '@material-ui/core/styles';
import { green, orange } from '@material-ui/core/colors';
import {
  Box, Container, CssBaseline, Card, CardContent, IconButton, Grid, TextField, AppBar, Tabs, Tab, Typography, Select, MenuItem,
  FormControl, InputLabel
} from '@material-ui/core';
import PropTypes from 'prop-types';

import { ArrowBack, Edit } from '@material-ui/icons';

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
  },
  formControl: {
    width: '100%'
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

export default function LegalPersonDetails(props) {
  const classes = useStyles();
  const idPerson = props.match.params.id;
  const [valueTab, setValueTab] = useState(0);
  const [bankingReferences, setBankingReferences] = useState([{}]);
  const [person, setPerson] = useState(initialStatePerson);
  const [personAddress, setPersonAddress] = useState([{}]);
  const [personMail, setPersonMail] = useState([{}]);
  const [personPhone, setPersonPhone] = useState([{}]);
  const [legalPerson, setLegalPerson] = useState(initialStateLegalPerson);
  const [personReferences, setPersonReferences] = useState([{}]);
  const [registeredBanks, setRegisteredBanks] = useState([]);

  const handleChangeTab = (event, newValue) => {
    setValueTab(newValue);
  };

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

  useEffect(() => {
    (async function () {
      try {
        const { data } = await api.get('/banking');
        setRegisteredBanks(data);
      } catch (err) {
        const { data } = err.response;
        toast.error('Não foi possível selecionar os bancos pré cadastrados.');
        // console.log(data.datail);
      }
    })();
  }, []);

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

                <Link to={`/legal/person/edit/${idPerson}`} className="link" >
                  <IconButton>
                    <Edit style={{ color: orange[300] }} />
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
                    label="Nome fantasia"
                    name="fantasia"
                    variant="outlined"
                    value={legalPerson.fantasia}
                    onChange={(e) => handleChangeInputsLegalPerson(e)}
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
                    name="cpfcnpj"
                    variant="outlined"
                    value={person.cpfcnpj}
                    onChange={(e) => handleChangeInputsPerson(e)}
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
                    name="inscricao_estadual"
                    variant="outlined"
                    value={legalPerson.inscricao_estadual === null ? 'Não informado' : legalPerson.inscricao_estadual}
                    onChange={(e) => handleChangeInputsLegalPerson(e)}
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
                    name="inscricao_municipal"
                    variant="outlined"
                    value={legalPerson.inscricao_municipal === null ? 'Não informado' : legalPerson.inscricao_municipal}
                    onChange={(e) => handleChangeInputsLegalPerson(e)}
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
                    label="Data de abertura"
                    name="data_abertura"
                    variant="outlined"
                    value={legalPerson.data_abertura}
                    onChange={(e) => handleChangeInputsLegalPerson(e)}
                    disabled
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
                    label="Tipo da empresa"
                    name="tipo_empresa"
                    variant="outlined"
                    value={legalPerson.tipo_empresa}
                    onChange={(e) => handleChangeInputsLegalPerson(e)}
                    disabled
                  />
                </Grid>
              </Grid>
            </TabPanel>
            {/* ENDEREÇOS */}
            <TabPanel value={valueTab} index={1}>
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
                  </Typography>
                ))
              }

            </TabPanel>
            {/* CONTATOS */}
            <TabPanel value={valueTab} index={2}>
              <Typography component="div" className={classes.containerInput}>
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
                    </Typography>
                  ))
                }
              </Typography>
              <Typography component="div" className={classes.containerInput}>
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
                      disabled
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
          </div>
        </Container>

        <Box pt={4}>
          <Copyright />
        </Box>
      </main>
    </div>
  );
}
