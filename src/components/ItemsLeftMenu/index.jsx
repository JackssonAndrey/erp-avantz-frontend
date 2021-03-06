import React from 'react';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Divider,
  ListSubheader
} from '@material-ui/core';
// import ListSubheader from '@material-ui/core/ListSubheader';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Person,
  Business as BusinessIcon,
  Store as StoreIcon
  // ShoppingCart as ShoppingCartIcon,
  // BarChart as BarChartIcon,
  // Layers as LayersIcon
} from '@material-ui/icons';
// import AssignmentIcon from '@material-ui/icons/Assignment';
import { Link } from 'react-router-dom';

import '../../global/global.css';

export default function mainListItems({ access, menuOpen, isSuperuser }) {
  return (
    <div>
      <Link to="/dashboard" className="link">
        <Tooltip title="Início" arrow disableHoverListener={menuOpen && true}>
          <ListItem button>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
        </Tooltip>
      </Link>
      {
        access[96] === '1'
        && (
          <Link to="/users" className="link">
            <Tooltip title="Usuários" arrow disableHoverListener={menuOpen && true}>
              <ListItem button>
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Usuários" />
              </ListItem>
            </Tooltip>
          </Link>
        )
      }
      {
        access[39] === '1'
        && (
          <Link to="/legal/persons" className="link">
            <Tooltip title="Pessoa Jurídica" arrow disableHoverListener={menuOpen && true}>
              <ListItem button>
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText primary="Pessoa Jurídica" />
              </ListItem>
            </Tooltip>
          </Link>
        )
      }
      {
        access[40] === '1'
        && (
          <Link to="/physical/persons" className="link">
            <Tooltip title="Pessoa Física" arrow disableHoverListener={menuOpen && true}>
              <ListItem button>
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText primary="Pessoa Física" />
              </ListItem>
            </Tooltip>
          </Link>
        )
      }
      {
        access[40] === '1'
        && (
          <Link to="/products" className="link">
            <Tooltip title="Produtos" arrow disableHoverListener={menuOpen && true}>
              <ListItem button>
                <ListItemIcon>
                  <StoreIcon />
                </ListItemIcon>
                <ListItemText primary="Produtos" />
              </ListItem>
            </Tooltip>
          </Link>
        )
      }
      {
        isSuperuser && (
          <>
            <Divider />
            <ListSubheader inset>Admin</ListSubheader>
            <Link to="/institutions" className="link">
              <Tooltip title="Instituições" arrow disableHoverListener={menuOpen && true}>
                <ListItem button>
                  <ListItemIcon>
                    <BusinessIcon />
                  </ListItemIcon>
                  <ListItemText primary="Instituições" />
                </ListItem>
              </Tooltip>
            </Link>
          </>
        )
      }
      {/* <ListItem button>
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Orders" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Reports" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Integrations" />
      </ListItem> */}
    </div>
  );
}

// export const secondaryListItems = (
//   <div>
//     <ListSubheader inset>Saved reports</ListSubheader>
//     <ListItem button>
//       <ListItemIcon>
//         <AssignmentIcon />
//       </ListItemIcon>
//       <ListItemText primary="Current month" />
//     </ListItem>
//     <ListItem button>
//       <ListItemIcon>
//         <AssignmentIcon />
//       </ListItemIcon>
//       <ListItemText primary="Last quarter" />
//     </ListItem>
//     <ListItem button>
//       <ListItemIcon>
//         <AssignmentIcon />
//       </ListItemIcon>
//       <ListItemText primary="Year-end sale" />
//     </ListItem>
//   </div>
// );
