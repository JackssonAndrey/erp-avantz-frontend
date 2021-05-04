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
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Box,
  Card,
  CardContent,
  InputAdornment,
  Grid,
  FormControl,
  InputLabel,
  OutlinedInput
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
  { id: 'is_active', numeric: false, disablePadding: true, label: 'Ativo' },
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

  const [loadingDisableUser, setLoadingDisableUser] = useState(false);
  const [successDisableUser, setSuccessDisableUser] = useState(false);
  const [errorDisableUser, setErrorDisableUser] = useState(false);
  const [defaultButtonDisableUser, setDefaultButtonDisableUser] = useState(false);

  const [loadingModalGroup, setLoadingModalGroup] = useState(false);
  const [successModalGroup, setSuccessModalGroup] = useState(false);
  const [errorModalGroup, setErrorModalGroup] = useState(false);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('first_name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [openModalDeleteGroup, setOpenModalDeleteGroup] = useState(false);
  const [open, setOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState(0);
  const [userSearch, setUserSearch] = useState('');
  const [userPermissions, setUserPermissions] = useState([]);

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
    [classes.buttonError]: error,
    [classes.buttonDefault]: defaultButton
  });

  const buttonClassNameModalGroup = clsx({
    [classes.buttonSuccess]: successModalGroup,
    [classes.buttonError]: errorModalGroup,
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
    setUserId(id);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setUserId(0);
    setOpenModal(false);
  };

  const handleClickOpenModalGroup = (id) => {
    setGroupId(id);
    setOpenModalDeleteGroup(true);
  };

  const handleCloseModalDeleteGroup = () => {
    setGroupId(0);
    setOpenModalDeleteGroup(false);
  };

  function handleClickOpen() {
    setOpen(true);
  };

  function handleClose() {
    setOpen(false);
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
    const csrfToken = getCookie('csrftoken');

    api.get('/groups/', {
      headers: {
        'X-CSRFToken': csrfToken
      }
    }).then(response => {
      setGroups(response.data);
    }).catch(reject => {
      const { data } = reject.response;
      toast.error(`${data.detail}`);
      setTimeout(() => {
        handleLogout();
      }, 5000);
      console.log(data);
    });
  }, [groupId, handleLogout]);

  function handleDetailGroup(id) {
    history.push(`/groups/details/${id}`);
  }

  function handleEditGroup(id) {
    history.push(`/groups/edit/${id}`);
  }

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

  async function handleDisableUser(id) {
    const csrftoken = getCookie('csrftoken');

    try {
      const { data } = await api.put(`/users/disable/${id}`, { userId }, {
        headers: {
          'X-CSRFToken': csrftoken
        }
      });
      handleButtonDisableUserProgress();
      setTimeout(() => {
        toast.success('Usuário desabilitado com sucesso!');
      }, 2000);
      setUsers(data);
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

  async function handleDeleteUser(id) {
    const csrftoken = getCookie('csrftoken');

    try {
      const { data } = await api.put(`/users/delete/${id}`, { userId }, {
        headers: {
          'X-CSRFToken': csrftoken
        }
      });
      handleButtonClickProgress();
      setTimeout(() => {
        toast.success('Usuário deletado com sucesso!');
      }, 2000);
      setUsers(data);
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

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, users.length - page * rowsPerPage);

  async function handleSearchUser(e) {
    e.preventDefault();
    const csrftoken = getCookie('csrftoken');

    try {
      if (userSearch !== '') {
        const { data } = await api.get(`/users/list/${userSearch}`, {
          headers: {
            'X-CSRFToken': csrftoken
          }
        });
        setUsers(data.users);
      } else {
        const { data } = await api.get(`/users/list`, {
          headers: {
            'X-CSRFToken': csrftoken
          }
        });
        setUsers(data.users);
      }
    } catch (err) {
      const { data } = err.response;
      toast.error(`${data.detail}`);
    }
  }

  async function handleDeleteGroupUser(id) {
    const csrftoken = getCookie('csrftoken');

    try {
      await api.delete(`/groups/delete/${id}`, {
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
              <form onSubmit={(e) => handleSearchUser(e)}>
                <FormControl variant="outlined" fullWidth size="small" >
                  <InputLabel>Pesquisar</InputLabel>
                  <OutlinedInput
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    fullWidth
                    label="Pesquisar"
                    name="searchPerson"
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
                {
                  userPermissions[11] === '1' && (
                    <Button
                      className={classes.groupButton}
                      onClick={handleClickOpen}
                      color="default"
                      variant="contained"
                    >
                      Grupos
                    </Button>
                  )
                }
                {
                  userPermissions[14] === '1' && (
                    <Link to="/users/register" className="link" >
                      <Button
                        color="primary"
                        variant="contained"
                      >
                        Adicionar usuário
                      </Button>
                    </Link>
                  )
                }
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>


      {/* MODAL GROUPS */}
      <Dialog open={open} onClose={handleClose} className={classes.groupModal} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          <Typography variant="h6" >Grupos de usuários</Typography>
          <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Paper className={classes.paper}>
            <Box
              display="flex"
              justifyContent="flex-end"
            >
              <Link to="/groups/register" className="link" >
                <Button
                  color="primary"
                  variant="contained"
                >
                  Adicionar grupo
                </Button>
              </Link>
            </Box>
            <Box>
              <List className={classes.listGroup}>
                {
                  groups.map((group) => (
                    <ListItem key={group.id_grupo} button onClick={() => handleDetailGroup(group.id_grupo)}>
                      <ListItemText>
                        {group.grupo}
                      </ListItemText>
                      <ListItemSecondaryAction>
                        <Tooltip title="Editar">
                          <IconButton edge="end" onClick={() => handleEditGroup(group.id_grupo)} aria-label="edit">
                            <EditIcon size={8} style={{ color: orange[300] }} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Deletar">
                          <IconButton edge="end" aria-label="delete" onClick={() => handleClickOpenModalGroup(group.id_grupo)}>
                            <DeleteIcon size={8} style={{ color: red[300] }} />
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))
                }
              </List>
            </Box>
          </Paper>
        </DialogContent>
      </Dialog>

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
                      <TableCell padding="none" align="left">
                        {
                          user.is_active === true ? (
                            <Badge color="primary" badgeContent="Sim" overlap="rectangle" />
                          ) : (
                            <Badge color="secondary" badgeContent="Não" overlap="rectangle" />
                          )
                        }
                      </TableCell>
                      <TableCell padding="default" align="right">
                        {
                          userPermissions[131] === '1' && (
                            <Tooltip title="Editar">
                              <IconButton onClick={() => handleEditUser(user.id)} aria-label="Editar">
                                <EditIcon size={8} style={{ color: orange[300] }} />
                              </IconButton>
                            </Tooltip>
                          )
                        }
                        {
                          userPermissions[133] === '1' && (
                            <Tooltip title="Detalhes">
                              <IconButton onClick={() => handleDetailsUser(user.id)} aria-label="Detalhes">
                                <DetailIcon size={8} style={{ color: lightBlue[300] }} />
                              </IconButton>
                            </Tooltip>
                          )
                        }
                        {
                          userPermissions[132] === '1' && (
                            <Tooltip title="Deletar">
                              <IconButton onClick={() => handleClickOpenModal(user.id)} aria-label="Deletar">
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
          count={users.length}
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
          Deletar usuário
          <IconButton aria-label="close" className={classes.closeButton} onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.modalContent} dividers>
          <div className={classes.divIconModal}>
            <DeleteForeverIcon className={classes.modalIcon} />
          </div>
          <DialogContentText variant="h6" id="alert-dialog-description" className={classes.modalContentText}>
            Você realmente deseja deletar este usuário? Esta operação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleDisableUser(userId)}
            color="primary"
            className={buttonClassNameDisableUser}
            disabled={loadingDisableUser}
            variant="contained"
          >
            Apenas desativar
            {loadingDisableUser && <CircularProgress size={24} className={classes.buttonProgress} />}
          </Button>

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
      {/* MODAL DELETE GROUP */}
      <Dialog
        open={openModalDeleteGroup}
        onClose={handleCloseModalDeleteGroup}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Deletar grupo de usuário
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
            onClick={() => handleDeleteGroupUser(groupId)}
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
    </div>
  );
}
