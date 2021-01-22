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
  buttonSuccessAddress: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonProgressAddress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  buttonErrorAddress: {
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[800],
    },
  },
  buttonProgressRemoveAddress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  buttonErrorRemoveAddress: {
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[800],
    },
  },
  buttonSuccessPhone: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonProgressPhone: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  buttonErrorPhone: {
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[800],
    },
  },
  buttonSuccessRemovePhone: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonProgressRemovePhone: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  buttonErrorRemovePhone: {
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[800],
    },
  },
  buttonSuccessMail: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonProgressMail: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  buttonErrorMail: {
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[800],
    },
  },
  buttonSuccessRemoveMail: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonProgressRemoveMail: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  buttonErrorRemoveMail: {
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[800],
    },
  },
  buttonSuccessReference: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonProgressReference: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  buttonErrorReference: {
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[800],
    },
  },
  buttonSuccessRemoveReference: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonProgressRemoveReference: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  buttonErrorRemoveReference: {
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[800],
    },
  },
  buttonSuccessBankingReference: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonProgressBankingReference: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  buttonErrorBankingReference: {
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[800],
    },
  },
  buttonSuccessRemoveBankingReference: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonProgressRemoveBankingReference: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  buttonErrorRemoveBankingReference: {
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[800],
    },
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
  inputList: {
    marginTop: theme.spacing(2)
  },
  divFooter: {
    position: 'absolute',
    bottom: 0
  }
}));

export default useStyles;
