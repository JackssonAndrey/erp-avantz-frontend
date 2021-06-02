import React, { useState, useEffect, useRef } from 'react';
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
  Typography,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Button,
  Grid,
  TextField
} from '@material-ui/core';

import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  DeleteForever as DeleteForeverIcon,
  Close as CloseIcon,
} from '@material-ui/icons';

import { orange, red } from '@material-ui/core/colors';
import { toast } from 'react-toastify';

import api from '../../../services/api';
import getCookie from '../../../utils/functions';
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

const initialDetailGroup = {
  id: 0,
  instit: 0,
  niv: 0,
  nv1: "",
  nv2: "",
  nv1id: 0,
  nv3: "",
  nv2id: 0,
  data: ""
};

export default function TableProductGroups({ groups }) {
  const classes = useStyles();
  const timer = useRef();

  const [allGroups, setAllGroups] = useState(groups);
  const [groupId, setGroupId] = useState(0);
  const [openModalDeleteGroup, setOpenModalDeleteGroup] = useState(false);
  const [loadingModalGroup, setLoadingModalGroup] = useState(false);
  const [successModalGroup, setSuccessModalGroup] = useState(false);
  const [errorModalGroup, setErrorModalGroup] = useState(false);
  const [defaultButtonRemove, setDefaultButtonRemove] = useState(false);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('grupo');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [detailsGroup, setDetailsGroup] = useState(initialDetailGroup);
  const [openModalEditGroup, setOpenModalEditGroup] = useState(false);
  const [loadingModalEditGroup, setLoadingModalEditGroup] = useState(false);
  const [successModalEditGroup, setSuccessModalEditGroup] = useState(false);
  const [errorModalEditGroup, setErrorModalEditGroup] = useState(false);
  const [defaultButtonEdit, setDefaultButtonEdit] = useState(false);

  const buttonClassNameModalGroup = clsx({
    [classes.buttonSuccess]: successModalGroup,
    [classes.buttonError]: errorModalGroup,
    [classes.buttonDefaultSecondary]: defaultButtonRemove
  });

  const buttonClassNameModalEditGroup = clsx({
    [classes.buttonSuccess]: successModalEditGroup,
    [classes.buttonError]: errorModalEditGroup,
    [classes.buttonDefaultSecondary]: defaultButtonEdit
  });

  useEffect(() => {
    setAllGroups(groups);
  }, [groups]);

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

  function handleButtonModalEditGroupProgressError() {
    if (!loadingModalEditGroup) {
      setSuccessModalEditGroup(false);
      setLoadingModalEditGroup(true);
      timer.current = window.setTimeout(() => {
        setErrorModalEditGroup(true);
        setLoadingModalEditGroup(false);
      }, 2000);
    }
  }

  function handleButtonModalEditGroupProgress() {
    if (!loadingModalEditGroup) {
      setSuccessModalEditGroup(false);
      setLoadingModalEditGroup(true);
      timer.current = window.setTimeout(() => {
        setSuccessModalEditGroup(true);
        setLoadingModalEditGroup(false);
      }, 2000);
    }
  };

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

  const handleClickOpenModalEditGroup = (id) => {
    setGroupId(id);
    handleDetails(id);
    setOpenModalEditGroup(true);
  };

  const handleCloseModalEditGroup = () => {
    setGroupId(0);
    setOpenModalEditGroup(false);
    setDetailsGroup(initialDetailGroup);
  };

  function handleChangeInputs(e) {
    const { name, value } = e.target;
    setDetailsGroup({ ...detailsGroup, [name]: value });
  }

  async function handleDetails(id) {
    try {
      const { data } = await api.get(`/prod-groups/details/${id}`);
      setDetailsGroup(data);
    } catch (error) {
      const { data } = error.response;
      toast.error(`${data.detail}`);
    }
  }

  async function handleDeleteGroupProduct(id) {
    const csrftoken = getCookie('csrftoken');

    try {
      const { data } = await api.delete(`/prod-groups/delete/${id}`, {
        headers: {
          'X-CSRFToken': csrftoken
        }
      });
      handleButtonModalGroupProgress();
      setTimeout(() => {
        toast.success('Grupo deletado com sucesso!');
        setAllGroups(data);
        setGroupId(0);
      }, 2000);
      setTimeout(() => {
        handleCloseModalDeleteGroup();
        setDefaultButtonRemove(true);
      }, 3500);
    } catch (err) {
      const { data } = err.response;
      handleButtonModalGroupProgressError();
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
    }
  }

  async function handleEdit(id) {
    try {
      const dataGroup = {
        nv1: detailsGroup.nv1,
        nv2: detailsGroup.nv2,
        nv3: detailsGroup.nv3
      }
      const { data } = await api.put(`/prod-groups/update/${id}`, dataGroup);
      handleButtonModalEditGroupProgress();
      setTimeout(() => {
        toast.success('Registro atualizado com sucesso.');
        setAllGroups(data);
        handleCloseModalEditGroup();
        setDefaultButtonEdit(true);
      }, 2000);
    } catch (error) {
      const { data } = error.response;
      handleButtonModalEditGroupProgressError();
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
    }
  }

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, allGroups.length - page * rowsPerPage);

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
            rowCount={allGroups.length}
          />
          <TableBody>
            {
              stableSort(allGroups, getComparator(order, orderBy))
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
                        <Tooltip title="Editar" arrow>
                          <IconButton onClick={() => handleClickOpenModalEditGroup(group.id)}>
                            <EditIcon size={8} style={{ color: orange[300] }} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Deletar" arrow>
                          <IconButton onClick={() => handleClickOpenModalGroup(group.id)}>
                            <DeleteIcon size={8} style={{ color: red[300] }} />
                          </IconButton>
                        </Tooltip>
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
        count={allGroups.length}
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
            {loadingModalGroup && <CircularProgress size={24} className={classes.buttonProgress} />}
          </Button>

          <Button onClick={handleCloseModalDeleteGroup} color="primary" variant="outlined" autoFocus>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      {/* MODAL EDIT GROUP */}
      <Dialog
        open={openModalEditGroup}
        onClose={handleCloseModalEditGroup}
        className={classes.groupModal}
        aria-labelledby="form-dialog-title"
        maxWidth="lg"
      >
        <DialogTitle id="form-dialog-title">
          <Typography variant="h6" >Editar grupo</Typography>
          <IconButton aria-label="close" className={classes.closeButton} onClick={handleCloseModalEditGroup}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers style={{ width: '700px' }}>
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
                label="Seção"
                value={detailsGroup.nv1}
                name="nv1"
                onChange={(e) => handleChangeInputs(e)}
                variant="outlined"
              />
            </Grid>

            <Grid
              item
              xs={4}
              xl={4}
              sm={4}
            >
              <TextField
                fullWidth
                required
                label="Grupo"
                name="nv2"
                value={detailsGroup.nv2}
                onChange={(e) => handleChangeInputs(e)}
                variant="outlined"
              />
            </Grid>

            <Grid
              item
              xs={4}
              xl={4}
              sm={4}
            >
              <TextField
                fullWidth
                required
                label="Subgrupo"
                name="nv3"
                value={detailsGroup.nv3}
                onChange={(e) => handleChangeInputs(e)}
                variant="outlined"
              />
            </Grid>

            <Grid
              item
              xs={12}
              xl={12}
              sm={12}
            >
              <Button
                type="button"
                variant="contained"
                color="primary"
                className={buttonClassNameModalEditGroup}
                disabled={loadingModalEditGroup}
                onClick={() => handleEdit(groupId)}
              >
                Salvar alterações
                {loadingModalEditGroup && <CircularProgress size={24} className={classes.buttonProgress} />}
              </Button>
            </Grid>
          </Grid>

        </DialogContent>
      </Dialog>
    </>
  );
}
