import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Title from '../Title';

import api from '../../services/api';

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
  link: {
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  }
});

export default function CardTotalUsers() {
  const classes = useStyles();
  const [countUsers, setCountUsers] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/users/list');
        setCountUsers(data.users.length);
      } catch (err) {
        const { data } = err.response;
        console.error(data.detail);
      }
    })();
  }, []);

  return (
    <React.Fragment>
      <Title>Usuários ativos na instituição</Title>
      <Typography component="p" variant="h3">
        {countUsers}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        usuários
      </Typography>
      <div>
        <Link color="primary" to="/users" className={classes.link}>
          Ver usuários
        </Link>
      </div>
    </React.Fragment>
  );
}
