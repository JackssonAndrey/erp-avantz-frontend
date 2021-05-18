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
  Save as SaveIcon
} from '@material-ui/icons';

import { orange, lightBlue, red } from '@material-ui/core/colors';

import api from '../../../services/api';
import getCookie from '../../../utils/functions';
import { Context } from '../../../Context/AuthContext';
import { toast } from 'react-toastify';
import history from '../../../services/history';
import { useStyles } from './styles';

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
  { id: 'marca', numeric: false, disablePadding: false, label: 'Marca' },
  { id: 'nome', numeric: false, disablePadding: false, label: 'Nome' },
  { id: 'actions', numeric: false, disablePadding: true, label: '' },
];

function TableFabricatorHead(props) {
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

TableFabricatorHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function TableProductFabricator({ fabricators }) {
  const { handleLogout } = useContext(Context);
  const classes = useStyles();
  const timer = useRef();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('marca');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [defaultButton, setDefaultButton] = useState(false);

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);



  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
    [classes.buttonError]: error,
    [classes.buttonDefault]: defaultButton
  });

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

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, fabricators.length - page * rowsPerPage);

  async function handleEdit(id) {
    console.log(id);
  }

  async function handleClickOpenModal(id) {
    console.log(id);
  }

  return (
    <>
      <TableContainer>
        <Table
          className={classes.table}
          aria-labelledby="tableTitle"
          size="small"
          aria-label="enhanced table"
        >
          <TableFabricatorHead
            classes={classes}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            rowCount={fabricators.length}
          />

          <TableBody>
            {stableSort(fabricators, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((fabricator, index) => {
                return (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={fabricator.id}
                  >
                    <TableCell padding="none" align="left">{fabricator.marca}</TableCell>
                    <TableCell padding="none" align="left">{fabricator.nome}</TableCell>
                    <TableCell padding="default" align="right">
                      <Tooltip title="Editar">
                        <IconButton onClick={() => handleEdit(fabricator.id)} aria-label="Editar">
                          <EditIcon size={8} style={{ color: orange[300] }} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Deletar">
                        <IconButton onClick={() => handleClickOpenModal(fabricator.id)} aria-label="Deletar">
                          <DeleteIcon size={8} style={{ color: red[300] }} />
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
        count={fabricators.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        labelRowsPerPage="Linhas por página"
      />
    </>
  );
}
