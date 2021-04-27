import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import {
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  MoreVert as MoreVertIcon,
  ExitToApp as ExitToAppIcon,
  Person as PersonIcon,
  Settings as SettingsIcons
} from '@material-ui/icons';
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogContentText,
  DialogTitle,
  Fade,
  MenuItem,
  Menu,
  Typography,
  Badge,
  Toolbar,
  AppBar,
  Divider,
  List,
  IconButton,
  Drawer
} from '@material-ui/core';

import MainListItems from '../ItemsLeftMenu';
import { Context } from '../../Context/AuthContext';
import useStyles from './styles';

import '../../global/global.css';

export default function Menus(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { handleLogout } = useContext(Context);
  const [anchorEl, setAnchorEl] = useState(null);
  const [accessUser, setAccessUser] = useState('');

  const handleDrawerClick = () => {
    open ? setOpen(false) : setOpen(true)
  }
  const openMenu = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggleModal = () => {
    openModal ? setOpenModal(false) : setOpenModal(true)
  };

  useEffect(() => {
    const { acess } = JSON.parse(localStorage.getItem('user'));
    setAccessUser(acess);
  }, []);

  return (
    <>
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerClick}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            {props.title}
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" onClick={handleClick} >
            <MoreVertIcon />
          </IconButton>

          <Menu
            id="fade-menu"
            anchorEl={anchorEl}
            keepMounted
            open={openMenu}
            onClose={handleClose}
            TransitionComponent={Fade}
          >
            <Link to="/profile" className="link">
              <MenuItem onClick={handleClose}>
                <PersonIcon className={classes.iconMenuTop} /> Perfil
              </MenuItem>
            </Link>
            <Link to="/settings" className="link">
              <MenuItem onClick={handleClose}>
                <SettingsIcons className={classes.iconMenuTop} /> Configurações
              </MenuItem>
            </Link>
            <MenuItem onClick={handleToggleModal}>
              <ExitToAppIcon className={classes.iconMenuTop} /> Logout
            </MenuItem>

          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClick}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <MainListItems access={accessUser} menuOpen={open} />
        </List>
        <Divider />
        {/* <List>{secondaryListItems}</List> */}
      </Drawer>
      <Dialog
        open={openModal}
        onClose={handleToggleModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Sair do sistema"}</DialogTitle>
        <Divider />
        <DialogContent className={classes.modalContent}>
          <div className={classes.divIconModal}>
            <ExitToAppIcon className={classes.modalIcon} />
          </div>
          <DialogContentText id="alert-dialog-description">
            Você realmente deseja sair do sistema?
          </DialogContentText>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={handleToggleModal} color="secondary" variant="outlined">
            Cancelar
          </Button>
          <Button onClick={handleLogout} color="primary" autoFocus variant="contained">
            Sair
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
