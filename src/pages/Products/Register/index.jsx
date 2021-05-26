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
  ativo: 2,
  descr: "",
  descres: "",
  und: 0,
  grupo: 0,
  tam: 0,
  larg: 0,
  alt: 0,
  cubag: 0,
  peso: 0,
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
  ativo: 2,
  bxest: 0,
  est_minimo: 0,
  est_fiscal: 0,
  est_frente: 0,
  est_dep1: 0,
  est_dep2: 0,
  est_dep3: 0,
  compra: 0,
  frete: 0,
  ipi: 0,
  aliq: 0,
  custo: 0,
  lucro: 0,
  prvenda1: 0,
  prvenda2: 0,
  prvenda3: 0,
  locavel: 2,
  prloc: 0,
  vdatac: 0,
  qtdatac: 0,
  pratac: 0,
  loc_frente: "",
  loc_dep1: "",
  loc_dep2: "",
  loc_dep3: "",
  comissao_atv: 0,
  comissao_val: 0
}

export default function RegisterProduct() {
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

  const buttonClassName = clsx({
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

  function calculateProfit() {
    let profit = parseFloat(productItemData.custo) * (parseFloat(institutionSettings.cfg22) / 100);
    setProductItemData({ ...productItemData, lucro: profit.toFixed(2) });
  }

  function calculateNewProfit() {
    let profit = parseFloat(productItemData.prvenda1) - parseFloat(productItemData.custo);
    if (profit < 0) profit = 0;
    setProductItemData({ ...productItemData, lucro: profit.toFixed(2) });
  }

  function totalCost() {
    let cost = parseFloat(productItemData.compra) + parseFloat(productItemData.frete);
    setProductItemData({ ...productItemData, custo: cost.toFixed(2) });
  }

  function calculatePriceTable1() {
    let total = parseFloat(productItemData.lucro) + parseFloat(productItemData.custo);
    setProductItemData({ ...productItemData, prvenda1: total.toFixed(2) });
  }

  function calculatePriceTable2() {
    // ACRESCIMO
    if (institutionSettings.cfg23 === '1') {
      let percentage = parseFloat(productItemData.prvenda1) * (parseFloat(institutionSettings.cfg24) / 100);
      let newValue = parseFloat(productItemData.prvenda1) + percentage;
      setProductItemData({ ...productItemData, prvenda2: newValue.toFixed(2) });
      // DESCONTO
    } else if (institutionSettings.cfg23 === '2') {
      let percentage = parseFloat(productItemData.prvenda1) * (parseFloat(institutionSettings.cfg24) / 100);
      let newValue = parseFloat(productItemData.prvenda1) - percentage;
      setProductItemData({ ...productItemData, prvenda2: newValue.toFixed(2) });
    }
  }

  // function calculatePriceTable2Inverse() {
  //   let percentage = parseFloat(productItemData.prvenda1) * (parseFloat(institutionSettings.cfg24) / 100);
  //   let newValue = parseFloat(productItemData.prvenda2) - percentage;
  //   setProductItemData({ ...productItemData, prvenda2: newValue.toFixed(2) });
  // }

  function calculatePriceTable3() {
    // ACRESCIMO
    if (institutionSettings.cfg25 === '1') {
      let percentage = parseFloat(productItemData.prvenda1) * (parseFloat(institutionSettings.cfg26) / 100);
      let newValue = parseFloat(productItemData.prvenda1) + percentage;
      setProductItemData({ ...productItemData, prvenda3: newValue.toFixed(2) });
      // DESCONTO
    } else if (institutionSettings.cfg25 === '2') {
      let percentage = parseFloat(productItemData.prvenda1) * (parseFloat(institutionSettings.cfg26) / 100);
      let newValue = parseFloat(productItemData.prvenda1) - percentage;
      setProductItemData({ ...productItemData, prvenda3: newValue.toFixed(2) });
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    const csrftoken = getCookie('csrftoken');

    try {
      const { data } = await api.post('/products/create/', { ...productData, ...productItemData }, {
        headers: {
          'X-CSRFToken': csrftoken
        }
      });
      handleButtonClickProgress();
      setTimeout(() => {
        toast.success('Registro do produto criado com sucesso!');
      }, 2000);
      setTimeout(() => {
        history.push(`/products/details/${data.product_id}`);
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
      <Menus title="Cadastro de produto" />
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
            <form onSubmit={(e) => { handleCreate(e) }}>
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
                          name="und"
                        >
                          <MenuItem value={0}>
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
                          name="grupo"
                        >
                          <MenuItem value={0}>
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
                          name="fabr"
                        >
                          <MenuItem value={0}>
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
                          name="forn"
                        >
                          <MenuItem value={0}>
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
                        label="Valor Frete"
                        name="frete"
                        variant="outlined"
                        value={productItemData.frete}
                        onKeyUp={totalCost}
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
                        label="Valor Custo"
                        name="custo"
                        variant="outlined"
                        value={productItemData.custo}
                        onKeyUp={calculateProfit}
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
                        label={institutionSettings.cfg19}
                        name="prvenda1"
                        variant="outlined"
                        value={productItemData.prvenda1}
                        onChange={(e) => handleOnChangeInputsProductItems(e)}
                        onFocus={calculatePriceTable1}
                        onKeyUp={calculateNewProfit}
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
                        label={institutionSettings.cfg20}
                        name="prvenda2"
                        variant="outlined"
                        value={productItemData.prvenda2}
                        onChange={(e) => handleOnChangeInputsProductItems(e)}
                        onFocus={calculatePriceTable2}
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
                        label={institutionSettings.cfg21}
                        name="prvenda3"
                        variant="outlined"
                        value={productItemData.prvenda3}
                        onChange={(e) => handleOnChangeInputsProductItems(e)}
                        onFocus={calculatePriceTable3}
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
                          name="locavel"
                        >
                          <MenuItem value={0}>
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
                          name="vdatac"
                        >
                          <MenuItem value={2}>
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
                          name="aliq"
                        >
                          <MenuItem value={2}>
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
                        <InputLabel id="select-comissao-label">Comissão atividade</InputLabel>
                        <Select
                          fullWidth
                          labelId="select-comissao-label"
                          id="select-comissao"
                          value={productItemData.comissao_atv}
                          onChange={(e) => handleOnChangeInputsProductItems(e)}
                          label="Comissão atividade"
                          name="comissao_atv"
                        >
                          <MenuItem value={2}>
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
                    Salvar Alterações
                    {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                  </Button>
                </Box>
              </Grid>
            </form>
          </div>
        </Container>
        <Box pt={4}>
          <Copyright />
        </Box>
      </main>
    </div>
  );
}
