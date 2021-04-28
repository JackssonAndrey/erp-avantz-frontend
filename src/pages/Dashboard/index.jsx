import React, { useState, useContext } from 'react';
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
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import {
  Search as SearchIcon,
  Close as CloseIcon
} from '@material-ui/icons';

import Chart from '../../components/Chart';
import Deposits from '../../components/Deposits';
import Orders from '../../components/Orders';
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
  const [open, setOpen] = React.useState(false);

  async function handleSearchProducts(e) {
    e.preventDefault();
    handleClickOpen();

    try {
      const { data } = await api.get(`/products/${productName}`);
      setProducts(data);
      console.table(data);
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
              xs={5}
              xl={5}
              md={5}
              sm={5}
              lg={5}
            >
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
            </Grid>
            {/* Chart */}
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={fixedHeightPaper}>
                <Chart />
              </Paper>
            </Grid>
            {/* Recent Deposits */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <Deposits />
              </Paper>
            </Grid>
            {/* Recent Orders */}
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Orders />
              </Paper>
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
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Resultado da pesquisa: {productName}
          <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <ProductsTable products={products} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
