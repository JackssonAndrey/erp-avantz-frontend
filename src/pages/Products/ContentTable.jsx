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
  TextField
} from '@material-ui/core';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  More as DetailIcon,
  DeleteForever as DeleteForeverIcon,
  Search as SearchIcon,
  Close as CloseIcon
} from '@material-ui/icons';

import { orange, lightBlue, red } from '@material-ui/core/colors';

import api from '../../services/api';
import getCookie from '../../utils/functions';
import { Context } from '../../Context/AuthContext';
import { toast } from 'react-toastify';
import history from '../../services/history';
import { useToolbarStyles, useStyles } from './styles/tableStyles';
import TableProductGroups from './Dialogs/TableProductGroups';

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

  const [loadingDisableUser, setLoadingDisableUser] = useState(false);
  const [successDisableUser, setSuccessDisableUser] = useState(false);
  const [errorDisableUser, setErrorDisableUser] = useState(false);
  const [defaultButtonDisableUser, setDefaultButtonDisableUser] = useState(false);

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('first_name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [openModalGroup, setOpenModalGroup] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [productsUnits, setProductsUnits] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);

  const [openModalAddGroup, setOpenModalAddGroup] = useState(false);
  const [nameGroup, setNameGroup] = useState('');

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
    [classes.buttonError]: error,
    [classes.buttonDefault]: defaultButton
  });

  const buttonClassNameDisableUser = clsx({
    [classes.buttonSuccess]: successDisableUser,
    [classes.buttonError]: errorDisableUser,
    [classes.buttonDefault]: defaultButtonDisableUser
  });

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const handleClickOpenModal = (id) => {
    setProductId(id);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setProductId(0);
    setOpenModal(false);
  };

  function handleClickOpenModalGroup() {
    setOpenModalGroup(true);
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

  function handleButtonDisableUserProgressError() {
    if (!loadingDisableUser) {
      setSuccessDisableUser(false);
      setLoadingDisableUser(true);
      timer.current = window.setTimeout(() => {
        setErrorDisableUser(true);
        setLoadingDisableUser(false);
      }, 2000);
    }
  }

  function handleButtonDisableUserProgress() {
    if (!loadingDisableUser) {
      setSuccessDisableUser(false);
      setLoadingDisableUser(true);
      timer.current = window.setTimeout(() => {
        setSuccessDisableUser(true);
        setLoadingDisableUser(false);
      }, 2000);
    }
  };

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
      } catch (err) {
        const { data, status } = error.response;
        toast.error(`${data.detail}`);
        if (status === 401) {
          setTimeout(() => {
            handleLogout();
          }, 5000);
        }
      }
    })();
  }, []);

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
    history.push(`/users/details/${id}`);
  }

  function handleEdit(id) {
    history.push(`/users/edit/${id}`);
  }

  async function handleDisableProduct(id) {
    const csrftoken = getCookie('csrftoken');

    try {
      const { data } = await api.put(`/products/deactivate/${id}`, {
        headers: {
          'X-CSRFToken': csrftoken
        }
      });
      handleButtonDisableUserProgress();
      setTimeout(() => {
        toast.success('Produto desabilitado com sucesso!');
      }, 2000);
      setProducts(data);
      setTimeout(() => {
        handleCloseModal();
        setDefaultButtonDisableUser(true);
      }, 3500);
    } catch (err) {
      const { data } = err.response;
      handleButtonDisableUserProgressError();
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

  function handleAddGroup() {
    setOpenModalAddGroup(true);
  }

  function handleCloseModalAddGroup() {
    setOpenModalAddGroup(false);
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
                <Button
                  className={classes.groupButton}
                  onClick={handleClickOpenModalGroup}
                  color="default"
                  variant="contained"
                >
                  Grupos
                </Button>
                {/* {
                  userPermissions[11] === '1' && (
                  )
                } */}
                {
                  userPermissions[14] === '1' && (
                    <Link to="/product/register" className="link" >
                      <Button
                        color="primary"
                        variant="contained"
                      >
                        Adicionar produto
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
                        <Avatar src={`${product.foto}`}></Avatar>
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
                          userPermissions[131] === '1' && (
                            <Tooltip title="Editar">
                              <IconButton onClick={() => handleEdit(product.id)} aria-label="Editar">
                                <EditIcon size={8} style={{ color: orange[300] }} />
                              </IconButton>
                            </Tooltip>
                          )
                        }
                        {
                          userPermissions[133] === '1' && (
                            <Tooltip title="Detalhes">
                              <IconButton onClick={() => handleDetails(product.id)} aria-label="Detalhes">
                                <DetailIcon size={8} style={{ color: lightBlue[300] }} />
                              </IconButton>
                            </Tooltip>
                          )
                        }
                        {
                          userPermissions[132] === '1' && (
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
      {/* DELETE USER MODAL */}
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
            onClick={() => handleDisableProduct(productId)}
            color="primary"
            className={buttonClassNameDisableUser}
            disabled={loadingDisableUser}
            variant="contained"
          >
            Apenas desativar
            {loadingDisableUser && <CircularProgress size={24} className={classes.buttonProgress} />}
          </Button>

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

      {/* MODAL GROUPS */}
      <Dialog open={openModalGroup} onClose={handleCloseModalGroup} className={classes.groupModal} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          <Typography variant="h6" >Grupos de produtos</Typography>
          <IconButton aria-label="close" className={classes.closeButton} onClick={handleCloseModalGroup}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box
            display="flex"
            justifyContent="flex-end"
          >
            <Button
              color="primary"
              variant="contained"
              onClick={handleAddGroup}
            >
              Adicionar grupo
            </Button>
          </Box>
          <Paper className={classes.paper}>
            <Box>
              <TableProductGroups />
            </Box>
          </Paper>
        </DialogContent>
      </Dialog>

      {/* MODAL REGISTER GROUPS */}
      <Dialog open={openModalAddGroup} onClose={handleCloseModalAddGroup} className={classes.groupModal} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          <Typography variant="h6" >Adicionar grupo</Typography>
          <IconButton aria-label="close" className={classes.closeButton} onClick={handleCloseModalAddGroup}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Nome"
              name="nome"
              autoFocus
              value={nameGroup}
              onChange={(e) => { setNameGroup(e.target.value) }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            type="button"
            variant="contained"
            color="primary"
          >
            Adicionar
          </Button>
          <Button
            type="button"
            variant="contained"
            color="secondary"
            onClick={handleCloseModalAddGroup}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}
