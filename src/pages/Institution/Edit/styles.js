import { makeStyles } from '@material-ui/core/styles';
import { green, red } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  rootForm: {},
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    alignItems: 'center'
  },
  input: {
    display: 'none',
  },
  large: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    marginBottom: theme.spacing(4)
  },
  form: {
    width: '100%',
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center'
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  buttonError: {
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[800],
    },
  },
  buttonDefault: {
    background: '#f44336',
    color: '#FFF',
    '&:hover': {
      backgroundColor: '#ba000d'
    }
  },
  cardContent: {
    marginTop: theme.spacing(3)
  },
  avatarLarge: {
    width: theme.spacing(10),
    height: theme.spacing(10)
  },
  tabArea: {
    marginTop: theme.spacing(3),
    boxShadow: '0 3px 3px #9e9e9e',
    minHeight: '400px',
    backgroundColor: '#FFF'
  },
  appBar: {
    backgroundColor: '#FFF'
  },
  containerInput: {
  },
  formControl: {
    width: '100%'
  },
  divider: {
    marginTop: '20px'
  },
  dividerVertical: {
    margin: 'auto'
  },
  buttonDefault: {
    background: '#3f51b5',
    color: '#FFF',
    '&:hover': {
      backgroundColor: '#002984'
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
  }
}));

export default useStyles;
