import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Badge
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Title from '../Title';

import api from '../../services/api';

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  link: {
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  }
}));

export default function CardPhysicalPerson() {
  const classes = useStyles();
  const [physicalPersons, setPhysicalPersons] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/persons/physical/last/');
        setPhysicalPersons(data);
      } catch (err) {
        const { data } = err.response;
        console.error(data.detail);
      }
    })();
  }, []);

  return (
    <React.Fragment>
      <Title>Últimas pessoas física cadastradas</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>CPF</TableCell>
            <TableCell>Nome</TableCell>
            <TableCell align="center">Fornecedor</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {physicalPersons.map((person) => (
            <TableRow key={person.id_pessoa_cod}>
              <TableCell>{person.cpfcnpj}</TableCell>
              <TableCell>{person.nomeorrazaosocial}</TableCell>
              <TableCell align="center">
                {
                  person.forn === 1 ? (
                    <Badge color="primary" badgeContent="Sim" overlap="rectangle" />
                  ) : (
                    <Badge color="secondary" badgeContent="Não" overlap="rectangle" />
                  )
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" to="/physical/persons" className={classes.link}>
          Ver mais
        </Link>
      </div>
    </React.Fragment>
  );
}
