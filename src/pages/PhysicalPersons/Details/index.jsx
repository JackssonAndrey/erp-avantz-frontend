import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { orange } from '@material-ui/core/colors';
import {
  Box, Container, CssBaseline, Card, CardContent, IconButton, Grid, TextField, AppBar, Tabs, Tab, Typography, Select, MenuItem, FormControl, InputLabel
} from '@material-ui/core';
import { ArrowBack, Edit } from '@material-ui/icons';
import SwipeableViews from 'react-swipeable-views';

import Menus from '../../../components/Menus';
import Copyright from '../../../components/Copyright';
import api from '../../../services/api';
import getCookie from '../../../utils/functions';
import useStyles from './styles';

import 'react-toastify/dist/ReactToastify.css';

const initialStatePerson = {
  "id_pessoa_cod": 0,
  "id_instituicao_fk": 0,
  "tipo": 1,
  "sit": 2,
  "forn": 0,
  "cpfcnpj": "",
  "nomeorrazaosocial": "",
  "foto": "",
  "img_bites": 0,
  "limite": "",
  "saldo": ""
}

const initialStatePhysicalPerson = {
  "id_pessoa_fisica": 0,
  "id_pessoa_cod_fk": 0,
  "identidade": "",
  "emissor_identidade": "",
  "id_municipio_fk": 0,
  "id_uf_municipio_fk": 7,
  "data_de_nascimento": "",
  "tratam": 0,
  "apelido": "",
  "sexo": "",
  "pai": null,
  "mae": null,
  "profissao": null,
  "ctps": null,
  "salario": "0.00",
  "empresa": null,
  "resp": null,
  "cnpj": null,
  "iest": null,
  "imun": null,
  "emprend": "",
  "orendas": null,
  "vrendas": "0.00",
  "irpf": 0,
  "estcivil": 0,
  "depend": 0,
  "pensao": "0.00",
  "conjuge": null,
  "cpfconj": null,
  "profconj": null,
  "emprconj": null,
  "rendaconj": "0.00",
  "telconj": null,
  "mailconj": null,
  "data_criacao": "",
  "data_atualizacao": ""
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
  const idPerson = props.match.params.id;
  const [valueTab, setValueTab] = useState(0);
  const [bankingReferences, setBankingReferences] = useState([{}]);
  const [person, setPerson] = useState(initialStatePerson);
  const [personAddress, setPersonAddress] = useState([{}]);
  const [personMail, setPersonMail] = useState([{}]);
  const [personPhone, setPersonPhone] = useState([{}]);
  const [physicalPerson, setPhysicalPerson] = useState(initialStatePhysicalPerson);
  const [personReferences, setPersonReferences] = useState([{}]);
  const [registeredBanks, setRegisteredBanks] = useState([]);

  const handleChangeTab = (event, newValue) => {
    setValueTab(newValue);
  };

  const handleChangeIndex = (index) => {
    setValueTab(index);
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
                  <IconButton>
                    <ArrowBack />
                  </IconButton>
                </Link>

                <Link to={`/physical/person/edit/${idPerson}`} className="link" >
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
                <Tab label="Financeiro" {...a11yProps(5)} />
                <Tab label="Opções" {...a11yProps(6)} />
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
                        value=""
                        onChange={(e) => handleChangeInputsPhysicalPerson(e)}
                        label="Órgão Emissor/UF"
                        disabled
                        name=""
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
                        value=""
                        onChange={(e) => handleChangeInputsPhysicalPerson(e)}
                        label="Naturalidade"
                        disabled
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
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
      </main>
    </div>
  );
}
