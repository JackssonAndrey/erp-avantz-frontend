import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
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
  Button,
  InputAdornment
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

const initialStateProduct = {
  codprod: 0,
  ativo: 0,
  descr: "",
  descres: "",
  und: 0,
  grupo: 0,
  tam: "",
  larg: "",
  alt: "",
  cubag: "",
  peso: "",
  codbarra: "",
  fabr: 0,
  forn: 0,
  caract: "",
  ncm: "",
  cest: "",
  desnf: "",
  foto: "",
}

const initialStateProductItems = {
  id: 0,
  id_produtos: 0,
  codprod: 0,
  ativo: 0,
  bxest: 0,
  est_minimo: "",
  est_fiscal: "",
  est_frente: "",
  est_dep1: "",
  est_dep2: "",
  est_dep3: "",
  compra: "",
  frete: "",
  ipi: "",
  aliq: 0,
  custo: "",
  lucro: "",
  prvenda1: "",
  prvenda2: "",
  prvenda3: "",
  locavel: 0,
  prloc: "",
  vdatac: 0,
  qtdatac: "",
  pratac: "",
  loc_frente: "",
  loc_dep1: "",
  loc_dep2: "",
  loc_dep3: "",
  comissao_atv: 0,
  comissao_val: ""
}

export default function DetailsProduct(props) {
  const idProduct = props.match.params.id;
  const classes = useStyles();
  const theme = useTheme();
  const timer = useRef();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [defaultButton, setDefaultButton] = useState(false);
  const [valueTab, setValueTab] = useState(0);
  const [productData, setProductData] = useState(initialStateProduct);
  const [productItemData, setProductItemData] = useState(initialStateProductItems);
  const [productsUnits, setProductsUnits] = useState([{}]);
  const [openModal, setOpenModal] = useState(false);
  const [userPermissions, setUserPermissions] = useState([]);
  const [fabricators, setFabricators] = useState([{}]);
  const [groups, setGroups] = useState([]);
  const [institutionSettings, setInstitutionSettings] = useState({});

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/products/details/${idProduct}`);
        setProductData(data);
      } catch (error) {
        const { data } = error.response;
        toast.error(`${data.detail}`);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/prod-items/${idProduct}`);
        setProductItemData(data);
      } catch (error) {
        const { data } = error.response;
        toast.error(`${data.detail}`);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/settings`);
        setInstitutionSettings(data);
      } catch (error) {
        const { data } = error.response;
        toast.error(`${data.detail}`);
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

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/units');
        setProductsUnits(data);
      } catch (err) {
        const { data } = error.response;
        toast.error(`${data.detail}`);
      }
    })();
  }, []);

  useEffect(() => {
    const csrfToken = getCookie('csrftoken');

    (async () => {
      try {
        const { data } = await api.get('/prod-groups', {
          headers: {
            'X-CSRFToken': csrfToken
          }
        });
        setGroups(data);
      } catch (err) {
        const { data } = err.response;
        toast.error(`${data.detail}`);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/fabricator');
        setFabricators(data);
      } catch (err) {
        const { data } = err.response;
        toast.error(`${data.detail}`);
      }
    })();
  }, []);

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

  function handleOnChangeInputsProduct(e) {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  }

  function handleOnChangeInputsProductItems(e) {
    const { name, value } = e.target;
    setProductItemData({ ...productItemData, [name]: value });
  }

  async function handleDelete() {
    const csrftoken = getCookie('csrftoken');

    try {
      await api.put(`/products/deactivate/${idProduct}`, {
        headers: {
          'X-CSRFToken': csrftoken
        }
      });
      handleButtonClickProgress();
      setTimeout(() => {
        toast.success('Registro do produto desativado com sucesso!');
      }, 2000);
      setTimeout(() => {
        handleCloseModal();
        history.push('/products');
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
      <Menus title="Detalhes do produto" />
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
                <Link to="/products" className="link">
                  <Tooltip title="Voltar" arrow>
                    <IconButton>
                      <ArrowBack />
                    </IconButton>
                  </Tooltip>
                </Link>

                {
                  userPermissions[1] === '1' && (
                    <Link to={`/products/edit/${idProduct}`} className="link" >
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
                <Tab label="Dados do produto" {...a11yProps(0)} />
                <Tab label="Estoque" {...a11yProps(1)} />
                <Tab label="Preços" {...a11yProps(2)} />
                {/*
                <Tab label="Endereço" {...a11yProps(3)} />
                <Tab label="Contatos" {...a11yProps(4)} />
                <Tab label="Referências" {...a11yProps(5)} />
                <Tab label="Dados bancários" {...a11yProps(6)} />
                <Tab label="Financeiro" {...a11yProps(7)} />
                <Tab label="Opções" {...a11yProps(8)} /> */}
              </Tabs>
            </AppBar>
            <SwipeableViews
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={valueTab}
              onChangeIndex={handleChangeIndex}
            >
              <TabPanel value={valueTab} index={0}>
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    item
                    xl={2}
                    xs={2}
                    sm={2}
                  >
                    <TextField
                      fullWidth
                      required
                      disabled
                      label="Código"
                      name="codprod"
                      variant="outlined"
                      value={productData.codprod}
                      onChange={(e) => handleOnChangeInputsProduct(e)}
                    />
                  </Grid>
                  <Grid
                    item
                    xl={5}
                    xs={5}
                    sm={5}
                  >
                    <TextField
                      fullWidth
                      required
                      disabled
                      label="Nome"
                      name="descr"
                      variant="outlined"
                      value={productData.descr}
                      onChange={(e) => handleOnChangeInputsProduct(e)}
                    />
                  </Grid>
                  <Grid
                    item
                    xl={5}
                    xs={5}
                    sm={5}
                  >
                    <TextField
                      fullWidth
                      required
                      disabled
                      label="Descrição Resumida"
                      name="descres"
                      variant="outlined"
                      value={productData.descres}
                      onChange={(e) => handleOnChangeInputsProduct(e)}
                    />
                  </Grid>
                  <Grid
                    item
                    xl={2}
                    xs={2}
                    sm={2}
                  >
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel id="select-unit-label">Unidade</InputLabel>
                      <Select
                        fullWidth
                        labelId="select-unit-label"
                        id="select-unit"
                        value={productData.und}
                        onChange={(e) => handleOnChangeInputsProduct(e)}
                        label="Unidade"
                        disabled
                        name="und"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {
                          productsUnits.map((unit, index) => (
                            <MenuItem key={index} value={unit.id}>{unit.und}</MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    xl={4}
                    xs={4}
                    sm={4}
                  >
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel id="select-group-label">Grupo</InputLabel>
                      <Select
                        fullWidth
                        labelId="select-group-label"
                        id="select-group"
                        value={productData.grupo}
                        onChange={(e) => handleOnChangeInputsProduct(e)}
                        label="Grupo"
                        disabled
                        name="grupo"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {
                          groups.map((group, index) => (
                            <MenuItem key={index} value={group.id}>{group.nv1} {group.niv === 2 && ` > ${group.nv2}`} {group.niv === 3 && ` > ${group.nv3}`}</MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    xl={2}
                    xs={2}
                    sm={2}
                  >
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel id="select-fabricator-label">Fabricante</InputLabel>
                      <Select
                        fullWidth
                        labelId="select-fabricator-label"
                        id="select-fabricator"
                        value={productData.fabr}
                        onChange={(e) => handleOnChangeInputsProduct(e)}
                        label="Fabricante"
                        disabled
                        name="fabr"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {
                          fabricators.map((fab, index) => (
                            <MenuItem key={index} value={fab.id}>{fab.marca}</MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    xl={4}
                    xs={4}
                    sm={4}
                  >
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel id="select-provider-label">Fornecedor</InputLabel>
                      <Select
                        fullWidth
                        labelId="select-provider-label"
                        id="select-provider"
                        value={productData.forn}
                        onChange={(e) => handleOnChangeInputsProduct(e)}
                        label="Fornecedor"
                        disabled
                        name="forn"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>

                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    xl={6}
                    xs={6}
                    sm={6}
                  >
                    <TextField
                      fullWidth
                      required
                      disabled
                      label="Código barras"
                      name="codbarra"
                      variant="outlined"
                      value={productData.codbarra}
                      onChange={(e) => handleOnChangeInputsProduct(e)}
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
                      required
                      disabled
                      label="Características"
                      name="caract"
                      variant="outlined"
                      value={productData.caract}
                      onChange={(e) => handleOnChangeInputsProduct(e)}
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
                      required
                      disabled
                      label="Tamanho"
                      name="tam"
                      variant="outlined"
                      value={productData.tam}
                      onChange={(e) => handleOnChangeInputsProduct(e)}
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
                      required
                      disabled
                      label="Largura"
                      name="larg"
                      variant="outlined"
                      value={productData.larg}
                      onChange={(e) => handleOnChangeInputsProduct(e)}
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
                      required
                      disabled
                      label="Altura"
                      name="alt"
                      variant="outlined"
                      value={productData.alt}
                      onChange={(e) => handleOnChangeInputsProduct(e)}
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
                      required
                      disabled
                      label="Cubagem"
                      name="cubag"
                      variant="outlined"
                      value={productData.cubag}
                      onChange={(e) => handleOnChangeInputsProduct(e)}
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
                      required
                      disabled
                      label="Peso"
                      name="peso"
                      variant="outlined"
                      value={productData.peso}
                      onChange={(e) => handleOnChangeInputsProduct(e)}
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
                      required
                      disabled
                      label="NCM"
                      name="ncm"
                      variant="outlined"
                      value={productData.ncm}
                      onChange={(e) => handleOnChangeInputsProduct(e)}
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
                      required
                      disabled
                      label="CEST"
                      name="cest"
                      variant="outlined"
                      value={productData.cest}
                      onChange={(e) => handleOnChangeInputsProduct(e)}
                    />
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value={valueTab} index={1}>
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    item
                    xl={2}
                    xs={2}
                    sm={2}
                  >
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel id="select-baixa-estoque-label">Baixa Estoque</InputLabel>
                      <Select
                        fullWidth
                        labelId="select-baixa-estoque-label"
                        id="select-baixa-estoque"
                        value={productItemData.bxest}
                        onChange={(e) => handleOnChangeInputsProductItems(e)}
                        label="Baixa Esstoque"
                        disabled
                        name="bxest"
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
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    item
                    xl={2}
                    xs={2}
                    sm={2}
                  >
                    <TextField
                      fullWidth
                      required
                      disabled
                      label="Estoque Mínimo"
                      name="est_minimo"
                      variant="outlined"
                      value={productItemData.est_minimo}
                      onChange={(e) => handleOnChangeInputsProductItems(e)}
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
                      required
                      disabled
                      label="Estoque Fiscal"
                      name="est_fiscal"
                      variant="outlined"
                      value={productItemData.est_fiscal}
                      onChange={(e) => handleOnChangeInputsProductItems(e)}
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
                      required
                      disabled
                      label="Estoque Frente"
                      name="est_frente"
                      variant="outlined"
                      value={productItemData.est_frente}
                      onChange={(e) => handleOnChangeInputsProductItems(e)}
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
                      required
                      disabled
                      label="Estoque Depósito 1"
                      name="est_dep1"
                      variant="outlined"
                      value={productItemData.est_dep1}
                      onChange={(e) => handleOnChangeInputsProductItems(e)}
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
                      required
                      disabled
                      label="Estoque Depósito 2"
                      name="est_dep2"
                      variant="outlined"
                      value={productItemData.est_dep2}
                      onChange={(e) => handleOnChangeInputsProductItems(e)}
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
                      required
                      disabled
                      label="Estoque Depósito 3"
                      name="est_dep3"
                      variant="outlined"
                      value={productItemData.est_dep3}
                      onChange={(e) => handleOnChangeInputsProductItems(e)}
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
                      required
                      disabled
                      label="Loc. Estoque Frente"
                      name="loc_frente"
                      variant="outlined"
                      value={productItemData.loc_frente}
                      onChange={(e) => handleOnChangeInputsProductItems(e)}
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
                      required
                      disabled
                      label="Loc. Estoque Dep. 1"
                      name="loc_dep1"
                      variant="outlined"
                      value={productItemData.loc_dep1}
                      onChange={(e) => handleOnChangeInputsProductItems(e)}
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
                      required
                      disabled
                      label="Loc. Estoque Dep. 2"
                      name="loc_dep2"
                      variant="outlined"
                      value={productItemData.loc_dep2}
                      onChange={(e) => handleOnChangeInputsProductItems(e)}
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
                      required
                      disabled
                      label="Loc. Estoque Dep. 3"
                      name="loc_dep3"
                      variant="outlined"
                      value={productItemData.loc_dep3}
                      onChange={(e) => handleOnChangeInputsProductItems(e)}
                    />
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value={valueTab} index={2}>
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    item
                    xl={2}
                    xs={2}
                    sm={2}
                  >
                    <TextField
                      fullWidth
                      required
                      disabled
                      label="Valor Compra"
                      name="compra"
                      variant="outlined"
                      value={productItemData.compra}
                      onChange={(e) => handleOnChangeInputsProductItems(e)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                      }}
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
                      required
                      disabled
                      label="Valor Frete"
                      name="frete"
                      variant="outlined"
                      value={productItemData.frete}
                      onChange={(e) => handleOnChangeInputsProductItems(e)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                      }}
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
                      required
                      disabled
                      label="Valor Custo"
                      name="custo"
                      variant="outlined"
                      value={productItemData.custo}
                      onChange={(e) => handleOnChangeInputsProductItems(e)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                      }}
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
                      required
                      disabled
                      label="Valor Lucro"
                      name="lucro"
                      variant="outlined"
                      value={productItemData.lucro}
                      onChange={(e) => handleOnChangeInputsProductItems(e)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    item
                    xl={2}
                    xs={2}
                    sm={2}
                  >
                    <TextField
                      fullWidth
                      required
                      disabled
                      label={institutionSettings.cfg19}
                      name="prvenda1"
                      variant="outlined"
                      value={productItemData.prvenda1}
                      onChange={(e) => handleOnChangeInputsProductItems(e)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                      }}
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
                      required
                      disabled
                      label={institutionSettings.cfg20}
                      name="prvenda2"
                      variant="outlined"
                      value={productItemData.prvenda2}
                      onChange={(e) => handleOnChangeInputsProductItems(e)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                      }}
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
                      required
                      disabled
                      label={institutionSettings.cfg21}
                      name="prvenda3"
                      variant="outlined"
                      value={productItemData.prvenda3}
                      onChange={(e) => handleOnChangeInputsProductItems(e)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                      }}
                    />
                  </Grid>

                  <Grid
                    item
                    xl={2}
                    xs={2}
                    sm={2}
                  >
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel id="select-locavel-label">Locável?</InputLabel>
                      <Select
                        fullWidth
                        labelId="select-locavel-label"
                        id="select-locavel"
                        value={productItemData.locavel}
                        onChange={(e) => handleOnChangeInputsProductItems(e)}
                        label="Locável?"
                        disabled
                        name="locavel"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={1}>Sim</MenuItem>
                        <MenuItem value={2}>Não</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    xl={2}
                    xs={2}
                    sm={2}
                  >
                    <TextField
                      fullWidth
                      required
                      disabled
                      label="Preço Locação"
                      name="prloc"
                      variant="outlined"
                      value={productItemData.prloc}
                      onChange={(e) => handleOnChangeInputsProductItems(e)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    item
                    xl={2}
                    xs={2}
                    sm={2}
                  >
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel id="select-atacado-label">Vende atacado?</InputLabel>
                      <Select
                        fullWidth
                        labelId="select-atacado-label"
                        id="select-atacado"
                        value={productItemData.vdatac}
                        onChange={(e) => handleOnChangeInputsProductItems(e)}
                        label="Vende atacado?"
                        disabled
                        name="vdatac"
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
                    xl={2}
                    xs={2}
                    sm={2}
                  >
                    <TextField
                      fullWidth
                      required
                      disabled
                      label="Quantidade Atacado"
                      name="qtdatac"
                      variant="outlined"
                      value={productItemData.qtdatac}
                      onChange={(e) => handleOnChangeInputsProductItems(e)}
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
                      required
                      disabled
                      label="Preço Atacado"
                      name="pratac"
                      variant="outlined"
                      value={productItemData.pratac}
                      onChange={(e) => handleOnChangeInputsProductItems(e)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    item
                    xl={2}
                    xs={2}
                    sm={2}
                  >
                    <TextField
                      fullWidth
                      required
                      disabled
                      label="IPI"
                      name="ipi"
                      variant="outlined"
                      value={productItemData.ipi}
                      onChange={(e) => handleOnChangeInputsProductItems(e)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                      }}
                    />
                  </Grid>

                  <Grid
                    item
                    xl={2}
                    xs={2}
                    sm={2}
                  >
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel id="select-aliquota-label">Alíquota</InputLabel>
                      <Select
                        fullWidth
                        labelId="select-aliquota-label"
                        id="select-aliquota"
                        value={productItemData.aliq}
                        onChange={(e) => handleOnChangeInputsProductItems(e)}
                        label="Alíquota"
                        disabled
                        name="aliq"
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
                    xl={2}
                    xs={2}
                    sm={2}
                  >
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel id="select-comissao-label">Comissão por atividade</InputLabel>
                      <Select
                        fullWidth
                        labelId="select-comissao-label"
                        id="select-comissao"
                        value={productItemData.comissao_atv}
                        onChange={(e) => handleOnChangeInputsProductItems(e)}
                        label="Comissão por atividade"
                        disabled
                        name="comissao_atv"
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
                    xl={2}
                    xs={2}
                    sm={2}
                  >
                    <TextField
                      fullWidth
                      required
                      disabled
                      label="Valor Comissão"
                      name="comissao_val"
                      variant="outlined"
                      value={productItemData.comissao_val}
                      onChange={(e) => handleOnChangeInputsProductItems(e)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                      }}
                    />
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
              onClick={() => handleDelete(idProduct)}
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
