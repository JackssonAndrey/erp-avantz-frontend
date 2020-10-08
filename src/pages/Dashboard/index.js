import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import { Context } from '../../Context/AuthContext';

export default function Dashboard() {
  const { handleLogout } = useContext(Context);
  return (
    <Button
      type="submit"
      variant="contained"
      color="primary"
      onClick={handleLogout}
    >Sair</Button>
  );
}
