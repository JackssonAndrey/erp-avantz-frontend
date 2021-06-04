import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Button,
  Badge,
  Box,
  Card,
  CardContent,
  InputAdornment,
  Grid,
  FormControl,
  InputLabel,
  OutlinedInput,
  TextField,
  Divider,
  Select,
  MenuItem
} from '@material-ui/core';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  More as DetailIcon,
  DeleteForever as DeleteForeverIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Block as BlockIcon
} from '@material-ui/icons';

import { orange, lightBlue, red } from '@material-ui/core/colors';

import api from '../../services/api';
import getCookie from '../../utils/functions';
import { Context } from '../../Context/AuthContext';
import { toast } from 'react-toastify';
import history from '../../services/history';
import { useToolbarStyles, useStyles } from './styles/tableStyles';
import TableProductGroups from './Tables/TableProductGroups';
import TableProductUnits from './Tables/TableProductUnits';
import TableProductFabricator from './Tables/TableProductFabricator';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'foto', numeric: false, disablePadding: false, label: 'Foto' },
  { id: 'codigo', numeric: false, disablePadding: true, label: 'Código' },
  { id: 'ativo', numeric: false, disablePadding: true, label: 'ativo' },
  { id: 'descricao', numeric: false, disablePadding: true, label: 'Descrição' },
  { id: 'unidade', numeric: false, disablePadding: true, label: 'Unidade' },
  { id: 'actions', numeric: false, disablePadding: true, label: '' },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = () => {
  const classes = useToolbarStyles();
  // const { numSelected } = props;

  return (
    <Toolbar>
      <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
        Produtos
      </Typography>
    </Toolbar>
  );
};

export default function EnhancedTable() {
  const { handleLogout } = useContext(Context);
  const classes = useStyles();
  const timer = useRef();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [defaultButton, setDefaultButton] = useState(false);

  const [loadingDisableProduct, setLoadingDisableProduct] = useState(false);
  const [successDisableProduct, setSuccessDisableProduct] = useState(false);
  const [errorDisableProduct, setErrorDisableProduct] = useState(false);
  const [defaultButtonDisableProduct, setDefaultButtonDisableProduct] = useState(false);
  const [openModalDisableProduct, setOpenModalDisableProduct] = useState(false);

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('descr');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [openModalGroup, setOpenModalGroup] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [productsUnits, setProductsUnits] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);

  const [nameSection, setNameSection] = useState('');
  const [sections, setSections] = useState([]);
  const [idSection, setIdSection] = useState(0);
  const [loadingCreateSection, setLoadingCreateSection] = useState(false);

  const [groups, setGroups] = useState([]);
  const [subGroups, setSubGroups] = useState([]);
  const [nameGroup, setNameGroup] = useState('');
  const [idGroup, setIdGroup] = useState(0);
  const [loadingCreateGroup, setLoadingCreateGroup] = useState(false);

  const [nameSubgroup, setNameSubgroup] = useState('');
  const [loadingCreateSubgroup, setLoadingCreateSubgroup] = useState(false);

  const [units, setUnits] = useState([{}]);
  const [openModalUnits, setOpenModalUnits] = useState(false);
  const [unitsInitials, setUnitsInitials] = useState('');
  const [unitsDescription, setUnitsDescription] = useState('');
  const [unitType, setUnitType] = useState(1);
  const [loadingCreateUnit, setLoadingCreateUnit] = useState(false);

  const [openModalFabricator, setOpenModalFabricator] = useState(false);
  const [nameFabricator, setNameFabricator] = useState('');
  const [brandFabricator, setBrandFabricator] = useState('');
  const [fabricators, setFabricators] = useState([{}]);
  const [fabricatorSearch, setFabricatorSearch] = useState('');

  const [photos, setPhotos] = useState([{}]);

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
    [classes.buttonError]: error,
    [classes.buttonDefault]: defaultButton
  });

  const buttonClassNameDisableProduct = clsx({
    [classes.buttonSuccess]: successDisableProduct,
    [classes.buttonError]: errorDisableProduct,
    [classes.buttonDefault]: defaultButtonDisableProduct
  });

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/photos`);
      setPhotos(data);
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

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/units');
        setUnits(data);
      } catch (err) {
        const { data } = err.response;
        toast.error(`${data.detail}`);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const csrftoken = getCookie('csrftoken');
      try {
        const { data } = await api.get('/products', {
          headers: {
            'X-CSRFToken': csrftoken
          }
        });
        setProducts(data);
      } catch (error) {
        const { data, status } = error.response;
        toast.error(`${data.detail}`);
        if (status === 401) {
          setTimeout(() => {
            handleLogout();
          }, 5000);
        }
      }
    })();
  }, [handleLogout]);

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
      } catch (error) {
        const { data, status } = error.response;
        toast.error(`${data.detail}`);
        if (status === 401) {
          setTimeout(() => {
            handleLogout();
          }, 5000);
        }
      }
    })();
  }, [handleLogout]);

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

  const handleClickOpenModal = (id) => {
    setProductId(id);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setProductId(0);
    setOpenModal(false);
  };

  const handleClickOpenModalDisableProduct = (id) => {
    setProductId(id);
    setOpenModalDisableProduct(true);
  };

  const handleCloseModalDisableProduct = () => {
    setProductId(0);
    setOpenModalDisableProduct(false);
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

  function handleDisableProductProgressError() {
    if (!loadingDisableProduct) {
      setSuccessDisableProduct(false);
      setLoadingDisableProduct(true);
      timer.current = window.setTimeout(() => {
        setErrorDisableProduct(true);
        setLoadingDisableProduct(false);
      }, 2000);
    }
  }

  function handleDisableProductProgress() {
    if (!loadingDisableProduct) {
      setSuccessDisableProduct(false);
      setLoadingDisableProduct(true);
      timer.current = window.setTimeout(() => {
        setSuccessDisableProduct(true);
        setLoadingDisableProduct(false);
      }, 2000);
    }
  };

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

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function handleDetails(id) {
    history.push(`/products/details/${id}`);
  }

  function handleEdit(id) {
    history.push(`/products/edit/${id}`);
  }

  async function handleDisableProduct(id) {
    const csrftoken = getCookie('csrftoken');

    try {
      handleDisableProductProgress();

      const { data } = await api.put(`/products/deactivate/${id}`, {
        headers: {
          'X-CSRFToken': csrftoken
        }
      });

      setProducts(data);

      setTimeout(() => {
        toast.success('Produto desativado com sucesso!');
        handleCloseModalDisableProduct();
        setDefaultButtonDisableProduct(true);
      }, 2000);
    } catch (err) {
      const { data } = err.response;
      handleDisableProductProgressError();
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
    }
  }

  async function handleDeleteProduct(id) {
    const csrftoken = getCookie('csrftoken');

    try {
      const { data } = await api.put(`/products/delete/${id}`, {
        headers: {
          'X-CSRFToken': csrftoken
        }
      });
      handleButtonClickProgress();
      setTimeout(() => {
        toast.success('Produto deletado com sucesso!');
      }, 2000);
      setProducts(data);
      setTimeout(() => {
        handleCloseModal();
        setDefaultButton();
      }, 3500);
    } catch (err) {
      const { data } = err.response;
      handleButtonClickProgressError();
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
    }
  }

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, products.length - page * rowsPerPage);

  async function handleSearchProducts(e) {
    e.preventDefault();
    const csrftoken = getCookie('csrftoken');

    try {
      if (productSearch !== '') {
        const { data } = await api.get(`/products/${productSearch}`, {
          headers: {
            'X-CSRFToken': csrftoken
          }
        });
        setProducts(data.produtos);
      } else {
        const { data } = await api.get(`/products`, {
          headers: {
            'X-CSRFToken': csrftoken
          }
        });
        setProducts(data.produtos);
      }
    } catch (err) {
      const { data } = err.response;
      toast.error(`${data.detail}`);
    }
  }

  function handleClickOpenModalGroup() {
    setOpenModalGroup(true);
  };

  function handleCloseModalGroup() {
    setOpenModalGroup(false);
  };

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
      setUnits(data);
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
      <Card>
        <CardContent>
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
              <form onSubmit={(e) => handleSearchProducts(e)}>
                <FormControl variant="outlined" fullWidth size="small" >
                  <InputLabel>Pesquisar</InputLabel>
                  <OutlinedInput
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    fullWidth
                    label="Pesquisar"
                    name="searchProduct"
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
            <Grid
              item
              xl={6}
              xs={6}
              sm={6}
            >
              <Box
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
                {
                  userPermissions[4] === '1' && (
                    <Link to="/products/register" className="link" >
                      <Button
                        color="primary"
                        variant="contained"
                      >
                        Novo produto
                      </Button>
                    </Link>
                  )
                }
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Paper className={classes.paper}>
        <EnhancedTableToolbar />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="small"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={products.length}
            />
            <TableBody>
              {stableSort(products, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={product.id}
                    >
                      <TableCell padding="checkbox" size="small" align="left">
                        {
                          photos.map((photo) => {
                            if (photo.id_produto === product.id) {
                              return (
                                <Avatar
                                  variant="rounded"
                                  src={`${process.env.REACT_APP_HOST}${photo.nome_arquivo}`}
                                  style={{ width: '50px', height: '50px' }}
                                ></Avatar>
                              )
                            }
                            return true;
                          })
                        }

                      </TableCell>
                      <TableCell padding="none" align="left">{product.codprod}</TableCell>
                      <TableCell padding="none" align="left">
                        {
                          product.ativo === 2 ? (
                            <Badge color="primary" badgeContent="Sim" overlap="rectangle" />
                          ) : (
                            <Badge color="secondary" badgeContent="Não" overlap="rectangle" />
                          )
                        }
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {product.descr}
                      </TableCell>
                      <TableCell padding="none" align="left">
                        {
                          productsUnits.map((unit) => {
                            if (unit.id === product.und) {
                              return `${unit.descr} (${unit.und})`;
                            }
                            return null;
                          })
                        }
                      </TableCell>
                      <TableCell padding="default" align="right">
                        {
                          userPermissions[143] === '1' && (
                            <Tooltip title="Editar">
                              <IconButton onClick={() => handleEdit(product.id)} aria-label="Editar">
                                <EditIcon size={8} style={{ color: orange[300] }} />
                              </IconButton>
                            </Tooltip>
                          )
                        }
                        {
                          userPermissions[151] === '1' && (
                            <Tooltip title="Detalhes">
                              <IconButton onClick={() => handleDetails(product.id)} aria-label="Detalhes">
                                <DetailIcon size={8} style={{ color: lightBlue[300] }} />
                              </IconButton>
                            </Tooltip>
                          )
                        }

                        {
                          userPermissions[142] === '1' && (
                            <Tooltip title="Desativar">
                              <IconButton onClick={() => handleClickOpenModalDisableProduct(product.id)} aria-label="Desativar">
                                <BlockIcon size={8} style={{ color: red[300] }} />
                              </IconButton>
                            </Tooltip>
                          )
                        }

                        {
                          userPermissions[141] === '1' && (
                            <Tooltip title="Deletar">
                              <IconButton onClick={() => handleClickOpenModal(product.id)} aria-label="Deletar">
                                <DeleteIcon size={8} style={{ color: red[300] }} />
                              </IconButton>
                            </Tooltip>
                          )
                        }
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 33 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={products.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página"
        />
      </Paper>
      {/* DELETE PRODUCT MODAL */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Deletar produto
          <IconButton aria-label="close" className={classes.closeButton} onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.modalContent} dividers>
          <div className={classes.divIconModal}>
            <DeleteForeverIcon className={classes.modalIcon} />
          </div>
          <DialogContentText variant="h6" id="alert-dialog-description" className={classes.modalContentText}>
            Você realmente deseja deletar este produto? Esta operação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleDeleteProduct(productId)}
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

      {/* DISABLE PRODUCT MODAL */}
      <Dialog
        open={openModalDisableProduct}
        onClose={handleCloseModalDisableProduct}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Desativar produto
          <IconButton aria-label="close" className={classes.closeButton} onClick={handleCloseModalDisableProduct}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.modalContent} dividers>
          <div className={classes.divIconModal}>
            <BlockIcon className={classes.modalIcon} />
          </div>
          <DialogContentText variant="h6" id="alert-dialog-description" className={classes.modalContentText}>
            Você realmente deseja desativar este produto? Você pode ativá-lo novamente depois.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleDisableProduct(productId)}
            color="secondary"
            className={buttonClassNameDisableProduct}
            disabled={loadingDisableProduct}
            variant="contained"
          >
            desativar
            {loadingDisableProduct && <CircularProgress size={24} className={classes.buttonProgress} />}
          </Button>

          <Button onClick={handleCloseModalDisableProduct} color="primary" variant="outlined" autoFocus>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

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
          {
            userPermissions[7] === '1' && (
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
            )
          }
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
          {
            userPermissions[150] === '1' && (
              <>
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
              </>
            )
          }
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
                <TableProductUnits units={units} />
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
          {
            userPermissions[110] === '1' && (
              <>
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
              </>
            )
          }
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

    </div>
  );
}
