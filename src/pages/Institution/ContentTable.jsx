import React, { useState, useEffect, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Table, TableBody,
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
  InputAdornment,
  Box,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  OutlinedInput,
  Divider
} from '@material-ui/core';

import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  More as DetailIcon,
  Search as SearchIcon,
  DeleteForever as DeleteForeverIcon
} from '@material-ui/icons';
import { orange, lightBlue, red } from '@material-ui/core/colors';
import { Link } from 'react-router-dom';

import api from '../../services/api';
import getCookie from '../../utils/functions';
import { Context } from '../../Context/AuthContext';
import { toast } from 'react-toastify';
import history from '../../services/history';
import { useToolbarStyles, useStyles } from './styles/tableStyles';

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
  { id: 'razaoSocial', numeric: false, disablePadding: false, label: 'Razão Social' },
  { id: 'cnpj', numeric: false, disablePadding: true, label: 'CNPJ' },
  { id: 'email', numeric: false, disablePadding: true, label: 'E-mail' },
  { id: 'telefone', numeric: false, disablePadding: true, label: 'Telefone' },
  { id: 'ativo', numeric: true, disablePadding: false, label: 'Ativo' },
  { id: 'actions', numeric: false, disablePadding: false, label: '' },
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

  return (
    <Toolbar>
      <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
        Instituições
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
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('razaoSocial');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [institutions, setInstitutions] = useState([]);
  const [institutionId, setInstitutionId] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [defaultButton, setDefaultButton] = useState(true);
  const [institutionSearch, setInstitutionSearch] = useState('');
  const [userPermissions, setUserPermissions] = useState([]);

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
    [classes.buttonError]: error,
    [classes.buttonDefault]: defaultButton
  });

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
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const handleClickOpenModal = (id) => {
    setInstitutionId(id);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setInstitutionId(0);
    setOpenModal(false);
    setDefaultButton();
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

  useEffect(() => {
    (async () => {
      const csrftoken = getCookie('csrftoken');

      try {
        const { data } = await api.get('/institution', {
          headers: {
            'X-CSRFToken': csrftoken
          }
        });

        setInstitutions(data);
      } catch (err) {
        const { data, status } = error.response;
        toast.error(`${data.detail}`);
        if (status === 401) {
          setTimeout(() => {
            handleLogout();
          }, 4000);
        }
      }
    })();
  }, [handleLogout]);

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
    history.push(`/institutions/details/${id}`);
  }

  function handleEdit(id) {
    history.push(`/institutions/edit/${id}`);
  }

  async function handleDelete(id) {
    const csrftoken = getCookie('csrftoken');

    try {
      const { data } = await api.put(`/institution/deactivate/${id}`, {
        headers: {
          'X-CSRFToken': csrftoken
        }
      });
      handleButtonClickProgress();
      setTimeout(() => {
        toast.success('Registro da instituição foi desativado com sucesso!');
      }, 2000);
      setTimeout(() => {
        handleCloseModal();
        setInstitutions(data);
      }, 3000);
    } catch (err) {
      const { data } = err.response;
      handleButtonClickProgressError();
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    const csrftoken = getCookie('csrftoken');

    try {
      if (institutionSearch !== '') {
        const { data } = await api.get(`/institution/${institutionSearch}`, {
          headers: {
            'X-CSRFToken': csrftoken
          }
        });
        setInstitutions(data);
      } else {
        const { data } = await api.get(`/institution`, {
          headers: {
            'X-CSRFToken': csrftoken
          }
        });
        setInstitutions(data);
      }
    } catch (err) {
      const { data } = err.response;
      handleButtonClickProgressError();
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
    }
  }

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, institutions.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Box>
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
                <form onSubmit={(e) => handleSearch(e)}>
                  <FormControl variant="outlined" fullWidth size="small" >
                    <InputLabel>Pesquisar</InputLabel>
                    <OutlinedInput
                      value={institutionSearch}
                      onChange={(e) => setInstitutionSearch(e.target.value)}
                      fullWidth
                      label="Pesquisar"
                      name="institutionSearch"
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
                xs={6}
                xl={6}
                sm={6}
              >
                <Box
                  display="flex"
                  justifyContent="flex-end"
                >
                  <Link to="/institution/register" className="link" >
                    <Button
                      color="primary"
                      variant="contained"
                    >
                      Adicionar Instituição
                    </Button>
                  </Link>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

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
              rowCount={institutions.length}
            />
            <TableBody>
              {stableSort(institutions, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((institution, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={institution.id_instituicao}
                    >
                      <TableCell component="th" id={labelId} scope="row">
                        {institution.razsoc}
                      </TableCell>
                      <TableCell padding="none" align="left">{institution.cnpj}</TableCell>
                      <TableCell padding="none" align="left">{institution.mail1}</TableCell>
                      <TableCell padding="none" align="left">{institution.tel1}</TableCell>
                      <TableCell padding="none" align="center">
                        {
                          institution.ativo === 1 ? (
                            <Badge color="primary" badgeContent="Sim" overlap="rectangle" />
                          ) : (
                            <Badge color="secondary" badgeContent="Não" overlap="rectangle" />
                          )
                        }
                      </TableCell>
                      <TableCell padding="default" align="right">
                        <Tooltip title="Editar" arrow>
                          <IconButton onClick={() => handleEdit(institution.id_instituicao)} aria-label="Editar">
                            <EditIcon size={8} style={{ color: orange[300] }} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Detalhes" arrow>
                          <IconButton onClick={() => handleDetails(institution.id_instituicao)} aria-label="Detalhes">
                            <DetailIcon size={8} style={{ color: lightBlue[600] }} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Deletar" arrow>
                          <IconButton onClick={() => handleClickOpenModal(institution.id_instituicao)} aria-label="Deletar">
                            <DeleteIcon size={8} style={{ color: red[200] }} />
                          </IconButton>
                        </Tooltip>
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
          count={institutions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página"
        />
      </Paper>

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Desativar registro de instituição</DialogTitle>
        <Divider />
        <DialogContent className={classes.modalContent}>
          <div className={classes.divIconModal}>
            <DeleteForeverIcon className={classes.modalIcon} />
          </div>
          <DialogContentText id="alert-dialog-description" className={classes.modalContentText}>
            <p>Você realmente deseja desativar este registro? Voce poderá ativar novamente depois.</p>
          </DialogContentText>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button
            onClick={() => handleDelete(institutionId)}
            color="secondary"
            variant="contained"
            className={buttonClassname}
            disabled={loading}
          >
            Deletar
            {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
          </Button>
          <Button onClick={handleCloseModal} color="primary" variant="outlined" autoFocus>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
