import React, { useState, useEffect, useContext, useRef } from 'react';
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
  Divider
} from '@material-ui/core';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  More as DetailIcon,
  DeleteForever as DeleteForeverIcon
} from '@material-ui/icons';

import { orange, lightBlue, red } from '@material-ui/core/colors';

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
  { id: 'avatar', numeric: false, disablePadding: false, label: 'Avatar' },
  { id: 'first_name', numeric: false, disablePadding: true, label: 'Primeiro nome' },
  { id: 'username', numeric: false, disablePadding: true, label: 'Nome usuário' },
  { id: 'email', numeric: false, disablePadding: true, label: 'E-mail' },
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
  // const { numSelected } = props;

  return (
    <Toolbar>
      <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
        Usuários
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
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('first_name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
    [classes.buttonError]: error,
    [classes.buttonDefault]: defaultButton
  });

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const handleClickOpenModal = (id) => {
    setUserId(id);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setUserId(0);
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
    async function getAllUsers() {
      const csrftoken = getCookie('csrftoken');
      try {
        const { data } = await api.get('/users/list', {
          headers: {
            'X-CSRFToken': csrftoken
          }
        });
        setUsers(data.users);
      } catch (error) {
        const { data } = error.response;
        toast.error(`${data.detail}`);
        setTimeout(() => {
          handleLogout();
        }, 5000);
      }

    }
    getAllUsers();
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

  function handleDetailsUser(id) {
    history.push(`/users/details/${id}`);
  }

  function handleEditUser(id) {
    history.push(`/users/edit/${id}`);
  }

  function handleDeleteUser(id) {
    const csrftoken = getCookie('csrftoken');

    api.put(`/users/delete/${id}`, { userId }, {
      headers: {
        'X-CSRFToken': csrftoken
      }
    }).then(result => {
      handleButtonClickProgress();
      setTimeout(() => {
        toast.success('Usuário deletado com sucesso!');
      }, 2000);
      setTimeout(() => {
        handleCloseModal();
        setDefaultButton(true);
      }, 3500);
    }).catch(reject => {
      const { data } = reject.response;
      handleButtonClickProgressError();
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
    });
  }

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, users.length - page * rowsPerPage);

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
              rowCount={users.length}
            />
            <TableBody>
              {stableSort(users, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={user.username}
                    >
                      <TableCell padding="checkbox" size="small" align="left">
                        <Avatar>A</Avatar>
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {user.first_name}
                      </TableCell>
                      <TableCell padding="none" align="left">{user.username}</TableCell>
                      <TableCell padding="none" align="left">{user.email}</TableCell>
                      <TableCell padding="default" align="right">
                        <Tooltip title="Editar">
                          <IconButton onClick={() => handleEditUser(user.id)} aria-label="Editar">
                            <EditIcon size={8} style={{ color: orange[300] }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Detalhes">
                          <IconButton onClick={() => handleDetailsUser(user.id)} aria-label="Detalhes">
                            <DetailIcon size={8} style={{ color: lightBlue[600] }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Deletar">
                          <IconButton onClick={() => handleClickOpenModal(user.id)} aria-label="Deletar">
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
          count={users.length}
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
        <DialogTitle id="alert-dialog-title">Deletar usuário</DialogTitle>
        <Divider />
        <DialogContent className={classes.modalContent}>
          <div className={classes.divIconModal}>
            <DeleteForeverIcon className={classes.modalIcon} />
          </div>
          <DialogContentText id="alert-dialog-description" className={classes.modalContentText}>
            <p>Você realmente deseja deletar este usuário? Esta operação não pode ser desfeita.</p>
          </DialogContentText>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button
            onClick={() => handleDeleteUser(userId)}
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
    </div>
  );
}
