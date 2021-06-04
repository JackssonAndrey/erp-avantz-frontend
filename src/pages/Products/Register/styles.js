import { makeStyles } from '@material-ui/core/styles';
import { green, grey, red } from '@material-ui/core/colors';


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
  formControl: {
    width: '100%'
  },
  divider: {
    margin: '20px'
  },
  dividerVertical: {
    margin: 'auto'
  },
  title: {
    color: grey[700]
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
  },
  containerImage: {
    width: '100%',
    border: '1px dashed',
    borderColor: grey[700],
    borderRadius: '4px',
    cursor: 'pointer',
    padding: '20px',
    color: grey[700],
    textAlign: 'center'
  },
  groupButton: {
    marginRight: theme.spacing(2)
  },
}));

export default useStyles;
