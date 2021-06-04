import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useTheme } from '@material-ui/core/styles';
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
  Tooltip,
  CircularProgress,
  Button,
  InputAdornment,
  List,
  ListItem,
  Dialog,
  DialogTitle,
  DialogContent,
  OutlinedInput,
  Paper
} from '@material-ui/core';
import {
  ArrowBack,
  Close as CloseIcon,
  Save as SaveIcon,
  Search as SearchIcon
} from '@material-ui/icons';
import SwipeableViews from 'react-swipeable-views';
import { useDropzone } from 'react-dropzone';

import Menus from '../../../components/Menus';
import Copyright from '../../../components/Copyright';
import api from '../../../services/api';
import history from '../../../services/history';
import getCookie from '../../../utils/functions';
import useStyles from './styles';
import TableProductFabricator from '../Tables/TableProductFabricator';
import TableProductGroups from '../Tables/TableProductGroups';
import TableProductUnits from '../Tables/TableProductUnits';

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
  const [valueTab, setValueTab] = useState(0);
  const [productData, setProductData] = useState(initialStateProduct);
  const [productItemData, setProductItemData] = useState(initialStateProductItems);
  const [productsUnits, setProductsUnits] = useState([{}]);

  const [userPermissions, setUserPermissions] = useState([]);

  const [institutionSettings, setInstitutionSettings] = useState({});

  const [openModalUnits, setOpenModalUnits] = useState(false);
  const [unitsInitials, setUnitsInitials] = useState('');
  const [unitsDescription, setUnitsDescription] = useState('');
  const [unitType, setUnitType] = useState(1);
  const [loadingCreateUnit, setLoadingCreateUnit] = useState(false);

  const [groups, setGroups] = useState([]);
  const [idGroup, setIdGroup] = useState(0);
  const [nameGroup, setNameGroup] = useState('');
  const [loadingCreateGroup, setLoadingCreateGroup] = useState(false);
  const [openModalGroup, setOpenModalGroup] = useState(false);

  const [subGroups, setSubGroups] = useState([]);
  const [nameSubgroup, setNameSubgroup] = useState('');
  const [loadingCreateSubgroup, setLoadingCreateSubgroup] = useState(false);

  const [nameSection, setNameSection] = useState('');
  const [sections, setSections] = useState([]);
  const [idSection, setIdSection] = useState(0);
  const [loadingCreateSection, setLoadingCreateSection] = useState(false);

  const [fabricators, setFabricators] = useState([{}]);
  const [fabricatorSearch, setFabricatorSearch] = useState('');
  const [openModalFabricator, setOpenModalFabricator] = useState(false);
  const [nameFabricator, setNameFabricator] = useState('');
  const [brandFabricator, setBrandFabricator] = useState('');

  const {
    acceptedFiles,
    getRootProps,
    getInputProps
  } = useDropzone({
    accept: 'image/jpeg, image/png'
  });

  const acceptedFileItems = acceptedFiles.map((file, index) => (
    <ListItem key={file.path} button >{index + 1} - {file.path} - {file.size} bytes</ListItem>
  ));

  const buttonClassName = clsx({
    [classes.buttonSuccess]: success,
    [classes.buttonError]: error,
  });

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
        const { data } = err.response;
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
        getAllSections();
        getAllSubgroups();
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

  async function getAllSections() {
    try {
      const { data } = await api.get('/prod-groups/sections');
      setSections(data);
    } catch (error) {
      const { data } = error.response;
      toast.error(`${data.detail}`);
    }
  }

  async function getAllSubgroups() {
    try {
      const { data } = await api.get('/prod-groups/groups');
      setSubGroups(data);
    } catch (error) {
      const { data } = error.response;
      toast.error(`${data.detail}`);
    }
  }

  const handleChangeTab = (event, newValue) => {
    setValueTab(newValue);
  };

  const handleChangeIndex = (index) => {
    setValueTab(index);
  };

  function handleCloseModalUnits() {
    setOpenModalUnits(false);
  }

  function handleOpenModalUnits() {
    setOpenModalUnits(true);
  }

  function handleOpenModalFabricator() {
    setOpenModalFabricator(true);
  }

  function handleCloseModalFabricator() {
    setOpenModalFabricator(false);
  }

  function handleClickOpenModalGroup() {
    setOpenModalGroup(true);
  };

  function handleCloseModalGroup() {
    setOpenModalGroup(false);
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

  function handleCreateUnitProgressError() {
    if (!loadingCreateUnit) {
      setLoadingCreateUnit(true);
      timer.current = window.setTimeout(() => {
        setLoadingCreateUnit(false);
      }, 2000);
    }
  }

  function handleCreateUnitProgress() {
    if (!loadingCreateUnit) {
      setLoadingCreateUnit(true);
      timer.current = window.setTimeout(() => {
        setLoadingCreateUnit(false);
      }, 2000);
    }
  };

  function handleCreateSectionProgressError() {
    if (!loadingCreateSection) {
      setLoadingCreateSection(true);
      timer.current = window.setTimeout(() => {
        setLoadingCreateSection(false);
      }, 2000);
    }
  }

  function handleCreateSectionProgress() {
    if (!loadingCreateSection) {
      setLoadingCreateSection(true);
      timer.current = window.setTimeout(() => {
        setLoadingCreateSection(false);
      }, 2000);
    }
  };

  function handleCreateGroupProgressError() {
    if (!loadingCreateGroup) {
      setLoadingCreateGroup(true);
      timer.current = window.setTimeout(() => {
        setLoadingCreateGroup(false);
      }, 2000);
    }
  }

  function handleCreateGroupProgress() {
    if (!loadingCreateGroup) {
      setLoadingCreateGroup(true);
      timer.current = window.setTimeout(() => {
        setLoadingCreateGroup(false);
      }, 2000);
    }
  };

  function handleCreateSubgroupProgressError() {
    if (!loadingCreateSubgroup) {
      setLoadingCreateSubgroup(true);
      timer.current = window.setTimeout(() => {
        setLoadingCreateSubgroup(false);
      }, 2000);
    }
  }

  function handleCreateSubgroupProgress() {
    if (!loadingCreateSubgroup) {
      setLoadingCreateSubgroup(true);
      timer.current = window.setTimeout(() => {
        setLoadingCreateSubgroup(false);
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
      handleButtonClickProgress();

      const { data } = await api.post('/products/create/', { ...productData, ...productItemData }, {
        headers: {
          'X-CSRFToken': csrftoken
        }
      });

      acceptedFiles.map(async (file) => {
        let formData = new FormData();
        formData.append('files', file);
        await api.post(`/photos/upload/${data.product_id}`, formData);
      });

      setTimeout(() => {
        toast.success('Registro do produto criado com sucesso!');
      }, 3000);
      setTimeout(() => {
        history.push(`/products/details/${data.product_id}`);
      }, 4000);
    } catch (err) {
      const { data } = err.response;
      handleButtonClickProgressError();
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
    }
  }

  async function handleCreateSection() {
    try {
      const { data } = await api.post('/prod-groups/create', { nv1: nameSection });
      handleCreateSectionProgress();
      setGroups(data);
      setTimeout(() => {
        toast.success('Seção adicionada com sucesso.');
        setNameSection('');
        getAllSections();
      }, 2000);
    } catch (error) {
      const { data } = error.response;
      handleCreateSectionProgressError();
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
    }
  }

  async function handleCreateGroup() {
    try {
      const { data } = await api.post(`/prod-groups/subgroup/1/create/${idSection}`, { nv2: nameGroup });
      handleCreateGroupProgress();
      setGroups(data);
      setTimeout(() => {
        toast.success('Grupo cadastrado com sucesso.');
        setNameGroup('');
        setIdSection(0);
        getAllSubgroups();
      }, 2000);
    } catch (error) {
      const { data } = error.response;
      handleCreateGroupProgressError();
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
    }
  }

  async function handleCreateSubgroup() {
    try {
      const { data } = await api.post(`/prod-groups/subgroup/2/create/${idGroup}`, { nv3: nameSubgroup });
      handleCreateSubgroupProgress();
      setGroups(data);
      setTimeout(() => {
        toast.success('Subgrupo cadastrado com sucesso.');
        setNameSubgroup('');
        setIdGroup(0);
      }, 2000);
    } catch (error) {
      const { data } = error.response;
      handleCreateSubgroupProgressError();
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
    }
  }

  async function handleCreateFabricator() {
    try {
      const { data } = await api.post('/fabricator/create', { marca: brandFabricator, fabr: nameFabricator });
      setFabricators(data);
      setTimeout(() => {
        toast.success('Fabricante cadastrado com sucesso!');
        setBrandFabricator('');
        setNameFabricator('');
      }, 2000);
    } catch (err) {
      const { data } = err.response;
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
    }
  }

  async function handleCreateUnits() {
    try {
      const { data } = await api.post('/units/create', { und: unitsInitials, descr: unitsDescription, tipo: unitType });
      handleCreateUnitProgress();
      setProductsUnits(data);
      setTimeout(() => {
        toast.success('Unidade cadastrada com sucesso.');
      }, 2000);

      setTimeout(() => {
        setUnitsInitials('');
        setUnitsDescription('');
        setUnitType(1);
      }, 3000);
    } catch (error) {
      const { data } = error.response;
      handleCreateUnitProgressError();
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
    }
  }

  async function handleSearchFabricators(e) {
    e.preventDefault();
    const csrftoken = getCookie('csrftoken');

    try {
      if (fabricatorSearch !== '') {
        const { data } = await api.get(`/fabricator/brand/${fabricatorSearch}`, {
          headers: {
            'X-CSRFToken': csrftoken
          }
        });
        setFabricators(data);
      } else {
        const { data } = await api.get(`/fabricator`, {
          headers: {
            'X-CSRFToken': csrftoken
          }
        });
        setFabricators(data);
      }
    } catch (err) {
      const { data } = err.response;
      toast.error(`${data.detail}`);
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
            <CardContent style={{ paddingBottom: theme.spacing(2) }}>
              <Box
                display="flex"
                justifyContent="space-between"
              >
                <Box style={{ width: '50%' }}>
                  <Link to="/products" className="link">
                    <Tooltip title="Voltar" arrow>
                      <IconButton>
                        <ArrowBack />
                      </IconButton>
                    </Tooltip>
                  </Link>
                </Box>


                <Box
                  style={{ width: '50%', padding: '10px' }}
                  display="flex"
                  justifyContent="flex-end"
                >
                  {
                    userPermissions[138] === '1' && (
                      <Button
                        className={classes.groupButton}
                        onClick={handleOpenModalFabricator}
                        color="default"
                        variant="contained"
                      >
                        Fabricante
                      </Button>
                    )
                  }

                  {
                    userPermissions[147] === '1' && (
                      <Button
                        className={classes.groupButton}
                        onClick={handleOpenModalUnits}
                        color="default"
                        variant="contained"
                      >
                        Unidades
                      </Button>
                    )
                  }

                  {
                    userPermissions[144] === '1' && (
                      <Button
                        className={classes.groupButton}
                        onClick={handleClickOpenModalGroup}
                        color="default"
                        variant="contained"
                      >
                        Grupos
                      </Button>
                    )
                  }
                </Box>
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
                <Tab label="Fotos" {...a11yProps(3)} />
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
                      xl={6}
                      xs={6}
                      sm={6}
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
                      xl={6}
                      xs={6}
                      sm={6}
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
                        InputProps={{
                          startAdornment: <InputAdornment position="start">M</InputAdornment>,
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
                        label="Largura"
                        name="larg"
                        variant="outlined"
                        value={productData.larg}
                        onChange={(e) => handleOnChangeInputsProduct(e)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">M</InputAdornment>,
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
                        label="Altura"
                        name="alt"
                        variant="outlined"
                        value={productData.alt}
                        onChange={(e) => handleOnChangeInputsProduct(e)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">M</InputAdornment>,
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
                        InputProps={{
                          startAdornment: <InputAdornment position="start">KG</InputAdornment>,
                        }}
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
                <TabPanel value={valueTab} index={3}>
                  <Grid
                    container
                    spacing={3}
                  >
                    <Grid
                      item
                      xl={12}
                      xs={12}
                      sm={12}
                    >
                      <section className={classes.containerImage}>
                        <div {...getRootProps({ className: 'dropzone' })}>
                          <input {...getInputProps()} />
                          <p>Arraste e solte alguns arquivos aqui ou clique para selecionar arquivos</p>
                          <em>(Somente imagens .jpeg e .png serão aceitas)</em>
                        </div>
                        <aside>

                        </aside>
                      </section>
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    spacing={3}
                  >
                    <Grid
                      item
                      xl={6}
                      xs={6}
                      sm={6}
                    >
                      <h4>Arquivos selecionados</h4>
                      <List>
                        {acceptedFileItems}
                      </List>
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

        {/* MODAL GROUPS */}
        <Dialog
          open={openModalGroup}
          onClose={handleCloseModalGroup}
          className={classes.groupModal}
          aria-labelledby="form-dialog-title"
          maxWidth="lg"
        >
          <DialogTitle id="form-dialog-title">
            <Typography variant="h6" >Grupos de produtos</Typography>
            <IconButton aria-label="close" className={classes.closeButton} onClick={handleCloseModalGroup}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers style={{ width: '700px' }}>
            <Box>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel>Adicionar Seção</InputLabel>
                <OutlinedInput
                  value={nameSection}
                  onChange={(e) => setNameSection(e.target.value)}
                  fullWidth
                  label="Adicionar Seção"
                  name="addSection"
                  endAdornment={
                    <InputAdornment position="end">
                      <Tooltip title="Adicionar Seção">
                        <IconButton
                          aria-label="Adicionar Seção"
                          edge="end"
                          type="submit"
                          onClick={handleCreateSection}
                          disabled={loadingCreateSection}
                        >
                          <SaveIcon size={8} color="primary" />
                          {loadingCreateSection && <CircularProgress size={24} className={classes.buttonProgress} />}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  }
                  labelWidth={100}
                />
              </FormControl>

              <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />

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
                  <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id="select-company-type">Seção</InputLabel>
                    <Select
                      labelId="select-company-type"
                      value={idSection}
                      label="Seção"
                      name="section"
                      onChange={(e) => setIdSection(e.target.value)}
                    >
                      <MenuItem value={0}>
                        <em>None</em>
                      </MenuItem>
                      {sections.map(section => (
                        <MenuItem value={section.id}>{section.nv1}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xs={7}
                  xl={7}
                  sm={7}
                >
                  <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel>Adicionar Grupo</InputLabel>
                    <OutlinedInput
                      value={nameGroup}
                      onChange={(e) => setNameGroup(e.target.value)}
                      fullWidth
                      label="Adicionar Grupo"
                      name="addGroup"
                      endAdornment={
                        <InputAdornment position="end">
                          <Tooltip title="Adicionar Grupo">
                            <IconButton
                              aria-label="Adicionar Grupo"
                              edge="end"
                              type="submit"
                              onClick={handleCreateGroup}
                              disabled={loadingCreateGroup}
                            >
                              <SaveIcon size={8} color="primary" />
                              {loadingCreateGroup && <CircularProgress size={24} className={classes.buttonProgress} />}
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      }
                      labelWidth={70}
                    />
                  </FormControl>
                </Grid>
              </Grid>

              <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />

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
                  <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id="select-company-type">Grupo</InputLabel>
                    <Select
                      labelId="select-company-type"
                      value={idGroup}
                      label="Grupo"
                      name="group"
                      onChange={(e) => setIdGroup(e.target.value)}
                    >
                      <MenuItem value={0}>
                        <em>None</em>
                      </MenuItem>
                      {
                        subGroups.map(subgroup => (
                          <MenuItem value={subgroup.id}>{subgroup.nv2}</MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xs={7}
                  xl={7}
                  sm={7}
                >
                  <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel>Adicionar Subgrupo</InputLabel>
                    <OutlinedInput
                      value={nameSubgroup}
                      onChange={(e) => setNameSubgroup(e.target.value)}
                      fullWidth
                      label="Adicionar Grupo"
                      name="addSubgroup"
                      endAdornment={
                        <InputAdornment position="end">
                          <Tooltip title="Adicionar Subgrupo">
                            <IconButton
                              aria-label="Adicionar Subgrupo"
                              edge="end"
                              type="submit"
                              onClick={handleCreateSubgroup}
                              disabled={loadingCreateSubgroup}
                            >
                              <SaveIcon size={8} color="primary" />
                              {loadingCreateSubgroup && <CircularProgress size={24} className={classes.buttonProgress} />}
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      }
                      labelWidth={70}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
            <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
            <Paper className={classes.paper}>
              <Box>
                <TableProductGroups groups={groups} />
              </Box>
            </Paper>
          </DialogContent>
        </Dialog>

        {/* MODAL UNITS */}
        <Dialog open={openModalUnits} onClose={handleCloseModalUnits} className={classes.unitsModal} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">
            <Typography variant="h6" >Unidades de produtos</Typography>
            <IconButton aria-label="close" className={classes.closeButton} onClick={handleCloseModalUnits}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Box>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  item
                  xs={2}
                  xl={2}
                  sm={2}
                >
                  <TextField
                    fullWidth
                    required
                    variant="outlined"
                    label="Sigla"
                    value={unitsInitials}
                    onChange={(e) => setUnitsInitials(e.target.value)}
                  />
                </Grid>

                <Grid
                  item
                  xs={5}
                  xl={5}
                  sm={5}
                >
                  <TextField
                    fullWidth
                    required
                    variant="outlined"
                    label="Descrição"
                    value={unitsDescription}
                    onChange={(e) => setUnitsDescription(e.target.value)}
                  />
                </Grid>

                <Grid
                  item
                  xs={5}
                  xl={5}
                  sm={5}
                >
                  <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id="select-company-type">Tipo</InputLabel>
                    <Select
                      labelId="select-company-type"
                      value={unitType}
                      label="Tipo"
                      name="unitType"
                      required
                      onChange={(e) => setUnitType(e.target.value)}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={1}>Todos</MenuItem>
                      <MenuItem value={2}>Produtos</MenuItem>
                      <MenuItem value={3}>Serviços</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xs={12}
                  xl={12}
                  sm={12}
                >
                  <Button
                    variant="outlined"
                    type="button"
                    color="primary"
                    fullWidth
                    onClick={handleCreateUnits}
                    startIcon={<SaveIcon size={8} color="primary" />}
                    disable={loadingCreateUnit}
                  >
                    Salvar
                    {loadingCreateUnit && <CircularProgress size={24} className={classes.buttonProgress} />}
                  </Button>
                </Grid>
              </Grid>
            </Box>

            <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />

            <Box>
              <Grid
                container
              >
                <Grid
                  item
                  xs={12}
                  xl={12}
                  sm={12}
                >
                  <TableProductUnits units={productsUnits} />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
        </Dialog>

        {/* MODAL FABRICATORS */}
        <Dialog open={openModalFabricator} onClose={handleCloseModalFabricator} className={classes.fabricatorModal} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">
            <Typography variant="h6" >Fabricante de produtos</Typography>
            <IconButton aria-label="close" className={classes.closeButton} onClick={handleCloseModalFabricator}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Box>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  item
                  xs={4}
                  xl={4}
                  sm={4}
                >
                  <TextField
                    fullWidth
                    required
                    size="small"
                    variant="outlined"
                    label="Marca"
                    value={brandFabricator}
                    onChange={(e) => setBrandFabricator(e.target.value)}
                  />
                </Grid>

                <Grid
                  item
                  xs={6}
                  xl={6}
                  sm={6}
                >
                  <TextField
                    fullWidth
                    required
                    size="small"
                    variant="outlined"
                    label="Nome"
                    value={nameFabricator}
                    onChange={(e) => setNameFabricator(e.target.value)}
                  />
                </Grid>

                <Grid
                  item
                  xs={2}
                  xl={2}
                  sm={2}
                >
                  <Button
                    variant="outlined"
                    type="button"
                    color="primary"
                    fullWidth
                    onClick={handleCreateFabricator}
                  >
                    <SaveIcon size={8} color="primary" />
                  </Button>
                </Grid>
              </Grid>
            </Box>

            <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />

            <Box>
              <Grid
                container
              >
                <Grid
                  item
                  xs={12}
                  xl={12}
                  sm={12}
                >
                  <form onSubmit={(e) => handleSearchFabricators(e)}>
                    <FormControl variant="outlined" fullWidth size="small" >
                      <InputLabel>Pesquisar por marca</InputLabel>
                      <OutlinedInput
                        value={fabricatorSearch}
                        onChange={(e) => setFabricatorSearch(e.target.value)}
                        fullWidth
                        label="Pesquisar por marca"
                        name="searchFabricator"
                        endAdornment={
                          <InputAdornment position="end">
                            <Tooltip title="Pesquisar">
                              <IconButton
                                aria-label="Pesquisar"
                                edge="end"
                                type="submit"
                              >
                                <SearchIcon size={8} color="primary" />
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        }
                        labelWidth={70}
                      />
                    </FormControl>
                  </form>
                </Grid>
              </Grid>
            </Box>

            <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />

            <Box>
              <Grid
                container
              >
                <Grid
                  item
                  xs={12}
                  xl={12}
                  sm={12}
                >
                  <TableProductFabricator fabricators={fabricators} />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
        </Dialog>

      </main>
    </div>
  );
}
