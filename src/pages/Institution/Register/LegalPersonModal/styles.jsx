import { makeStyles } from '@material-ui/core/styles';
import { green, red, grey } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  rootForm: {},
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    overflow: 'auto',
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
    background: '#3f51b5',
    color: '#FFF',
    '&:hover': {
      backgroundColor: '#002984'
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
  inputList: {
    marginTop: theme.spacing(2)
  },
  divFooter: {
    position: 'absolute',
    bottom: 0
  },
  divider: {
    margin: '20px'
  },
  dividerVertical: {
    margin: 'auto'
  },
  title: {
    color: grey[700]
  }
}));

export default useStyles;
