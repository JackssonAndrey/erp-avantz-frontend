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
  FormControl,
  InputLabel,
  TextField,
  Divider,
  Select,
  MenuItem
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
  { id: 'tipo', numeric: false, disablePadding: false, label: 'Tipo' },
  { id: 'sigla', numeric: false, disablePadding: false, label: 'Sigla' },
  { id: 'descricao', numeric: false, disablePadding: true, label: 'Descrição' },
  { id: 'actions', numeric: false, disablePadding: true, label: '' },
];

function TableUnitsHead(props) {
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

TableUnitsHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function TableProductUnits({ units }) {
  const classes = useStyles();
  const timer = useRef();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('sigla');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const [loadingRemove, setLoadingRemove] = useState(false);
  const [successRemove, setSuccessRemove] = useState(false);
  const [errorRemove, setErrorRemove] = useState(false);
  const [defaultButtonRemove, setDefaultButtonRemove] = useState(false);
  const [openModalRemove, setOpenModalRemove] = useState(false);

  const [allUnits, setAllUnits] = useState(units)
  const [openModalEditUnits, setOpenModalEditUnits] = useState(false);
  const [unitsInitials, setUnitsInitials] = useState('');
  const [unitsDescription, setUnitsDescription] = useState('');
  const [unitsId, setUnitsId] = useState('');
  const [unitType, setUnitType] = useState(1);

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    setAllUnits(units);
  }, [units]);

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
    [classes.buttonError]: error,
  });

  const buttonClassnameRemove = clsx({
    [classes.buttonSuccess]: successRemove,
    [classes.buttonError]: errorRemove,
    [classes.buttonDefault]: defaultButtonRemove
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


  function handleButtonClickProgressRemove() {
    if (!loadingRemove) {
      setSuccessRemove(false);
      setLoadingRemove(true);
      timer.current = window.setTimeout(() => {
        setSuccessRemove(true);
        setLoadingRemove(false);
      }, 2000);
    }
  }

  function handleButtonClickProgressErrorRemove() {
    if (!loadingRemove) {
      setSuccessRemove(false);
      setLoadingRemove(true);
      timer.current = window.setTimeout(() => {
        setErrorRemove(true);
        setLoadingRemove(false);
      }, 2000);
    }
  }

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, allUnits.length - page * rowsPerPage);

  function handleOpenModalEdit(id, tipo, unidade, descricao) {
    setUnitsId(id);
    setUnitsInitials(unidade);
    setUnitsDescription(descricao);
    setUnitType(tipo);
    setOpenModalEditUnits(true);
  }

  function handleCloseModalEdit() {
    setUnitsId('');
    setUnitsInitials('');
    setUnitsDescription('');
    setUnitType(1);
    setOpenModalEditUnits(false);
  }

  function handleCloseModalRemove() {
    setOpenModalRemove(false);
    setUnitsId('');
    setDefaultButtonRemove(true);
  }

  function handleOpenModalRemove(id) {
    setUnitsId(id);
    setOpenModalRemove(true);
  }

  async function handleEdit() {
    try {
      const { data } = await api.put(`/units/update/${unitsId}`, { und: unitsInitials, descr: unitsDescription, tipo: unitType });
      handleButtonClickProgress();
      setTimeout(() => {
        toast.success('Unidade atualizado com sucesso!');
        setAllUnits(data);
        handleCloseModalEdit();
      }, 2000);
    } catch (error) {
      const { data } = error.response;
      handleButtonClickProgressError();
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
    }
  }

  async function handleDelete(id) {
    try {
      const { data } = await api.delete(`/units/delete/${id}`);
      handleButtonClickProgressRemove();
      setTimeout(() => {
        toast.success('Unidade deletada com sucesso!');
        handleCloseModalRemove();
        setAllUnits(data);
      }, 2000);
    } catch (error) {
      const { data } = error.response;
      handleButtonClickProgressErrorRemove();
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
          <TableUnitsHead
            classes={classes}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            rowCount={allUnits.length}
          />

          <TableBody>
            {stableSort(allUnits, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((unit, index) => {
                return (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={unit.id}
                  >
                    <TableCell padding="none" align="left">
                      {unit.tipo === 0 && 'None'}
                      {unit.tipo === 1 && 'Todos'}
                      {unit.tipo === 2 && 'Produtos'}
                      {unit.tipo === 3 && 'Serviços'}
                    </TableCell>
                    <TableCell padding="none" align="left">{unit.und}</TableCell>
                    <TableCell component="th" scope="row" padding="none">
                      {unit.descr}
                    </TableCell>
                    <TableCell padding="default" align="right">
                      <Tooltip title="Editar">
                        <IconButton onClick={() => handleOpenModalEdit(unit.id, unit.tipo, unit.und, unit.descr)} aria-label="Editar">
                          <EditIcon size={8} style={{ color: orange[300] }} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Deletar">
                        <IconButton onClick={() => handleOpenModalRemove(unit.id)} aria-label="Deletar">
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
        count={allUnits.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        labelRowsPerPage="Linhas por página"
      />

      {/* MODAL UNITS */}
      <Dialog open={openModalEditUnits} onClose={handleCloseModalEdit} className={classes.unitsModal} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          <Typography variant="h6" >Editar registro de unidade</Typography>
          <IconButton aria-label="close" className={classes.closeButton} onClick={handleCloseModalEdit}>
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
                    onChange={(e) => setUnitType(e.target.value)}
                  >
                    <MenuItem value={0}>
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
                  startIcon={<SaveIcon size={8} color="primary" />}
                  onClick={handleEdit}
                  disabled={loading}
                  className={buttonClassname}
                >
                  Salvar
                  {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
        </DialogContent>
      </Dialog>

      {/* MODAL REMOVE FABRICATOR */}
      <Dialog
        open={openModalRemove}
        onClose={handleCloseModalRemove}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title">Remover registro de unidade do produto</DialogTitle>
        <DialogContent>
          <Typography>
            Deseja realmente excluir este registro de unidade do produto?
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
            <Button onClick={handleCloseModalRemove} style={{ color: red[300], marginRight: '10px' }}>
              Cancelar
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              autoFocus
              className={buttonClassnameRemove}
              disabled={loadingRemove}
              onClick={() => handleDelete(unitsId)}
            >
              Excluir
              {loadingRemove && <CircularProgress size={24} className={classes.buttonProgress} />}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}
