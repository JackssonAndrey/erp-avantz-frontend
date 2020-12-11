import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { makeStyles } from '@material-ui/core/styles';
import { green, orange } from '@material-ui/core/colors';
import {
  Box, Container, CssBaseline, Card, CardContent, IconButton, Grid, TextField, Avatar, List, ListItem, ListItemText, Divider,
  ListItemSecondaryAction, Checkbox, AppBar, Tabs, Tab, Typography
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
    marginTop: theme.spacing(3)
  },
  appBar: {
    backgroundColor: '#FFF'
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
          <Typography>{children}</Typography>
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

  function handleChangeInputsPerson(e) {
    const { name, value } = e.target;

    setPerson({ ...person, [name]: value });
  }

  function handleChangeInputsLegalPerson(e) {
    const { name, value } = e.target;

    setPerson({ ...person, [name]: value });
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
                    value={legalPerson.inscricao_estadual}
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
                    value={legalPerson.inscricao_municipal}
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
                    name="street"
                    variant="outlined"
                    value=""
                    onChange=""
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
                    name="neighborhood"
                    variant="outlined"
                    value=""
                    onChange=""
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
                    name="number"
                    variant="outlined"
                    value=""
                    onChange=""
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
                    name="complement"
                    variant="outlined"
                    value=""
                    onChange=""
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
                    name="city"
                    variant="outlined"
                    value=""
                    onChange=""
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
                    name="state"
                    variant="outlined"
                    value=""
                    onChange=""
                  />
                </Grid>
              </Grid>
            </TabPanel>
            {/* CONTATOS */}
            <TabPanel value={valueTab} index={2}>
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
                    name="phone"
                    variant="outlined"
                    value=""
                    onChange=""
                  />
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
                  <TextField
                    fullWidth
                    disabled
                    required
                    label="E-mail"
                    name="mail"
                    variant="outlined"
                    value=""
                    onChange=""
                  />
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
                  xs={6}
                  sm={6}
                  xl={6}
                >
                  <TextField
                    fullWidth
                    disabled
                    required
                    label="Nome"
                    name="referenceName"
                    variant="outlined"
                    value=""
                    onChange=""
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
                    name="referenceType"
                    variant="outlined"
                    value=""
                    onChange=""
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
                    name="referencePhone"
                    variant="outlined"
                    value=""
                    onChange=""
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
                    name="referenceAddress"
                    variant="outlined"
                    value=""
                    onChange=""
                  />
                </Grid>
              </Grid>
            </TabPanel>
            {/* DADOS BANCÁRIOS */}
            <TabPanel value={valueTab} index={4}>
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
                    label="Banco"
                    name="banking"
                    variant="outlined"
                    value=""
                    onChange=""
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
                    label="Tipo"
                    name="accountType"
                    variant="outlined"
                    value=""
                    onChange=""
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
                    name="accountNumber"
                    variant="outlined"
                    value=""
                    onChange=""
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
                    name="agency"
                    variant="outlined"
                    value=""
                    onChange=""
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
                    name="openingAccount"
                    variant="outlined"
                    value=""
                    onChange=""
                  />
                </Grid>
              </Grid>
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
                    disabled
                    required
                    label="Fornecedor"
                    name="provider"
                    variant="outlined"
                    value=""
                    onChange=""
                  />
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
