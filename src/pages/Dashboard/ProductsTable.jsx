import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  TableRow
} from '@material-ui/core';

import api from '../../services/api';

import useStyles from './styles';

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
  { id: 'codigo', numeric: false, disablePadding: true, label: 'Código' },
  { id: 'descricao', numeric: false, disablePadding: false, label: 'Descrição Resumida' },
  { id: 'unidade', numeric: true, disablePadding: false, label: 'Unidade' },
  { id: 'barra', numeric: true, disablePadding: false, label: 'Código barras' },
  { id: 'fornecedor', numeric: false, disablePadding: false, label: 'Fornecedor' },
  { id: 'fabricante', numeric: false, disablePadding: false, label: 'Fabricante' },
  { id: 'estoque_frente', numeric: false, disablePadding: false, label: 'Estoque Frente' },
  { id: 'preco1', numeric: false, disablePadding: false, label: 'Preço 1' },
  { id: 'preco2', numeric: false, disablePadding: false, label: 'Preço 2' },
  { id: 'preco3', numeric: false, disablePadding: false, label: 'Preço 3' },
  { id: 'locavel', numeric: false, disablePadding: false, label: 'Locável' },
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

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();

  return (
    <Toolbar>
      <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
        Produtos
      </Typography>
    </Toolbar>
  );
};

export default function ProductsTable({ products, stock }) {
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [units, setUnits] = useState([]);
  const [fabricators, setFabricators] = useState([]);
  const [providers, setProviders] = useState([]);

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

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/units');
        setUnits(data);
      } catch (err) {
        const { data, status } = err.response;
        console.error(data.detail, status);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/fabricator');
        setFabricators(data);
      } catch (err) {
        const { data } = err.response;
        console.error(data.detail);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/persons/providers');
        setProviders(data);
      } catch (err) {
        const { data } = err.response;
        console.error(data.detail);
      }
    })();
  }, []);

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, products.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
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
              {
                products.length === 0 && (
                  <TableRow>
                    <TableCell colSpan="12" align="center">
                      Nenhum registro foi encontrado.
                    </TableCell>
                  </TableRow>
                )
              }
              {stableSort(products, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={product.codprod}
                    >
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {product.codprod}
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {product.descres}
                      </TableCell>
                      <TableCell align="right">
                        {
                          units.map((unit) => {
                            if (unit.id === product.und) {
                              return unit.und;
                            }
                          })
                        }
                      </TableCell>
                      <TableCell align="right">{product.codbarra}</TableCell>
                      <TableCell align="left">
                        {
                          providers.map((provider) => {
                            if (provider.id_pessoa_cod === product.forn) {
                              return provider.nomeorrazaosocial;
                            }
                          })
                        }
                      </TableCell>
                      <TableCell align="left">
                        {
                          fabricators.map(fabricator => {
                            if (fabricator.id === product.fabr) {
                              return fabricator.marca;
                            }
                          })
                        }
                      </TableCell>
                      <TableCell align="left">
                        {
                          stock.map(item => {
                            if (item.id_produtos === product.id) {
                              return item.est_frente;
                            }
                          })
                        }
                      </TableCell>
                      <TableCell align="left">
                        {
                          stock.map(item => {
                            if (item.id_produtos === product.id) {
                              return item.prvenda1.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                            }
                          })
                        }
                      </TableCell>
                      <TableCell align="left">
                        {
                          stock.map(item => {
                            if (item.id_produtos === product.id) {
                              return item.prvenda2.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                            }
                          })
                        }
                      </TableCell>
                      <TableCell align="left">
                        {
                          stock.map(item => {
                            if (item.id_produtos === product.id) {
                              return item.prvenda3.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                            }
                          })
                        }
                      </TableCell>
                      <TableCell align="left">
                        {
                          stock.map(item => {
                            if (item.id_produtos === product.id) {
                              if (item.locavel === 2) {
                                return 'Sim';
                              } else {
                                return 'Não';
                              }
                            }
                          })
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
          rowsPerPageOptions={[5, 10, 15, 25]}
          component="div"
          count={products.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
