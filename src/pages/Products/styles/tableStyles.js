import { lighten, makeStyles } from '@material-ui/core/styles';
import { red, blue, green } from '@material-ui/core/colors';

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

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  buttonSuccess: {
    backgroundColor: green[500],
    color: '#FFF',
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonError: {
    backgroundColor: red[500],
    color: '#FFF',
    '&:hover': {
      backgroundColor: red[700],
    },
  },
  buttonProgress: {
    color: blue[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  buttonDefault: {
    background: '#3f51b5',
    color: '#FFF',
    '&:hover': {
      backgroundColor: '#002984'
    }
  },
  buttonDefaultSecondary: {
    background: '#f44336',
    color: '#FFF',
    '&:hover': {
      backgroundColor: '#ba000d'
    }
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(3),
    alignItems: 'center',
    justifyContent: 'center',
    width: '450px'
  },
  modalIcon: {
    fontSize: '6rem',
    color: red[300],
    margin: 'auto'
  },
  divIconModal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  modalContentText: {
    textAlign: 'center'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  groupModal: {
    padding: theme.spacing(2)
  },
  listGroup: {
    width: '400px'
  },
  groupButton: {
    marginRight: theme.spacing(2)
  },
  formControl: {
    width: '100%'
  }
}));

export { useToolbarStyles, useStyles };
