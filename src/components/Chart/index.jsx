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

export default function Chart() {
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
      <Title>Últimos fornecedores cadastrados</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>CNPJ</TableCell>
            <TableCell>Razão Social</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {physicalPersons.map((person) => (
            <TableRow key={person.id_pessoa_cod}>
              <TableCell>{person.cpfcnpj}</TableCell>
              <TableCell>{person.nomeorrazaosocial}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" to="/legal/persons" className={classes.link}>
          Ver mais
        </Link>
      </div>
    </React.Fragment>
  );
}
