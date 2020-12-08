import React, { useState, useEffect, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import DetailIcon from '@material-ui/icons/More';
import { orange, lightBlue, red, blue, green } from '@material-ui/core/colors';
import Avatar from '@material-ui/core/Avatar';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

import api from '../../services/api';
import getCookie from '../../utils/functions';
import { Context } from '../../Context/AuthContext';
import { toast } from 'react-toastify';
import history from '../../services/history';


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
  { id: 'razaoSocial', numeric: false, disablePadding: false, label: 'Razão Social' },
  { id: 'cpfCnpj', numeric: false, disablePadding: true, label: 'CNPJ' },
  { id: 'fornecedor', numeric: false, disablePadding: true, label: 'Fornecedor' },
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

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = () => {
  const classes = useToolbarStyles();
  // const { numSelected } = props;

  return (
    <Toolbar>
      <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
        Pessoas Físicas
      </Typography>
    </Toolbar>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonError: {
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonProgress: {
    color: blue[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default function EnhancedTable() {
  const { handleLogout } = useContext(Context);
  const classes = useStyles();
  const timer = useRef();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('first_name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [legalPersons, setLegalPersons] = useState([]);
  const [personId, setPersonId] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
    [classes.buttonError]: error,
  });

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const handleClickOpenModal = (id) => {
    setPersonId(id);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setPersonId(0);
    setOpenModal(false);
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
    async function getAllPersons() {
      const csrftoken = getCookie('csrftoken');
      try {
        const { data } = await api.get('/persons/legal/', {
          headers: {
            'X-CSRFToken': csrftoken
          }
        });
        setLegalPersons(data);
      } catch (error) {
        const { data } = error.response;
        toast.error(`${data.detail}`);
        setTimeout(() => {
          handleLogout();
        }, 5000);
      }

    }
    getAllPersons();
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

  function handleDetailsPerson(id) {
    history.push(`/persons/details/${id}`);
  }

  function handleEditPerson(id) {
    history.push(`/persons/edit/${id}`);
  }

  function handleDeletePerson(id) {
    const csrftoken = getCookie('csrftoken');

    api.put(`/persons/delete/${id}`, { personId }, {
      headers: {
        'X-CSRFToken': csrftoken
      }
    }).then(result => {
      handleButtonClickProgress();
      setTimeout(() => {
        toast.success('Registro da pessoa deletado com sucesso!');
      }, 2000);
      setTimeout(() => {
        handleCloseModal();
      }, 7000);
    }).catch(reject => {
      const { data } = reject.response;
      handleButtonClickProgressError();
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
    });
  }

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, legalPersons.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={legalPersons.length}
            />
            <TableBody>
              {stableSort(legalPersons, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((person, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={person.id_pessoa_cod}
                    >
                      <TableCell padding="checkbox" size="small" align="left">
                        <Avatar>A</Avatar>
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {person.nomeorrazaosocial}
                      </TableCell>
                      <TableCell padding="none" align="left">{person.cpfcnpj}</TableCell>
                      <TableCell padding="none" align="left">{person.forn}</TableCell>
                      <TableCell padding="default" align="right">
                        <Tooltip title="Editar">
                          <IconButton onClick={() => handleEditPerson(person.id_pessoa_cod)} aria-label="Editar">
                            <EditIcon size={8} style={{ color: orange[300] }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Detalhes">
                          <IconButton onClick={() => handleDetailsPerson(person.id_pessoa_cod)} aria-label="Detalhes">
                            <DetailIcon size={8} style={{ color: lightBlue[600] }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Deletar">
                          <IconButton onClick={() => handleClickOpenModal(person.id_pessoa_cod)} aria-label="Deletar">
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
          count={legalPersons.length}
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
        <DialogTitle id="alert-dialog-title">Deletar Pessoa</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Você realmente deseja deletar este registro?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleDeletePerson(personId)}
            color="secondary"
            className={buttonClassname}
            disabled={loading}
          >
            Deletar
            {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
          </Button>
          <Button onClick={handleCloseModal} color="primary" autoFocus>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
