import React, { useState, useContext, useEffect } from 'react';
import clsx from 'clsx';
import { ToastContainer, toast } from 'react-toastify';
import {
  CssBaseline,
  Box,
  Container,
  Grid,
  Paper,
  FormControl,
  OutlinedInput,
  Tooltip,
  InputAdornment,
  IconButton,
  InputLabel,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,

} from '@material-ui/core';
import {
  Search as SearchIcon,
  Close as CloseIcon
} from '@material-ui/icons';
import Skeleton from '@material-ui/lab/Skeleton';

import CardProviders from '../../components/CardProviders';
import CardTotalUsers from '../../components/CardTotalUsers';
import CardPhysicalPerson from '../../components/CardPhysicalPerson';
import Copyright from '../../components/Copyright';
import Menus from '../../components/Menus';
import useStyles from './styles';
import api from '../../services/api';
import { Context } from '../../Context/AuthContext';
import ProductsTable from './ProductsTable';

import '../../global/global.css';
import 'react-toastify/dist/ReactToastify.css';

export default function Dashboard() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const { handleLogout } = useContext(Context);
  const [productName, setProductName] = useState('');
  const [products, setProducts] = useState([]);
  const [stock, setStock] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [userPermissions, setUserPermissions] = useState([]);

  async function handleSearchProducts(e) {
    e.preventDefault();
    handleClickOpen();

    try {
      const { data } = await api.get(`/products/${productName}`);
      setProducts(data.produtos);
      setStock(data.estoque);
      // console.table(data);
    } catch (err) {
      const { data, status } = err.response;
      toast.error(`${data.detail}`);
      if (status === 401) {
        setTimeout(() => {
          handleLogout();
        }, 4000);
      }
    }
  }

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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setProductName('');
    setProducts([]);
    setStock([]);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <ToastContainer />
      {/* TOP MENU */}
      <Menus title="Dashboard" />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid
              item
              xs={12}
              xl={12}
              md={12}
              sm={12}
              lg={12}
            >
              <>
                <Typography variant="h4" color="textSecondary">
                  Olá, {JSON.parse(localStorage.getItem('user')).first_name}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  Este é seu dashboard, ele é construído de acordo com suas permissões no sistema.
                </Typography>
              </>
            </Grid>
            <Grid
              item
              xs={5}
              xl={5}
              md={5}
              sm={5}
              lg={5}
            >
              {
                userPermissions.length !== 0 ? (
                  <div>
                    {
                      userPermissions[109] === '1' && (
                        <Paper>
                          <form onSubmit={(e) => handleSearchProducts(e)}>
                            <FormControl variant="outlined" fullWidth size="small" >
                              <InputLabel>Pesquisa rápida de produtos</InputLabel>
                              <OutlinedInput
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                fullWidth
                                label="Pesquisa rápida de produtos"
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
                        </Paper>
                      )
                    }
                  </div>
                ) : (
                  <Skeleton variant="rect" width="100%" height={40} />
                )
              }
            </Grid>
          </Grid>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              xs={9}
              xl={9}
              md={9}
              sm={9}
              lg={9}
            >
              {/* CardProviders */}
              {
                userPermissions.length !== 0 ? (
                  <div>
                    {
                      userPermissions[40] === '1' && (
                        <Paper className={fixedHeightPaper}>
                          <CardProviders />
                        </Paper>
                      )
                    }
                  </div>
                ) : (
                  <Skeleton width="100%" height={200} />
                )
              }

            </Grid>
            <Grid
              item
              xs={3}
              xl={3}
              md={3}
              sm={3}
              lg={3}
            >
              {/* CardTotalUsers */}
              {
                userPermissions.length !== 0 ? (
                  <div>
                    {
                      userPermissions[49] === '1' && (
                        <Paper className={fixedHeightPaper}>
                          <CardTotalUsers />
                        </Paper>
                      )
                    }
                  </div>
                ) : (
                  <Skeleton width="100%" height={200} />
                )
              }
            </Grid>
            <Grid
              item
              xs={12}
              xl={12}
              md={12}
              sm={12}
              lg={12}
            >
              {/* CardPhysicalPerson */}
              {
                userPermissions.length !== 0 ? (
                  <div>
                    {
                      userPermissions[39] === '1' && (
                        <Paper className={classes.paper}>
                          <CardPhysicalPerson />
                        </Paper>
                      )
                    }
                  </div>
                ) : (
                  <Skeleton width="100%" height={200} />
                )
              }
            </Grid>
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>

      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        maxWidth="xl"
        fullWidth
      >
        <DialogTitle>
          Resultado da pesquisa: {productName}
          <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <ProductsTable products={products} stock={stock} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
