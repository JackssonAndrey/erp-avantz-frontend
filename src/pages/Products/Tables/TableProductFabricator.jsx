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
  DialogTitle,
  CircularProgress,
  Button,
  Box,
  Grid,
  TextField,
  Divider,
} from '@material-ui/core';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  Save as SaveIcon
} from '@material-ui/icons';

import { orange, red } from '@material-ui/core/colors';

import api from '../../../services/api';
import { toast } from 'react-toastify';
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
  const classes = useStyles();
  const timer = useRef();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('marca');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loadingRemoveFabricator, setLoadingRemoveFabricator] = useState(false);
  const [successRemoveFabricator, setSuccessRemoveFabricator] = useState(false);
  const [errorRemoveFabricator, setErrorRemoveFabricator] = useState(false);
  const [defaultButtonRemoveFabricator, setDefaultButtonRemoveFabricator] = useState(false);
  const [openModalEditFabricator, setOpenModalEditFabricator] = useState(false);
  const [openModalRemoveFabricator, setOpenModalRemoveFabricator] = useState(false);
  const [nameFabricator, setNameFabricator] = useState('');
  const [brandFabricator, setBrandFabricator] = useState('');
  const [idFabricator, setIdFabricator] = useState('');
  const [allFabricators, setAllFabricators] = useState(fabricators);

  const buttonClassName = clsx({
    [classes.buttonSuccess]: success,
    [classes.buttonError]: error,
  });

  const buttonClassnameRemoveFabricator = clsx({
    [classes.buttonSuccess]: successRemoveFabricator,
    [classes.buttonError]: errorRemoveFabricator,
    [classes.buttonDefault]: defaultButtonRemoveFabricator
  });

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    setAllFabricators(fabricators);
  }, [fabricators]);

  function handleOpenModalEditFabricator(id, brandFabricator, nameFabricator) {
    setIdFabricator(id);
    setBrandFabricator(brandFabricator);
    setNameFabricator(nameFabricator);
    setOpenModalEditFabricator(true);
  }

  function handleCloseModalEditFabricator() {
    setIdFabricator('');
    setBrandFabricator('');
    setNameFabricator('');
    setOpenModalEditFabricator(false);
  }

  function handleCloseModalRemoveFabricator() {
    setOpenModalRemoveFabricator(false);
    setIdFabricator('');
    setDefaultButtonRemoveFabricator(true);
  }

  function handleOpenModalRemoveFabricator(id) {
    setIdFabricator(id);
    setOpenModalRemoveFabricator(true);
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

  function handleButtonClickProgressRemoveFabricator() {
    if (!loadingRemoveFabricator) {
      setSuccessRemoveFabricator(false);
      setLoadingRemoveFabricator(true);
      timer.current = window.setTimeout(() => {
        setSuccessRemoveFabricator(true);
        setLoadingRemoveFabricator(false);
      }, 2000);
    }
  }

  function handleButtonClickProgressErrorRemoveFabricator() {
    if (!loadingRemoveFabricator) {
      setSuccessRemoveFabricator(false);
      setLoadingRemoveFabricator(true);
      timer.current = window.setTimeout(() => {
        setErrorRemoveFabricator(true);
        setLoadingRemoveFabricator(false);
      }, 2000);
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

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, fabricators.length - page * rowsPerPage);

  async function handleEdit() {
    try {
      const { data } = await api.put(`/fabricator/update/${idFabricator}`, { marca: brandFabricator, fabr: nameFabricator });
      handleButtonClickProgress();
      setTimeout(() => {
        toast.success('Fabricante atualizado com sucesso.');
        handleCloseModalEditFabricator();
        setAllFabricators(data);
      }, 2000);
    } catch (err) {
      const { data } = err.response;
      handleButtonClickProgressError();
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
    }
  }

  async function handleDelete(id) {
    try {
      const { data } = await api.delete(`/fabricator/delete/${id}`);
      handleButtonClickProgressRemoveFabricator();
      setTimeout(() => {
        toast.success('Fabricante deletado com sucesso!');
        handleCloseModalRemoveFabricator();
        setAllFabricators(data);
      }, 2000);
    } catch (err) {
      const { data } = err.response;
      handleButtonClickProgressErrorRemoveFabricator();
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
    }
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
            rowCount={allFabricators.length}
          />

          <TableBody>
            {stableSort(allFabricators, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((fabricator, index) => {
                return (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={fabricator.id}
                  >
                    <TableCell padding="none" align="left">{fabricator.marca}</TableCell>
                    <TableCell padding="none" align="left">{fabricator.fabr}</TableCell>
                    <TableCell padding="default" align="right">
                      <Tooltip title="Editar">
                        <IconButton onClick={() => handleOpenModalEditFabricator(fabricator.id, fabricator.marca, fabricator.fabr)} aria-label="Editar">
                          <EditIcon size={8} style={{ color: orange[300] }} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Deletar">
                        <IconButton onClick={() => handleOpenModalRemoveFabricator(fabricator.id)} aria-label="Deletar">
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
        count={allFabricators.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        labelRowsPerPage="Linhas por página"
      />

      {/* MODAL EDIT FABRICATORS */}
      <Dialog open={openModalEditFabricator} onClose={handleCloseModalEditFabricator} className={classes.fabricatorModal} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          <Typography variant="h6" >Editar fabricante</Typography>
          <IconButton aria-label="close" className={classes.closeButton} onClick={handleCloseModalEditFabricator}>
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
                  onClick={handleEdit}
                  className={buttonClassName}
                  disabled={loading}
                >
                  <SaveIcon size={8} color="primary" />
                  {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>

      {/* MODAL REMOVE FABRICATOR */}
      <Dialog
        open={openModalRemoveFabricator}
        onClose={handleCloseModalRemoveFabricator}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title">Remover registro de fabricante do produto</DialogTitle>
        <DialogContent>
          <Typography>
            Deseja realmente excluir este registro de fabricante do produto?
          </Typography>
        </DialogContent>
        <Divider style={{ marginTop: '20px' }} />
        <DialogActions>
          <Box
            display="flex"
            justifyContent="flex-start"
            alignItems="flex-end"
            padding="15px"
          >
            <Button onClick={handleCloseModalRemoveFabricator} style={{ color: red[300], marginRight: '10px' }}>
              Cancelar
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              autoFocus
              className={buttonClassnameRemoveFabricator}
              disabled={loadingRemoveFabricator}
              onClick={() => handleDelete(idFabricator)}
            >
              Excluir
              {loadingRemoveFabricator && <CircularProgress size={24} className={classes.buttonProgressRemoveFabricator} />}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}
