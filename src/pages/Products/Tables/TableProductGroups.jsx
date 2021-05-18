import React, { useState, useEffect, useRef, useContext } from 'react';
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
  Fade,
  Menu,
  MenuItem
} from '@material-ui/core';

import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  More as DetailIcon,
  DeleteForever as DeleteForeverIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  MoreVert as MoreVertIcon
} from '@material-ui/icons';

import { orange, red } from '@material-ui/core/colors';
import { toast } from 'react-toastify';

import api from '../../../services/api';
import history from '../../../services/history';
import getCookie from '../../../utils/functions';
import { Context } from '../../../Context/AuthContext';
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

const headCellsTableGroups = [
  { id: 'grupo', numeric: false, disablePadding: false, label: 'Seção' },
  { id: 'sub1', numeric: false, disablePadding: false, label: 'Grupo' },
  { id: 'sub2', numeric: false, disablePadding: false, label: 'Subgrupo' },
  { id: 'action', numeric: false, disablePadding: false, label: '' },
];

function TableHeadGroup(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCellsTableGroups.map((headCell) => (
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

TableHeadGroup.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function TableProductGroups() {
  const classes = useStyles();
  const timer = useRef();
  const { handleLogout } = useContext(Context);

  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState(0);
  const [openModalDeleteGroup, setOpenModalDeleteGroup] = useState(false);
  const [loadingModalGroup, setLoadingModalGroup] = useState(false);
  const [successModalGroup, setSuccessModalGroup] = useState(false);
  const [errorModalGroup, setErrorModalGroup] = useState(false);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('grupo');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);

  const buttonClassNameModalGroup = clsx({
    [classes.buttonSuccess]: successModalGroup,
    [classes.buttonError]: errorModalGroup,
  });

  const openMenuSettingGroup = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenuSettingsGroup = () => {
    setAnchorEl(null);
  };

  function handleButtonModalGroupProgressError() {
    if (!loadingModalGroup) {
      setSuccessModalGroup(false);
      setLoadingModalGroup(true);
      timer.current = window.setTimeout(() => {
        setErrorModalGroup(true);
        setLoadingModalGroup(false);
      }, 2000);
    }
  }

  function handleButtonModalGroupProgress() {
    if (!loadingModalGroup) {
      setSuccessModalGroup(false);
      setLoadingModalGroup(true);
      timer.current = window.setTimeout(() => {
        setSuccessModalGroup(true);
        setLoadingModalGroup(false);
      }, 2000);
    }
  };

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
        setTimeout(() => {
          handleLogout();
        }, 5000);
      }
    })();
  }, [groupId, handleLogout]);

  function handleDetailGroup(id) {
    history.push(`/products/groups/details/${id}`);
  }

  function handleEditGroup(id) {
    history.push(`/products/groups/edit/${id}`);
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


  const handleClickOpenModalGroup = (id) => {
    setGroupId(id);
    setOpenModalDeleteGroup(true);
  };

  const handleCloseModalDeleteGroup = () => {
    setGroupId(0);
    setOpenModalDeleteGroup(false);
  };


  async function handleDeleteGroupProduct(id) {
    const csrftoken = getCookie('csrftoken');

    try {
      await api.delete(`/prod-groups/delete/${id}`, {
        headers: {
          'X-CSRFToken': csrftoken
        }
      });
      handleButtonModalGroupProgress();
      setTimeout(() => {
        toast.success('Grupo deletado com sucesso!');
      }, 2000);
      setGroupId(0);
      setTimeout(() => {
        handleCloseModalDeleteGroup();
      }, 3500);
    } catch (err) {
      const { data } = err.response;
      handleButtonModalGroupProgressError();
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
    }
  }

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, groups.length - page * rowsPerPage);

  return (
    <>
      <TableContainer>
        <Table
          className={classes.table}
          aria-labelledby="tableTitle"
          size="small"
          aria-label="enhanced table"
        >
          <TableHeadGroup
            classes={classes}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            rowCount={groups.length}
          />
          <TableBody>
            {
              stableSort(groups, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((group, index) => {
                  return (
                    <TableRow
                      hover
                      key={group.id}
                    >
                      <TableCell>{group.nv1}</TableCell>
                      <TableCell>{group.nv2}</TableCell>
                      <TableCell>{group.nv3}</TableCell>
                      <TableCell padding="default" align="right">
                        <IconButton color="inherit" onClick={handleClick} >
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          id="fade-menu"
                          anchorEl={anchorEl}
                          keepMounted
                          open={openMenuSettingGroup}
                          onClose={handleCloseMenuSettingsGroup}
                          TransitionComponent={Fade}
                        >
                          <MenuItem onClick={() => handleEditGroup(group.id)}>
                            Editar
                          </MenuItem>

                          <MenuItem onClick={() => handleClickOpenModalGroup(group.id)}>
                            Deletar
                          </MenuItem>

                          {
                            group.nv2 === '' || group.nv2 === null && (
                              <MenuItem>
                                Adicionar subgrupo 1
                              </MenuItem>
                            )
                          }

                          {
                            group.nv3 === '' || group.nv3 === null && (
                              <MenuItem>
                                Adicionar subgrupo 2
                              </MenuItem>
                            )
                          }
                        </Menu>
                      </TableCell>
                    </TableRow>
                  )
                }
                )
            }
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
        count={groups.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        labelRowsPerPage="Linhas por página"
      />

      {/* MODAL DELETE GROUP */}
      <Dialog
        open={openModalDeleteGroup}
        onClose={handleCloseModalDeleteGroup}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Deletar grupo de produto
          <IconButton aria-label="close" className={classes.closeButton} onClick={handleCloseModalDeleteGroup}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers className={classes.modalContent}>
          <DialogContentText variant="h6" id="alert-dialog-description" className={classes.modalContentText}>
            <div className={classes.divIconModal}>
              <DeleteForeverIcon className={classes.modalIcon} />
            </div>
            Você realmente deseja deletar este grupo? Esta operação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleDeleteGroupProduct(groupId)}
            color="secondary"
            className={buttonClassNameModalGroup}
            disabled={loadingModalGroup}
            variant="contained"
          >
            Deletar
            {loadingModalGroup && <CircularProgress size={24} className={classes.buttonProgressModalGroups} />}
          </Button>

          <Button onClick={handleCloseModalDeleteGroup} color="primary" variant="outlined" autoFocus>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
