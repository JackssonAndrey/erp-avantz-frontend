import React, { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { red } from '@material-ui/core/colors';
import {
  Box, Container, CssBaseline, Card, CardContent, IconButton, Grid, TextField, AppBar, Tabs, Tab, Typography, CircularProgress,
  Divider, Button, Tooltip, Dialog, DialogContent, DialogActions, DialogTitle, Select, MenuItem, FormControl,
  InputLabel, OutlinedInput, InputAdornment, FormHelperText
} from '@material-ui/core';
import { ArrowBack, Delete } from '@material-ui/icons';
import PropTypes from 'prop-types';
import moment from 'moment';
import InputMask from 'react-input-mask';
import cep from 'cep-promise';

import Menus from '../../../components/Menus';
import Copyright from '../../../components/Copyright';
import api from '../../../services/api';
import history from '../../../services/history';
import getCookie from '../../../utils/functions';
import useStyles from './styles';

import 'react-toastify/dist/ReactToastify.css';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3} bgcolor="white" borderTop="1px solid #c7c7c7" >
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const initialStatePerson = {
  "id_pessoa_cod": 0,
  "id_instituicao_fk": 0,
  "tipo": 0,
  "sit": 0,
  "forn": 0,
  "cpfcnpj": "",
  "nomeorrazaosocial": "",
  "foto": "",
  "img_bites": 0,
  "limite": "0",
  "saldo": "0"
}

const initialStateLegalPerson = {
  "id_pessoa_cod_fk": 0,
  "fantasia": "",
  "ramo": "",
  "inscricao_estadual": "",
  "inscricao_municipal": "",
  "tipo_empresa": "",
  "capsocial": "0",
  "faturamento": "0",
  "tribut": 0,
  "contato": "",
  "data_abertura": "",
  "data_criacao": ""
}

const initialStateAdress = {
  origin: 1,
  street: "",
  numberHouse: "",
  complement: "",
  neighborhood: "",
  zipCode: "",
  city: "",
  state: ""
}

const initialStateReference = {
  "idPerson": 0,
  "referenceSituation": 1,
  "referenceType": "",
  "referenceName": "",
  "referencePhone": "",
  "referenceAdress": ""
}

const initialStateBankingReference = {
  idPerson: 0,
  idBanking: 0,
  situation: 1,
  agency: "",
  account: "",
  opening: moment().format('YYYY-MM-DD'),
  type: ""
}

export default function EditLegalPerson(props) {
  const classes = useStyles();
  const timer = useRef();
  const idPerson = props.match.params.id;

  // SUCCESS AND ERRORS BUTTONS STATES
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const [loadingAddress, setLoadingAddress] = useState(false);
  const [successAddress, setSuccessAddress] = useState(false);
  const [errorAddress, setErrorAddress] = useState(false);
  const [loadingRemoveAddress, setLoadingRemoveAddress] = useState(false);
  const [successRemoveAddress, setSuccessRemoveAddress] = useState(false);
  const [errorRemoveAddress, setErrorRemoveAddress] = useState(false);
  const [defaultButtonAddress, setDefaultButtonAddress] = useState(true);

  const [loadingPhone, setLoadingPhone] = useState(false);
  const [successPhone, setSuccessPhone] = useState(false);
  const [errorPhone, setErrorPhone] = useState(false);
  const [defaultButtonPhone, setDefaultButtonPhone] = useState(true);
  const [loadingRemovePhone, setLoadingRemovePhone] = useState(false);
  const [successRemovePhone, setSuccessRemovePhone] = useState(false);
  const [errorRemovePhone, setErrorRemovePhone] = useState(false);

  const [loadingRemoveMail, setLoadingRemoveMail] = useState(false);
  const [successRemoveMail, setSuccessRemoveMail] = useState(false);
  const [errorRemoveMail, setErrorRemoveMail] = useState(false);
  const [loadingMail, setLoadingMail] = useState(false);
  const [successMail, setSuccessMail] = useState(false);
  const [errorMail, setErrorMail] = useState(false);
  const [defaultButtonMail, setDefaultButtonMail] = useState(true);

  const [loadingReference, setLoadingReference] = useState(false);
  const [successReference, setSuccessReference] = useState(false);
  const [errorReference, setErrorReference] = useState(false);
  const [loadingRemoveReference, setLoadingRemoveReference] = useState(false);
  const [successRemoveReference, setSuccessRemoveReference] = useState(false);
  const [errorRemoveReference, setErrorRemoveReference] = useState(false);
  const [defaultButtonReference, setDefaultButtonReference] = useState(true);

  const [loadingBankingReference, setLoadingBankingReference] = useState(false);
  const [successBankingReference, setSuccessBankingReference] = useState(false);
  const [errorBankingReference, setErrorBankingReference] = useState(false);
  const [loadingRemoveBankingReference, setLoadingRemoveBankingReference] = useState(false);
  const [successRemoveBankingReference, setSuccessRemoveBankingReference] = useState(false);
  const [errorRemoveBankingReference, setErrorRemoveBankingReference] = useState(false);
  const [defaultButtonBankingReference, setDefaultButtonBankingReference] = useState(true);

  // PERSON STATE
  const [valueTab, setValueTab] = useState(0);
  const [bankingReferences, setBankingReferences] = useState([{}]);
  const [bankingReferenceId, setBankingReferenceId] = useState(0);
  const [person, setPerson] = useState(initialStatePerson);
  const [personAddress, setPersonAddress] = useState([{}]);
  const [addressId, setAddressId] = useState(0);
  const [personMail, setPersonMail] = useState([{}]);
  const [personMailId, setPersonMailId] = useState(0);
  const [personPhone, setPersonPhone] = useState([{}]);
  const [phoneId, setPhoneId] = useState(0);
  const [legalPerson, setLegalPerson] = useState(initialStateLegalPerson);
  const [personReferences, setPersonReferences] = useState([{}]);
  const [personReferenceId, setPersonReferenceId] = useState(0);
  const [isZipCodeValid, setIsZipCodeValid] = useState(true);
  const [errorMessageZipCode, setErrorMessageZipCode] = useState('');
  const [registeredBanks, setRegisteredBanks] = useState([]);

  // MODALS STATES
  const [openModalPhone, setOpenModalPhone] = useState(false);
  const [openModalRemovePhone, setOpenModalRemovePhone] = useState(false);
  const [openModalMail, setOpenModalMail] = useState(false);
  const [openModalAddress, setOpenModalAddress] = useState(false);
  const [openModalRemoveAddress, setOpenModalRemoveAddress] = useState(false);
  const [openModalRemoveMail, setOpenModalRemoveMail] = useState(false);
  const [openModalReference, setOpenModalReference] = useState(false);
  const [openModalRemoveReference, setOpenModalRemoveReference] = useState(false);
  const [openModalBankingReference, setOpenModalBankingReference] = useState(false);
  const [openModalRemoveBankingReference, setOpenModalRemoveBankingReference] = useState(false);

  // REGISTER STATE
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mail, setMail] = useState('');
  const [address, setAddress] = useState(initialStateAdress);
  const [reference, setReference] = useState(initialStateReference);
  const [banking, setBanking] = useState(initialStateBankingReference);

  const handleClickOpenModalPhone = () => {
    setOpenModalPhone(true);
  };

  const handleCloseModalPhone = () => {
    setOpenModalPhone(false);
    setPhoneNumber('');
    setDefaultButtonPhone(true);
  };

  const handleClickOpenModalRemovePhone = (id) => {
    setOpenModalRemovePhone(true);
    setPhoneId(id);
  };

  const handleCloseModaRemovePhone = () => {
    setOpenModalRemovePhone(false);
    setDefaultButtonPhone(true);
  };

  const handleClickOpenModalRemoveMail = (id) => {
    setOpenModalRemoveMail(true);
    setPersonMailId(id);
  };

  const handleCloseModalRemoveMail = () => {
    setOpenModalRemoveMail(false);
    setDefaultButtonMail(true);
  };

  const handleClickOpenModalRemoveReference = (id) => {
    setOpenModalRemoveReference(true);
    setPersonReferenceId(id);
  };

  const handleCloseModalRemoveReference = () => {
    setOpenModalRemoveReference(false);
    setDefaultButtonReference(true);
  };

  const handleClickOpenModalRemoveBankingReference = (id) => {
    setOpenModalRemoveBankingReference(true);
    setBankingReferenceId(id);
  };

  const handleCloseModalRemoveBankingReference = () => {
    setOpenModalRemoveBankingReference(false);
    setDefaultButtonReference(true);
  };

  const handleClickOpenModalMail = () => {
    setOpenModalMail(true);
  };

  const handleCloseModalMail = () => {
    setOpenModalMail(false);
    setMail('');
    setDefaultButtonMail(true);
  };

  const handleClickOpenModalBankingReference = () => {
    setOpenModalBankingReference(true);
  };

  const handleCloseModalBankingReference = () => {
    setOpenModalBankingReference(false);
    setDefaultButtonBankingReference(true);
  };

  const handleClickOpenModalAddress = () => {
    setOpenModalAddress(true);
  };

  const handleCloseModalAddress = () => {
    setOpenModalAddress(false);
    setDefaultButtonAddress(true);
  };

  const handleClickOpenModalRemoveAddress = (id) => {
    setOpenModalRemoveAddress(true);
    setAddressId(id);
  };

  const handleCloseModalRemoveAddress = () => {
    setOpenModalRemoveAddress(false);
    setDefaultButtonAddress(true);
  };

  const handleClickOpenModalReference = () => {
    setOpenModalReference(true);
  };

  const handleCloseModalReference = () => {
    setOpenModalReference(false);
  };

  const handleChangeTab = (event, newValue) => {
    setValueTab(newValue);
  };

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
    [classes.buttonError]: error,
  });

  const buttonClassnameAddress = clsx({
    [classes.buttonSuccessAddress]: successAddress,
    [classes.buttonErrorAddress]: errorAddress,
    [classes.buttonDefault]: defaultButtonAddress
  });

  const buttonClassnameRemoveAddress = clsx({
    [classes.buttonSuccessRemoveAddress]: successRemoveAddress,
    [classes.buttonErrorRemoveAddress]: errorRemoveAddress,
    [classes.buttonDefault]: defaultButtonAddress
  });

  const buttonClassnameRemoveMail = clsx({
    [classes.buttonSuccessRemoveMail]: successRemoveMail,
    [classes.buttonErrorRemoveMail]: errorRemoveMail,
    [classes.buttonDefault]: defaultButtonMail
  });

  const buttonClassnameRemoveReference = clsx({
    [classes.buttonSuccessRemoveReference]: successRemoveReference,
    [classes.buttonErrorRemoveReference]: errorRemoveReference,
    [classes.buttonDefault]: defaultButtonReference
  });

  const buttonClassnamePhone = clsx({
    [classes.buttonSuccessPhone]: successPhone,
    [classes.buttonErrorPhone]: errorPhone,
    [classes.buttonDefault]: defaultButtonPhone
  });

  const buttonClassnameRemovePhone = clsx({
    [classes.buttonSuccessRemovePhone]: successRemovePhone,
    [classes.buttonErrorRemovePhone]: errorRemovePhone,
    [classes.buttonDefault]: defaultButtonPhone
  });

  const buttonClassnameMail = clsx({
    [classes.buttonSuccessMail]: successMail,
    [classes.buttonErrorMail]: errorMail,
    [classes.buttonDefault]: defaultButtonMail
  });

  const buttonClassnameReference = clsx({
    [classes.buttonSuccessReference]: successReference,
    [classes.buttonErrorReference]: errorReference,
    [classes.buttonDefault]: defaultButtonReference
  });

  const buttonClassnameBankingReference = clsx({
    [classes.buttonSuccessBankingReference]: successBankingReference,
    [classes.buttonErrorBankingReference]: errorBankingReference,
    [classes.buttonDefault]: defaultButtonBankingReference
  });

  const buttonClassnameRemoveBankingReference = clsx({
    [classes.buttonSuccessRemoveBankingReference]: successRemoveBankingReference,
    [classes.buttonErrorRemoveBankingReference]: errorRemoveBankingReference,
    [classes.buttonDefault]: defaultButtonBankingReference
  });

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    const csrfToken = getCookie('csrftoken');
    api.get(`/persons/legal/details/${idPerson}`, {
      headers: {
        'X-CSRFToken': csrfToken
      }
    }).then(response => {
      const { data } = response;
      setBankingReferences(data.bankingReferences);
      setPerson(data.person);
      setPersonAddress(data.personAdress);
      setPersonMail(data.personMail);
      setPersonPhone(data.personPhone);
      setLegalPerson(data.legalPerson);
      setPersonReferences(data.personReferences);
    }).catch(reject => {
      console.log(reject);
    });
  }, [idPerson]);

  useEffect(() => {
    (async function () {
      try {
        const { data } = await api.get('/banking');
        setRegisteredBanks(data);
      } catch (err) {
        // const { data } = err.response;
        toast.error('Não foi possível selecionar os bancos pré cadastrados.');
        // console.log(data.datail);
      }
    })();
  }, []);

  // FUNCTION FOR THE INPUTS CHANGE
  function handleChangeInputsPerson(e) {
    const { name, value } = e.target;
    setPerson({ ...person, [name]: value });
  }

  function handleChangeInputsLegalPerson(e) {
    const { name, value } = e.target;
    setLegalPerson({ ...legalPerson, [name]: value });
  }

  function handleChangeInputsAddress(e, position) {
    const { name, value } = e.target;
    const updatedPersonAddress = personAddress.map((addressValue, index) => {
      if (index === position) {
        return { ...addressValue, [name]: value }
      }
      return addressValue;
    });
    setPersonAddress(updatedPersonAddress);
  }

  function handleChangeInputsPhone(e, position) {
    const { name, value } = e.target;
    const updatedPersonPhone = personPhone.map((phone, index) => {
      if (index === position) {
        return { ...phone, [name]: value }
      }
      return phone;
    });
    setPersonPhone(updatedPersonPhone);
  }

  function handleChangeInputsMails(e, position) {
    const { name, value } = e.target;
    const updatedPersonMail = personMail.map((mail, index) => {
      if (index === position) {
        return { ...mail, [name]: value }
      }
      return mail;
    });
    setPersonMail(updatedPersonMail);
  }

  function handleChangeInputsReferences(e, position) {
    const { name, value } = e.target;
    const updatedPersonReferences = personReferences.map((reference, index) => {
      if (index === position) {
        return { ...reference, [name]: value }
      }
      return reference;
    });
    setPersonReferences(updatedPersonReferences);
  }

  function handleChangeInputsBankingReferences(e, position) {
    const { name, value } = e.target;
    const updatedBankingReference = bankingReferences.map((banking, index) => {
      if (index === position) {
        return { ...banking, [name]: value }
      }
      return banking;
    });
    setBankingReferences(updatedBankingReference);
  }

  function handleChangeInputsBanking(e) {
    const { name, value } = e.target;
    setBanking({ ...banking, [name]: value });
  }

  function handleChangeReference(e) {
    const { name, value } = e.target;
    setReference({ ...reference, [name]: value });
  }

  function handleChangeAddress(e) {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  }

  // FUNCTIONS FOR THE ADD PERSON DATA
  async function handleAddNewPhone(e) {
    e.preventDefault();
    const csrfToken = getCookie('csrftoken');

    let phones = [
      {
        idPerson: Number(idPerson),
        phoneSituation: 1,
        phoneNumber
      }
    ];

    try {
      const { data } = await api.post(`/phones/create`, { phones }, {
        headers: {
          'X-CSRFToken': csrfToken
        }
      });

      handleButtonClickProgressPhone();
      setTimeout(() => {
        toast.success('Telefone cadastrado com sucesso!');
      }, 2000);
      setTimeout(() => {
        handleCloseModalPhone();
        setPersonPhone(data);
      }, 2500);
    } catch (err) {
      handleButtonClickProgressErrorPhone();
      const { data } = err.response;
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
    }

  }

  async function handleAddNewAddress(e) {
    e.preventDefault();
    const csrfToken = getCookie('csrftoken');

    let adresses = [{ ...address, idPerson: Number(idPerson) }];

    try {
      const { data } = await api.post(`/addresses/create`, { adresses }, {
        headers: {
          'X-CSRFToken': csrfToken
        }
      });
      handleButtonClickProgressAddress();
      setTimeout(() => {
        toast.success('Endereço cadastrado com sucesso!');
      }, 2000);
      setTimeout(() => {
        handleCloseModalAddress();
        setPersonAddress(data);
      }, 2500);
    } catch (err) {
      // const { data } = reject.response;
      console.log(err);
      handleButtonClickProgressErrorAddress();
      setTimeout(() => {
        toast.error(`Não foi possível adicionar o endereço.`);
      }, 2000);
    }
  }

  async function handleAddNewMail(e) {
    e.preventDefault();
    const csrfToken = getCookie('csrftoken');

    let mails = [
      {
        idPerson: Number(idPerson),
        situation: 1,
        userMail: mail
      }
    ];

    try {
      const { data } = await api.post(`/mails/create`, { mails }, {
        headers: {
          'X-CSRFToken': csrfToken
        }
      });
      handleButtonClickProgressMail();
      setTimeout(() => {
        toast.success('E-mail cadastrado com sucesso!');
      }, 2000);
      setTimeout(() => {
        handleCloseModalMail();
        setPersonMail(data);
      }, 2500);
    } catch (err) {
      handleButtonClickProgressErrorMail();
      const { data } = err.response;
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
    }
  }

  async function handleAddNewReference(e) {
    e.preventDefault();
    const csrfToken = getCookie('csrftoken');

    let personReferences = [{
      ...reference, idPerson: Number(idPerson)
    }];

    try {
      const { data } = await api.post('/persons_references/create', { personReferences }, {
        headers: {
          'X-CSRFToken': csrfToken
        }
      });
      handleButtonClickProgressReference();
      setTimeout(() => {
        toast.success('Registro de referência cadastrado com sucesso!');
      }, 2000);
      setTimeout(() => {
        handleCloseModalReference();
        setPersonReferences(data);
      }, 2500);
    } catch (err) {
      handleButtonClickProgressErrorReference();
      const { data } = err.response;
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
    }
  }

  async function handleAddNewBankingReference(e) {
    e.preventDefault();
    const csrfToken = getCookie('csrftoken');
    const bankData = [{ ...banking, idPerson: Number(idPerson) }];

    try {
      const { data } = await api.post('/banking_references/create', { bankingReferences: bankData }, {
        headers: {
          'X-CSRFToken': csrfToken
        }
      });
      handleButtonClickProgressBanking();
      setTimeout(() => {
        toast.success('Registro de banco cadastrado com sucesso!');
      }, 2000);
      setTimeout(() => {
        handleCloseModalBankingReference();
        setBankingReferences(data);
      }, 2500);
    } catch (err) {
      handleButtonClickProgressErrorBanking();
      const { data } = err.response;
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
    }
  }

  // ----------------- FUNCTIONS FOR THE BUTTONS ANIMATIONS -----------------
  function handleButtonClickProgressErrorAddress() {
    if (!errorAddress) {
      setSuccessAddress(false);
      setLoadingAddress(true);
      timer.current = window.setTimeout(() => {
        setErrorAddress(true);
        setLoadingAddress(false);
      }, 2000);
    }
  }

  function handleButtonClickProgressAddress() {
    if (!loadingAddress) {
      setSuccessAddress(false);
      setLoadingAddress(true);
      timer.current = window.setTimeout(() => {
        setSuccessAddress(true);
        setLoadingAddress(false);
      }, 2000);
    }
  };

  function handleButtonClickProgressErrorRemoveAddress() {
    if (!loadingRemoveAddress) {
      setSuccessRemoveAddress(false);
      setLoadingRemoveAddress(true);
      timer.current = window.setTimeout(() => {
        setErrorRemoveAddress(true);
        setLoadingRemoveAddress(false);
      }, 2000);
    }
  }

  function handleButtonClickProgressRemoveAddress() {
    if (!loadingRemoveAddress) {
      setSuccessRemoveAddress(false);
      setLoadingRemoveAddress(true);
      timer.current = window.setTimeout(() => {
        setSuccessRemoveAddress(true);
        setLoadingRemoveAddress(false);
      }, 2000);
    }
  };

  function handleButtonClickProgressErrorRemovePhone() {
    if (!loadingRemovePhone) {
      setSuccessRemovePhone(false);
      setLoadingRemovePhone(true);
      timer.current = window.setTimeout(() => {
        setErrorRemovePhone(true);
        setLoadingRemovePhone(false);
      }, 2000);
    }
  }

  function handleButtonClickProgressRemovePhone() {
    if (!loadingRemovePhone) {
      setSuccessRemovePhone(false);
      setLoadingRemovePhone(true);
      timer.current = window.setTimeout(() => {
        setSuccessRemovePhone(true);
        setLoadingRemovePhone(false);
      }, 2000);
    }
  };

  function handleButtonClickProgressErrorRemoveMail() {
    if (!loadingRemoveMail) {
      setSuccessRemoveMail(false);
      setLoadingRemoveMail(true);
      timer.current = window.setTimeout(() => {
        setErrorRemoveMail(true);
        setLoadingRemoveMail(false);
      }, 2000);
    }
  }

  function handleButtonClickProgressRemoveMail() {
    if (!loadingRemoveMail) {
      setSuccessRemoveMail(false);
      setLoadingRemoveMail(true);
      timer.current = window.setTimeout(() => {
        setSuccessRemoveMail(true);
        setLoadingRemoveMail(false);
      }, 2000);
    }
  };

  function handleButtonClickProgressErrorRemoveReference() {
    if (!loadingRemoveReference) {
      setSuccessRemoveReference(false);
      setLoadingRemoveReference(true);
      timer.current = window.setTimeout(() => {
        setErrorRemoveReference(true);
        setLoadingRemoveReference(false);
      }, 2000);
    }
  }

  function handleButtonClickProgressRemoveReference() {
    if (!loadingRemoveReference) {
      setSuccessRemoveReference(false);
      setLoadingRemoveReference(true);
      timer.current = window.setTimeout(() => {
        setSuccessRemoveReference(true);
        setLoadingRemoveReference(false);
      }, 2000);
    }
  };

  function handleButtonClickProgressErrorRemoveBankingReference() {
    if (!loadingRemoveBankingReference) {
      setSuccessRemoveBankingReference(false);
      setLoadingRemoveBankingReference(true);
      timer.current = window.setTimeout(() => {
        setErrorRemoveBankingReference(true);
        setLoadingRemoveBankingReference(false);
      }, 2000);
    }
  }

  function handleButtonClickProgressRemoveBankingReference() {
    if (!loadingRemoveBankingReference) {
      setSuccessRemoveBankingReference(false);
      setLoadingRemoveBankingReference(true);
      timer.current = window.setTimeout(() => {
        setSuccessRemoveBankingReference(true);
        setLoadingRemoveBankingReference(false);
      }, 2000);
    }
  };

  function handleButtonClickProgressErrorPhone() {
    if (!errorPhone) {
      setSuccessPhone(false);
      setLoadingPhone(true);
      timer.current = window.setTimeout(() => {
        setErrorPhone(true);
        setLoadingPhone(false);
      }, 2000);
    }
  }

  function handleButtonClickProgressPhone() {
    if (!loadingPhone) {
      setSuccessPhone(false);
      setLoadingPhone(true);
      timer.current = window.setTimeout(() => {
        setSuccessPhone(true);
        setLoadingPhone(false);
      }, 2000);
    }
  };

  function handleButtonClickProgressErrorMail() {
    if (!errorMail) {
      setSuccessMail(false);
      setLoadingMail(true);
      timer.current = window.setTimeout(() => {
        setErrorMail(true);
        setLoadingMail(false);
      }, 2000);
    }
  }

  function handleButtonClickProgressMail() {
    if (!loadingMail) {
      setSuccessMail(false);
      setLoadingMail(true);
      timer.current = window.setTimeout(() => {
        setSuccessMail(true);
        setLoadingMail(false);
      }, 2000);
    }
  };

  function handleButtonClickProgressErrorBanking() {
    if (!errorBankingReference) {
      setSuccessBankingReference(false);
      setLoadingBankingReference(true);
      timer.current = window.setTimeout(() => {
        setErrorBankingReference(true);
        setLoadingBankingReference(false);
      }, 2000);
    }
  }

  function handleButtonClickProgressBanking() {
    if (!loadingBankingReference) {
      setSuccessBankingReference(false);
      setLoadingBankingReference(true);
      timer.current = window.setTimeout(() => {
        setSuccessBankingReference(true);
        setLoadingBankingReference(false);
      }, 2000);
    }
  };

  function handleButtonClickProgressErrorReference() {
    if (!errorReference) {
      setSuccessReference(false);
      setLoadingReference(true);
      timer.current = window.setTimeout(() => {
        setErrorReference(true);
        setLoadingReference(false);
      }, 2000);
    }
  }

  function handleButtonClickProgressReference() {
    if (!loadingReference) {
      setSuccessReference(false);
      setLoadingReference(true);
      timer.current = window.setTimeout(() => {
        setSuccessReference(true);
        setLoadingReference(false);
      }, 2000);
    }
  };

  function handleButtonClickProgress() {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      timer.current = window.setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 2000);
    }
  }

  function handleButtonClickProgressError() {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      timer.current = window.setTimeout(() => {
        setError(true);
        setLoading(false);
      }, 2000);
    }
  }

  // ----------------- FUNCTIONS FOR THE BUTTONS ANIMATIONS -----------------

  // ----------------- REMOVE PERSON DATA -----------------
  async function handleRemoveAddress(id) {
    const csrfToken = getCookie('csrftoken');

    try {
      await api.put(`/addresses/delete/${id}`, { addressId }, {
        headers: {
          'X-CSRFToken': csrfToken
        }
      });
      handleButtonClickProgressRemoveAddress();
      setTimeout(() => {
        toast.success('Registro apagado com sucesso!');
      }, 2000);
      setTimeout(() => {
        handleCloseModalRemoveAddress();
        const arrayAddressUpdated = personAddress.filter((address) => address.id_enderecos !== id);
        setPersonAddress(arrayAddressUpdated);
      }, 2500);
    } catch (err) {
      handleButtonClickProgressErrorRemoveAddress();
      const { data } = err.response;
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
      setTimeout(() => {
        handleCloseModalRemoveAddress();
      }, 2500);
    }
  }

  async function handleRemovePhone(id) {
    const csrfToken = getCookie('csrftoken');

    try {
      await api.put(`/phones/delete/${id}`, { phoneId }, {
        headers: {
          'X-CSRFToken': csrfToken
        }
      });
      handleButtonClickProgressRemovePhone();
      setTimeout(() => {
        toast.success('Registro apagado com sucesso!');
      }, 2000);
      setTimeout(() => {
        handleCloseModaRemovePhone();
        const arrayPhoneUpdated = personPhone.filter((phone) => phone.id_telefone !== id);
        setPersonPhone(arrayPhoneUpdated);
      }, 2400);
    } catch (err) {
      handleButtonClickProgressErrorRemovePhone();
      const { data } = err.response;
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
      setTimeout(() => {
        handleCloseModaRemovePhone();
      }, 2400);
    }
  }

  async function handleRemoveMail(id) {
    const csrfToken = getCookie('csrftoken');

    try {
      await api.put(`/mails/delete/${id}`, { personMailId }, {
        headers: {
          'X-CSRFToken': csrfToken
        }
      });
      handleButtonClickProgressRemoveMail();
      setTimeout(() => {
        toast.success('Registro apagado com sucesso!');
      }, 2000);
      setTimeout(() => {
        const arrayMailUpdated = personMail.filter((mail) => mail.id_mails !== id);
        setPersonMail(arrayMailUpdated);
        handleCloseModalRemoveMail();
      }, 2400)
    } catch (err) {
      handleButtonClickProgressErrorRemoveMail();
      const { data } = err.response;
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
      setTimeout(() => {
        handleCloseModalRemoveMail();
      }, 2400);
    }
  }

  async function handleRemoveReference(id) {
    const csrfToken = getCookie('csrftoken');

    try {
      await api.put(`/persons_references/delete/${id}`, { personReferenceId }, {
        headers: {
          'X-CSRFToken': csrfToken
        }
      });

      handleButtonClickProgressRemoveReference();
      setTimeout(() => {
        toast.success('Registro apagado com sucesso!');
      }, 2000);
      setTimeout(() => {
        handleCloseModalRemoveReference();
        const arrayReferenceUpdated = personReferences.filter((reference) => reference.id_referencia !== id);
        setPersonReferences(arrayReferenceUpdated);
      }, 2500);
    } catch (err) {
      handleButtonClickProgressErrorRemoveReference();
      const { data } = err.response;
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
      setTimeout(() => {
        handleCloseModalRemoveReference();
      }, 2400);
    }
  }

  async function handleRemoveBankingReference(id) {
    const csrfToken = getCookie('csrftoken');

    try {
      await api.put(`/banking_references/delete/${id}`, { bankingReferenceId }, {
        headers: {
          'X-CSRFToken': csrfToken
        }
      });
      handleButtonClickProgressRemoveBankingReference();
      setTimeout(() => {
        toast.success('Registro apagado com sucesso!');
      }, 2000);
      setTimeout(() => {
        handleCloseModalRemoveBankingReference();
        const arrayBankingReference = bankingReferences.filter((reference) => reference.id_banco !== id);
        setBankingReferences(arrayBankingReference);
      }, 2400);
    } catch (err) {
      handleButtonClickProgressErrorRemoveBankingReference();
      const { data } = err.response;
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
      setTimeout(() => {
        handleCloseModalRemoveBankingReference();
      }, 2400);
    }
  }

  // SUBMIT EDIT FORM
  async function handleSubmitFormEdit(e) {
    e.preventDefault();
    const csrftoken = getCookie('csrftoken');
    const data = {
      ...person,
      ...legalPerson,
      adresses: personAddress,
      phones: personPhone,
      mails: personMail,
      personReferences,
      bankingReferences
    }

    try {
      await api.put(`/persons/legal/edit/${idPerson}`, data, {
        headers: {
          'X-CSRFToken': csrftoken
        }
      });
      handleButtonClickProgress();
      setTimeout(() => {
        toast.success('Registro atualizado com sucesso.');
      }, 2000);
      setTimeout(() => {
        history.push('/legal/persons');
      }, 3000);
    } catch (err) {
      const { data } = err.response;
      handleButtonClickProgressError();
      setTimeout(() => {
        toast.error(`${data.detail}`);
      }, 2000);
    }
  }

  function searchZipCode(zipCode, e, position) {
    cep(zipCode).then((response) => {
      const { city, neighborhood, state, street } = response;
      const updatedAdress = Array.from(personAddress);

      updatedAdress[position].city = city;
      updatedAdress[position].neighborhood = neighborhood;
      updatedAdress[position].state = state;
      updatedAdress[position].street = street;

      setPersonAddress(updatedAdress);
      setIsZipCodeValid(true);
    }).catch((response) => {
      const { message } = response;
      setErrorMessageZipCode(message);
      setIsZipCodeValid(false);
    });
  }

  function searchZipCodeModal(zipCode) {
    cep(zipCode).then((response) => {
      const { city, neighborhood, state, street } = response;
      setAddress({
        origin: 1,
        street,
        numberHouse: "",
        complement: "",
        neighborhood,
        zipCode,
        city,
        state
      });

      setIsZipCodeValid(true);
    }).catch((response) => {
      const { message } = response;
      setErrorMessageZipCode(message);
      setIsZipCodeValid(false);
    });
  }

  return (
    <div className={classes.root}>
      <ToastContainer />
      <CssBaseline />
      <Menus title="Detalhes da pessoa" />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container className={classes.container} maxWidth="lg">
          <Card>
            <CardContent>
              <Box
                maxWidth={600}
                display="flex"
                justifyContent="flex-start"
              >
                <Link to="/legal/persons/" className="link">
                  <IconButton>
                    <ArrowBack />
                  </IconButton>
                </Link>
              </Box>
            </CardContent>
          </Card>

          <div className={classes.tabArea}>
            <AppBar position="static" className={classes.appBar}>
              <Tabs
                value={valueTab}
                onChange={handleChangeTab}
                aria-label="simple tabs example"
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label="Dados pessoais" {...a11yProps(0)} />
                <Tab label="Endereço" {...a11yProps(1)} />
                <Tab label="Contatos" {...a11yProps(2)} />
                <Tab label="Referências" {...a11yProps(3)} />
                <Tab label="Dados bancários" {...a11yProps(4)} />
                <Tab label="Financeiro" {...a11yProps(5)} />
                <Tab label="Opções" {...a11yProps(6)} />
              </Tabs>
            </AppBar>
            <form onSubmit={(e) => handleSubmitFormEdit(e)} >
              {/* DADOS PESSOAIS */}
              <TabPanel value={valueTab} index={0}>
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    item
                    xs={6}
                    sm={6}
                    xl={6}
                  >
                    <TextField
                      fullWidth
                      required
                      label="Razão social"
                      name="nomeorrazaosocial"
                      variant="outlined"
                      value={person.nomeorrazaosocial}
                      onChange={(e) => handleChangeInputsPerson(e)}

                    />
                  </Grid>

                  <Grid
                    item
                    xs={6}
                    sm={6}
                    xl={6}
                  >
                    <TextField
                      fullWidth
                      required
                      label="Nome fantasia"
                      name="fantasia"
                      variant="outlined"
                      value={legalPerson.fantasia}
                      onChange={(e) => handleChangeInputsLegalPerson(e)}

                    />
                  </Grid>

                  <Grid
                    item
                    xs={4}
                    sm={4}
                    xl={4}
                  >
                    <InputMask value={person.cpfcnpj} onChange={(e) => handleChangeInputsPerson(e)}>
                      <TextField
                        fullWidth
                        required
                        label="CNPJ"
                        name="cpfcnpj"
                        variant="outlined"
                      />
                    </InputMask>
                  </Grid>

                  <Grid
                    item
                    xs={4}
                    sm={4}
                    xl={4}
                  >
                    <TextField
                      fullWidth
                      required
                      label="Inscrição Estadual"
                      name="inscricao_estadual"
                      variant="outlined"
                      value={legalPerson.inscricao_estadual === null ? 'Não informado' : legalPerson.inscricao_estadual}
                      onChange={(e) => handleChangeInputsLegalPerson(e)}

                    />
                  </Grid>

                  <Grid
                    item
                    xs={4}
                    sm={4}
                    xl={4}
                  >
                    <TextField
                      fullWidth
                      required
                      label="Inscrição Municipal"
                      name="inscricao_municipal"
                      variant="outlined"
                      value={legalPerson.inscricao_municipal === null ? 'Não informado' : legalPerson.inscricao_municipal}
                      onChange={(e) => handleChangeInputsLegalPerson(e)}

                    />
                  </Grid>

                  <Grid
                    item
                    xs={3}
                    sm={3}
                    xl={3}
                  >
                    <TextField
                      fullWidth
                      required
                      type="date"
                      label="Data de abertura"
                      name="data_abertura"
                      variant="outlined"
                      value={legalPerson.data_abertura}
                      onChange={(e) => handleChangeInputsLegalPerson(e)}

                    />
                  </Grid>

                  <Grid
                    item
                    xs={5}
                    sm={5}
                    xl={5}
                  >
                    <TextField
                      fullWidth
                      required
                      label="Ramo"
                      name="ramo"
                      variant="outlined"
                      value={legalPerson.ramo}
                      onChange={(e) => handleChangeInputsLegalPerson(e)}

                    />
                  </Grid>

                  <Grid
                    item
                    xs={4}
                    sm={4}
                    xl={4}
                  >
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel id="select-company-type">Tipo da empresa</InputLabel>
                      <Select
                        labelId="select-company-type"
                        value={legalPerson.tipo_empresa}
                        onChange={(e) => handleChangeInputsLegalPerson(e)}
                        label="Tipo da empresa"
                        name="tipo_empresa"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value="Sociedade Empresária Limitada">Sociedade Empresária Limitada</MenuItem>
                        <MenuItem value="Empresa Individual De Responsabilidade Limitada">Empresa Individual De Responsabilidade Limitada</MenuItem>
                        <MenuItem value="Empresa Individual">Empresa Individual</MenuItem>
                        <MenuItem value="Microempreendedor Individual">Microempreendedor Individual</MenuItem>
                        <MenuItem value="Sociedade Simples">Sociedade Simples</MenuItem>
                        <MenuItem value="Sociedade Anônima">Sociedade Anônima</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    xs={3}
                    sm={3}
                    xl={3}
                  >
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel id="select-taxation">Tributação</InputLabel>
                      <Select
                        labelId="select-taxation"
                        value={legalPerson.tribut}
                        onChange={(e) => handleChangeInputsLegalPerson(e)}
                        label="Tributação"
                        name="tribut"
                      >
                        <MenuItem value={1}>
                          <em>Não especificado</em>
                        </MenuItem>
                        <MenuItem value={2}>Simples Nacional</MenuItem>
                        <MenuItem value={3}>Lucro Real</MenuItem>
                        <MenuItem value={4}>Lucro Presumido</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    xs={4}
                    sm={4}
                    xl={4}
                  >
                    <TextField
                      fullWidth
                      required
                      label="Contato na empresa"
                      name="contato"
                      variant="outlined"
                      value={legalPerson.contato}
                      onChange={(e) => handleChangeInputsLegalPerson(e)}

                    />
                  </Grid>
                </Grid>
              </TabPanel>
              {/* ENDEREÇOS */}
              <TabPanel value={valueTab} index={1}>
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    item
                    xs={3}
                    sm={3}
                    xl={3}
                  >
                    <Tooltip title="Adicionar novo endereço">
                      <Button
                        color="primary"
                        variant="contained"
                        size="small"
                        onClick={handleClickOpenModalAddress}
                      >
                        Adicionar
                      </Button>
                    </Tooltip>
                  </Grid>
                </Grid>
                <Divider style={{ marginBottom: '20px', marginTop: '20px' }} />
                {
                  personAddress.map((address, index) => (
                    <Typography component="div" key={index}>
                      <Grid
                        container
                        spacing={3}
                      >
                        <Grid
                          item
                          xs={3}
                          sm={3}
                          xl={3}
                        >
                          <InputMask mask="99.999-999" value={address.cep} onChange={(e) => handleChangeInputsAddress(e, index)}>
                            <TextField
                              fullWidth
                              required
                              error={!isZipCodeValid}
                              autoComplete="off"
                              label="CEP"
                              name="cep"
                              variant="outlined"
                            />
                          </InputMask>
                          {
                            (!isZipCodeValid) && (
                              <FormHelperText error >{errorMessageZipCode}</FormHelperText>
                            )
                          }
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        spacing={3}
                      >
                        <Grid
                          item
                          xs={6}
                          sm={6}
                          xl={6}
                        >
                          <TextField
                            fullWidth
                            onFocus={(e) => searchZipCode(address.cep, e, index)}
                            required
                            label="Rua"
                            name="rua"
                            variant="outlined"
                            value={address.rua}
                            onChange={(e) => handleChangeInputsAddress(e, index)}
                          />
                        </Grid>

                        <Grid
                          item
                          xs={4}
                          sm={4}
                          xl={4}
                        >
                          <TextField
                            fullWidth
                            required
                            label="Bairro"
                            name="bairro"
                            variant="outlined"
                            value={address.bairro}
                            onChange={(e) => handleChangeInputsAddress(e, index)}
                          />
                        </Grid>

                        <Grid
                          item
                          xs={2}
                          sm={2}
                          xl={2}
                        >
                          <TextField
                            fullWidth
                            required
                            label="Número"
                            name="numero"
                            variant="outlined"
                            value={address.numero}
                            onChange={(e) => handleChangeInputsAddress(e, index)}
                          />
                        </Grid>

                        <Grid
                          item
                          xs={6}
                          sm={6}
                          xl={6}
                        >
                          <TextField
                            fullWidth
                            required
                            label="Complemento"
                            name="complemento"
                            variant="outlined"
                            value={address.complemento === null ? 'Não informado' : address.complemento}
                            onChange={(e) => handleChangeInputsAddress(e, index)}
                          />
                        </Grid>

                        <Grid
                          item
                          xs={3}
                          sm={3}
                          xl={3}
                        >
                          <TextField
                            fullWidth
                            required
                            label="Cidade"
                            name="cidade"
                            variant="outlined"
                            value={address.cidade}
                            onChange={(e) => handleChangeInputsAddress(e, index)}
                          />
                        </Grid>

                        <Grid
                          item
                          xs={3}
                          sm={3}
                          xl={3}
                        >
                          <TextField
                            fullWidth
                            required
                            label="Estado"
                            name="estado_endereco"
                            variant="outlined"
                            value={address.estado_endereco}
                            onChange={(e) => handleChangeInputsAddress(e, index)}
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        spacing={3}
                      >
                        <Grid
                          item
                          xs={3}
                          sm={3}
                          xl={3}
                        >
                          <Tooltip title="Remover este endereço">
                            <Button
                              style={{ background: red[300], color: '#FFF' }}
                              variant="contained"
                              size="small"
                              onClick={() => handleClickOpenModalRemoveAddress(address.id_enderecos)}
                            >
                              Remover
                            </Button>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </Typography>
                  ))
                }

              </TabPanel>
              {/* CONTATOS */}
              <TabPanel value={valueTab} index={2}>
                <Typography component="div" className={classes.containerInput}>
                  <Grid
                    container
                    spacing={3}
                  >
                    <Grid
                      item
                      xs={3}
                      sm={3}
                      xl={3}
                    >
                      <Tooltip title="Adicionar novo telefone">
                        <Button
                          color="primary"
                          variant="contained"
                          size="small"
                          onClick={handleClickOpenModalPhone}
                        >
                          Adicionar Telefone
                        </Button>
                      </Tooltip>
                    </Grid>
                  </Grid>
                  <Divider style={{ marginBottom: '20px', marginTop: '20px' }} />
                  {
                    personPhone.length === 0 && (
                      <Typography component="h3" align="center" color="textSecondary">
                        Este registro não contém informações sobre telefones
                      </Typography>
                    )
                  }
                  <Typography component="div">
                    <Grid
                      container
                      spacing={3}
                    >
                      <Grid
                        item
                        xs={4}
                        sm={4}
                        xl={4}
                      >
                        {
                          personPhone.map((phone, index) => (
                            <FormControl className={classes.inputList} variant="outlined" fullWidth key={index}>
                              <InputLabel>Telefone</InputLabel>
                              <OutlinedInput
                                onChange={(e) => handleChangeInputsPhone(e, index)}
                                fullWidth
                                required
                                label="Telefone"
                                value={phone.tel}
                                name="phoneNumber"
                                endAdornment={
                                  <InputAdornment position="end">
                                    <Tooltip title="Deletar">
                                      <IconButton
                                        aria-label="Deletar"
                                        onClick={() => handleClickOpenModalRemovePhone(phone.id_telefone)}
                                        edge="end"
                                      >
                                        <Delete size={8} style={{ color: red[300] }} />
                                      </IconButton>
                                    </Tooltip>
                                  </InputAdornment>
                                }
                                labelWidth={70}
                              />
                            </FormControl>
                          ))
                        }


                      </Grid>
                    </Grid>
                  </Typography>
                </Typography>
                <Typography component="div" style={{ marginTop: '20px' }} className={classes.containerInput}>
                  <Grid
                    container
                    spacing={3}
                  >
                    <Grid
                      item
                      xs={3}
                      sm={3}
                      xl={3}
                    >
                      <Tooltip title="Adicionar novo email">
                        <Button
                          color="primary"
                          variant="contained"
                          size="small"
                          onClick={handleClickOpenModalMail}
                        >
                          Adicionar E-mail
                        </Button>
                      </Tooltip>
                    </Grid>
                  </Grid>
                  <Divider style={{ marginBottom: '20px', marginTop: '20px' }} />
                  {
                    personMail.length === 0 && (
                      <Typography component="h3" align="center" color="textSecondary">
                        Este registro não contém informações sobre email
                      </Typography>
                    )
                  }
                  <Typography component="div">
                    <Grid
                      container
                      spacing={3}
                    >
                      <Grid
                        item
                        xs={4}
                        sm={4}
                        xl={4}
                      >
                        {
                          personMail.map((mail, index) => (
                            <FormControl className={classes.inputList} variant="outlined" fullWidth key={index}>
                              <InputLabel>E-mail</InputLabel>
                              <OutlinedInput
                                onChange={(e) => handleChangeInputsMails(e, index)}
                                fullWidth
                                required
                                value={mail.email}
                                label="E-mail"
                                name="userMail"
                                endAdornment={
                                  <InputAdornment position="end">
                                    <Tooltip title="Deletar">
                                      <IconButton
                                        aria-label="Deletar"
                                        onClick={() => handleClickOpenModalRemoveMail(mail.id_mails)}
                                        edge="end"
                                      >
                                        <Delete size={8} style={{ color: red[300] }} />
                                      </IconButton>
                                    </Tooltip>
                                  </InputAdornment>
                                }
                                labelWidth={70}
                              />
                            </FormControl>
                          ))
                        }
                      </Grid>
                    </Grid>
                  </Typography>
                </Typography>
              </TabPanel>
              {/* REFERÊNCIAS */}
              <TabPanel value={valueTab} index={3}>
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    item
                    xs={3}
                    sm={3}
                    xl={3}
                  >
                    <Tooltip title="Adicionar nova referência">
                      <Button
                        color="primary"
                        variant="contained"
                        size="small"
                        onClick={handleClickOpenModalReference}
                      >
                        Adicionar
                      </Button>
                    </Tooltip>
                  </Grid>
                </Grid>
                <Divider style={{ marginBottom: '20px', marginTop: '20px' }} />
                {
                  personReferences.length === 0 && (
                    <Typography component="h3" align="center" color="textSecondary">
                      Este registro não contém informações sobre referências
                    </Typography>
                  )
                }
                {
                  personReferences.map((reference, index) => (
                    <Typography
                      component="div"
                      key={index}
                    >
                      <Grid
                        container
                        spacing={3}
                      >
                        <Grid
                          item
                          xs={6}
                          sm={6}
                          xl={6}
                        >
                          <TextField
                            fullWidth

                            required
                            label="Nome"
                            name="nome"
                            variant="outlined"
                            value={reference.nome}
                            onChange={(e) => handleChangeInputsReferences(e)}
                          />
                        </Grid>

                        <Grid
                          item
                          xs={3}
                          sm={3}
                          xl={3}
                        >
                          <TextField
                            fullWidth

                            required
                            label="Tipo"
                            name="tipo"
                            variant="outlined"
                            value={reference.tipo}
                            onChange={(e) => handleChangeInputsReferences(e)}
                          />
                        </Grid>

                        <Grid
                          item
                          xs={3}
                          sm={3}
                          xl={3}
                        >
                          <TextField
                            fullWidth

                            required
                            label="Telefone"
                            name="tel"
                            variant="outlined"
                            value={reference.tel}
                            onChange={(e) => handleChangeInputsReferences(e)}
                          />
                        </Grid>

                        <Grid
                          item
                          xs={8}
                          sm={8}
                          xl={8}
                        >
                          <TextField
                            fullWidth

                            required
                            label="Endereço"
                            name="endereco"
                            variant="outlined"
                            value={reference.endereco}
                            onChange={(e) => handleChangeInputsReferences(e)}
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        spacing={3}
                      >
                        <Grid
                          item
                          xs={3}
                          sm={3}
                          xl={3}
                        >
                          <Tooltip title="Remover este registro">
                            <Button
                              style={{ background: red[300], color: '#FFF' }}
                              variant="contained"
                              size="small"
                              onClick={() => handleClickOpenModalRemoveReference(reference.id_referencia)}
                            >
                              Remover
                            </Button>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </Typography>
                  ))
                }

              </TabPanel>
              {/* DADOS BANCÁRIOS */}
              <TabPanel value={valueTab} index={4}>
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    item
                    xs={3}
                    sm={3}
                    xl={3}
                  >
                    <Tooltip title="Adicionar nova conta">
                      <Button
                        color="primary"
                        variant="contained"
                        size="small"
                        onClick={handleClickOpenModalBankingReference}
                      >
                        Adicionar
                      </Button>
                    </Tooltip>
                  </Grid>
                </Grid>
                <Divider style={{ marginBottom: '20px', marginTop: '20px' }} />
                {
                  bankingReferences.length === 0 && (
                    <Typography component="h3" align="center" color="textSecondary">
                      Este registro não contém informações bancárias
                    </Typography>
                  )
                }
                {
                  bankingReferences.map((banking, index) => (
                    <Typography component="div" key={index}>
                      <Grid
                        container
                        spacing={3}
                      >
                        <Grid
                          item
                          xs={4}
                          sm={4}
                          xl={4}
                        >
                          <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel id="select-banks-registered">Banco</InputLabel>
                            <Select
                              labelId="select-banks-registered"
                              value={banking.id_bancos_fk}
                              onChange={(e) => handleChangeInputsBankingReferences(e)}
                              label="Banco"
                              name="id_bancos_fk"
                              required
                            >
                              {
                                registeredBanks.map(bank => (
                                  <MenuItem value={bank.id_bancos} key={bank.id_bancos}>{bank.banco}</MenuItem>
                                ))
                              }
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid
                          item
                          xs={4}
                          sm={4}
                          xl={4}
                        >
                          <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel id="select-type-account">Tipo</InputLabel>
                            <Select
                              labelId="select-type-account"
                              id="type-account"
                              value={banking.tipo}
                              onChange={(e) => handleChangeInputsBankingReferences(e, index)}
                              label="Tipo"
                              name="tipo"
                              required
                            >
                              <MenuItem value="">
                                <em>None</em>
                              </MenuItem>
                              <MenuItem value="Conta corrente">Conta corrente</MenuItem>
                              <MenuItem value="Conta poupança">Conta poupança</MenuItem>
                              <MenuItem value="Conta salário">Conta salário</MenuItem>
                              <MenuItem value="Conta digital">Conta digital</MenuItem>
                              <MenuItem value="Conta universitária">Conta universitária</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>

                      <Grid
                        container
                        spacing={3}
                      >
                        <Grid
                          item
                          xs={3}
                          sm={3}
                          xl={3}
                        >
                          <TextField
                            fullWidth

                            required
                            label="Conta"
                            name="conta"
                            variant="outlined"
                            value={banking.conta}
                            onChange={(e) => handleChangeInputsBankingReferences(e)}
                          />
                        </Grid>

                        <Grid
                          item
                          xs={2}
                          sm={2}
                          xl={2}
                        >
                          <TextField
                            fullWidth

                            required
                            label="Agência"
                            name="agencia"
                            variant="outlined"
                            value={banking.agencia}
                            onChange={(e) => handleChangeInputsBankingReferences(e)}
                          />
                        </Grid>

                        <Grid
                          item
                          xs={4}
                          sm={4}
                          xl={4}
                        >
                          <TextField
                            fullWidth
                            type="date"
                            required
                            label="Abertura"
                            name="abertura"
                            variant="outlined"
                            value={moment(banking.abertura).format('YYYY-MM-DD')}
                            onChange={(e) => handleChangeInputsBankingReferences(e)}
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        spacing={3}
                      >
                        <Grid
                          item
                          xs={3}
                          sm={3}
                          xl={3}
                        >
                          <Tooltip title="Remover este registro">
                            <Button
                              style={{ background: red[300], color: '#FFF' }}
                              variant="contained"
                              size="small"
                              onClick={() => handleClickOpenModalRemoveBankingReference(banking.id_banco)}
                            >
                              Remover
                            </Button>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </Typography>
                  ))
                }
              </TabPanel>
              {/* FINANCEIRO */}
              <TabPanel value={valueTab} index={5}>
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    item
                    xs={3}
                    sm={3}
                    xl={3}
                  >
                    <TextField
                      fullWidth
                      required
                      label="Limite"
                      name="limite"
                      variant="outlined"
                      value={person.limite}
                      onChange={(e) => handleChangeInputsPerson(e)}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={3}
                    sm={3}
                    xl={3}
                  >
                    <TextField
                      fullWidth
                      required
                      label="Saldo"
                      name="saldo"
                      variant="outlined"
                      value={person.saldo}
                      onChange={(e) => handleChangeInputsPerson(e)}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={3}
                    sm={3}
                    xl={3}
                  >
                    <TextField
                      fullWidth
                      required
                      label="Capital"
                      name="capsocial"
                      variant="outlined"
                      value={legalPerson.capsocial}
                      onChange={(e) => handleChangeInputsLegalPerson(e)}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={3}
                    sm={3}
                    xl={3}
                  >
                    <TextField
                      fullWidth
                      required
                      label="Receitas"
                      name="faturamento"
                      variant="outlined"
                      value={legalPerson.faturamento}
                      onChange={(e) => handleChangeInputsLegalPerson(e)}
                    />
                  </Grid>
                </Grid>
              </TabPanel>
              {/* OPÇÕES */}
              <TabPanel value={valueTab} index={6}>
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    item
                    xs={3}
                    sm={3}
                    xl={3}
                  >
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel id="demo-simple-select-outlined-label">Fornecedor</InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={person.forn}
                        onChange={(e) => handleChangeInputsPerson(e)}
                        label="Fornecedor"
                        autoWidth={false}
                        labelWidth={3}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={1}>Sim</MenuItem>
                        <MenuItem value={0}>Não</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </TabPanel>

              <Grid
                item
                xs={12}
                sm={12}
                xl={12}
              >
                <Divider style={{ marginTop: '20px' }} />
                <Box
                  display="flex"
                  justifyContent="flex-start"
                  alignItems="flex-end"
                  padding="20px"
                >
                  <Button
                    color="primary"
                    variant="contained"
                    type="submit"
                    className={buttonClassname}
                    disabled={loading}
                  >
                    Salvar
                    {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                  </Button>
                </Box>
              </Grid>
            </form>
          </div>
        </Container>

        {/* REGISTER PHONE MODAL */}
        <Dialog
          open={openModalPhone}
          onClose={handleCloseModalPhone}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Adicionar número de telefone</DialogTitle>
          <form onSubmit={(e) => handleAddNewPhone(e)}>
            <DialogContent>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  item
                  xs={12}
                  sm={12}
                  xl={12}
                >
                  <TextField
                    fullWidth
                    required
                    label="Telefone"
                    name="tel"
                    variant="outlined"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <Divider style={{ marginTop: '20px' }} />
            <DialogActions>
              <Box
                display="flex"
                justifyContent="flex-start"
                alignItems="flex-end"
                padding="15px"
              >
                <Button onClick={handleCloseModalPhone} style={{ color: red[300], marginRight: '10px' }}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  autoFocus
                  className={buttonClassnamePhone}
                  disabled={loadingPhone}
                >
                  Salvar
                  {loadingPhone && <CircularProgress size={24} className={classes.buttonProgressPhone} />}
                </Button>
              </Box>
            </DialogActions>
          </form>
        </Dialog>

        {/* REGISTER MAIL MODAL */}
        <Dialog
          open={openModalMail}
          onClose={handleCloseModalMail}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="sm"
        >
          <DialogTitle id="alert-dialog-title">Adicionar um novo endereço de e-mail</DialogTitle>
          <form onSubmit={(e) => handleAddNewMail(e)}>
            <DialogContent>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  item
                  xs={12}
                  sm={12}
                  xl={12}
                >
                  <TextField
                    fullWidth
                    required
                    label="E-mail"
                    name="mail"
                    variant="outlined"
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <Divider style={{ marginTop: '20px' }} />
            <DialogActions>
              <Box
                display="flex"
                justifyContent="flex-start"
                alignItems="flex-end"
                padding="15px"
              >
                <Button onClick={handleCloseModalMail} style={{ color: red[300], marginRight: '10px' }}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  autoFocus
                  className={buttonClassnameMail}
                  disabled={loadingMail}
                >
                  Salvar
                  {loadingMail && <CircularProgress size={24} className={classes.buttonProgressMail} />}
                </Button>
              </Box>
            </DialogActions>
          </form>
        </Dialog>

        {/* REGISTER ADDRESS MODAL */}
        <Dialog
          open={openModalAddress}
          onClose={handleCloseModalAddress}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
        >
          <form onSubmit={(e) => handleAddNewAddress(e)} autoComplete="false">
            <DialogTitle id="alert-dialog-title">Adicionar um novo endereço</DialogTitle>
            <DialogContent>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  item
                  xs={3}
                  sm={3}
                  xl={3}
                >
                  <InputMask mask="99.999-999" value={address.zipCode} onChange={(e) => handleChangeAddress(e)}>
                    <TextField
                      fullWidth
                      required
                      error={!isZipCodeValid}
                      autoComplete="off"
                      label="CEP"
                      name="zipCode"
                      variant="outlined"
                    />
                  </InputMask>
                  {
                    (!isZipCodeValid) && (
                      <FormHelperText error >{errorMessageZipCode}</FormHelperText>
                    )
                  }
                </Grid>
              </Grid>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  item
                  xs={6}
                  sm={6}
                  xl={6}
                >
                  <TextField
                    fullWidth
                    required
                    onFocus={(e) => searchZipCodeModal(address.zipCode)}
                    label="Rua"
                    name="street"
                    variant="outlined"
                    value={address.street}
                    onChange={(e) => handleChangeAddress(e)}
                  />
                </Grid>

                <Grid
                  item
                  xs={4}
                  sm={4}
                  xl={4}
                >
                  <TextField
                    fullWidth
                    required
                    label="Bairro"
                    name="neighborhood"
                    variant="outlined"
                    value={address.neighborhood}
                    onChange={(e) => handleChangeAddress(e)}
                  />
                </Grid>

                <Grid
                  item
                  xs={2}
                  sm={2}
                  xl={2}
                >
                  <TextField
                    fullWidth
                    required
                    label="Número"
                    name="numberHouse"
                    variant="outlined"
                    value={address.numberHouse}
                    onChange={(e) => handleChangeAddress(e)}
                  />
                </Grid>

                <Grid
                  item
                  xs={6}
                  sm={6}
                  xl={6}
                >
                  <TextField
                    fullWidth

                    required
                    label="Complemento"
                    name="complement"
                    variant="outlined"
                    value={address.complement}
                    onChange={(e) => handleChangeAddress(e)}
                  />
                </Grid>

                <Grid
                  item
                  xs={3}
                  sm={3}
                  xl={3}
                >
                  <TextField
                    fullWidth
                    required
                    label="Cidade"
                    name="city"
                    variant="outlined"
                    value={address.city}
                    onChange={(e) => handleChangeAddress(e)}
                  />
                </Grid>

                <Grid
                  item
                  xs={3}
                  sm={3}
                  xl={3}
                >
                  <TextField
                    fullWidth
                    required
                    label="Estado"
                    name="state"
                    variant="outlined"
                    value={address.state}
                    onChange={(e) => handleChangeAddress(e)}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <Divider style={{ marginTop: '20px' }} />
            <DialogActions>
              <Box
                display="flex"
                justifyContent="flex-start"
                alignItems="flex-end"
                padding="15px"
              >
                <Button onClick={handleCloseModalAddress} style={{ color: red[300], marginRight: '10px' }}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  autoFocus
                  className={buttonClassnameAddress}
                  disabled={loadingAddress}
                >
                  Salvar
                  {loadingAddress && <CircularProgress size={24} className={classes.buttonProgressAddress} />}
                </Button>
              </Box>
            </DialogActions>
          </form>
        </Dialog>

        {/* REGISTER BANKING REFERENCE MODAL */}
        <Dialog
          open={openModalBankingReference}
          onClose={handleCloseModalBankingReference}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
        >
          <form onSubmit={(e) => handleAddNewBankingReference(e)} autoComplete="false">
            <DialogTitle id="alert-dialog-title">Adicionar uma nova conta</DialogTitle>
            <DialogContent>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  item
                  xs={4}
                  sm={4}
                  xl={4}
                >
                  <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id="select-banks-registered-modal">Banco</InputLabel>
                    <Select
                      labelId="select-banks-registered-modal"
                      value={banking.idBanking}
                      onChange={(e) => handleChangeInputsBanking(e)}
                      label="Banco"
                      name="idBanking"
                      required
                    >
                      {
                        registeredBanks.map(bank => (
                          <MenuItem value={bank.id_bancos} key={bank.id_bancos}>{bank.banco}</MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xs={4}
                  sm={4}
                  xl={4}
                >
                  <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id="demo-simple-select-outlined-label">Tipo</InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={banking.type}
                      onChange={(e) => handleChangeInputsBanking(e)}
                      label="Tipo"
                      name="type"
                      required
                      autoWidth={false}
                      labelWidth={3}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="Conta corrente">Conta corrente</MenuItem>
                      <MenuItem value="Conta poupança">Conta poupança</MenuItem>
                      <MenuItem value="Conta salário">Conta salário</MenuItem>
                      <MenuItem value="Conta digital">Conta digital</MenuItem>
                      <MenuItem value="Conta universitária">Conta universitária</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid
                container
                spacing={3}
              >
                <Grid
                  item
                  xs={3}
                  sm={3}
                  xl={3}
                >
                  <TextField
                    fullWidth

                    required
                    label="Conta"
                    name="account"
                    variant="outlined"
                    value={banking.account}
                    onChange={(e) => handleChangeInputsBanking(e)}
                  />
                </Grid>

                <Grid
                  item
                  xs={2}
                  sm={2}
                  xl={2}
                >
                  <TextField
                    fullWidth

                    required
                    label="Agência"
                    name="agency"
                    variant="outlined"
                    value={banking.agency}
                    onChange={(e) => handleChangeInputsBanking(e)}
                  />
                </Grid>

                <Grid
                  item
                  xs={4}
                  sm={4}
                  xl={4}
                >
                  <TextField
                    fullWidth
                    type="date"
                    required
                    label="Abertura"
                    name="opening"
                    variant="outlined"
                    value={banking.opening}
                    onChange={(e) => handleChangeInputsBanking(e)}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <Divider style={{ marginTop: '20px' }} />
            <DialogActions>
              <Box
                display="flex"
                justifyContent="flex-start"
                alignItems="flex-end"
                padding="15px"
              >
                <Button onClick={handleCloseModalBankingReference} style={{ color: red[300], marginRight: '10px' }}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  autoFocus
                  className={buttonClassnameBankingReference}
                  disabled={loadingBankingReference}
                >
                  Salvar
                  {loadingBankingReference && <CircularProgress size={24} className={classes.buttonProgressBankingReference} />}
                </Button>
              </Box>
            </DialogActions>
          </form>
        </Dialog>

        {/* REGISTER REFERENCES MODAL */}
        <Dialog
          open={openModalReference}
          onClose={handleCloseModalReference}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
        >
          <DialogTitle id="alert-dialog-title">Adicionar um registro para referência</DialogTitle>
          <form onSubmit={(e) => handleAddNewReference(e)}>
            <DialogContent>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  item
                  xs={6}
                  sm={6}
                  xl={6}
                >
                  <TextField
                    fullWidth

                    required
                    label="Nome"
                    name="referenceName"
                    variant="outlined"
                    value={reference.referenceName}
                    onChange={(e) => handleChangeReference(e)}
                  />
                </Grid>

                <Grid
                  item
                  xs={3}
                  sm={3}
                  xl={3}
                >
                  <TextField
                    fullWidth

                    required
                    label="Tipo"
                    name="referenceType"
                    variant="outlined"
                    value={reference.referenceType}
                    onChange={(e) => handleChangeReference(e)}
                  />
                </Grid>

                <Grid
                  item
                  xs={3}
                  sm={3}
                  xl={3}
                >
                  <TextField
                    fullWidth
                    required
                    label="Telefone"
                    name="referencePhone"
                    variant="outlined"
                    value={reference.referencePhone}
                    onChange={(e) => handleChangeReference(e)}
                  />
                </Grid>

                <Grid
                  item
                  xs={8}
                  sm={8}
                  xl={8}
                >
                  <TextField
                    fullWidth

                    required
                    label="Endereço"
                    name="referenceAdress"
                    variant="outlined"
                    value={reference.referenceAdress}
                    onChange={(e) => handleChangeReference(e)}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <Divider style={{ marginTop: '20px' }} />
            <DialogActions>
              <Box
                display="flex"
                justifyContent="flex-start"
                alignItems="flex-end"
                padding="15px"
              >
                <Button onClick={handleCloseModalReference} style={{ color: red[300], marginRight: '10px' }}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  autoFocus
                  className={buttonClassnameReference}
                  disabled={loadingReference}
                >
                  Salvar
                  {loadingReference && <CircularProgress size={24} className={classes.buttonProgressReference} />}
                </Button>
              </Box>
            </DialogActions>
          </form>
        </Dialog>

        {/* REMOVE REGISTER PHONE */}
        <Dialog
          open={openModalRemovePhone}
          onClose={handleCloseModaRemovePhone}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
        >
          <DialogTitle id="alert-dialog-title">Remover registro de telefone</DialogTitle>
          <DialogContent>

            <Typography>
              Deseja realmente excluir este registro de telefone?
            </Typography>
          </DialogContent>
          <Divider style={{ marginTop: '20px' }} />
          <DialogActions>
            <Box
              display="flex"
              justifyContent="flex-start"
              alignItems="flex-end"
              padding="15px"
            >
              <Button onClick={handleCloseModaRemovePhone} style={{ color: red[300], marginRight: '10px' }}>
                Cancelar
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                autoFocus
                className={buttonClassnameRemovePhone}
                disabled={loadingRemovePhone}
                onClick={() => handleRemovePhone(phoneId)}
              >
                Excluir
                {loadingRemovePhone && <CircularProgress size={24} className={classes.buttonProgressRemovePhone} />}
              </Button>
            </Box>
          </DialogActions>
        </Dialog>

        {/* REMOVE REGISTER ADDRESS */}
        <Dialog
          open={openModalRemoveAddress}
          onClose={handleCloseModalRemoveAddress}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
        >
          <DialogTitle id="alert-dialog-title">Remover registro de endereço</DialogTitle>
          <DialogContent>
            <Typography>
              Deseja realmente excluir este registro de endereço?
            </Typography>
          </DialogContent>
          <Divider style={{ marginTop: '20px' }} />
          <DialogActions>
            <Box
              display="flex"
              justifyContent="flex-start"
              alignItems="flex-end"
              padding="15px"
            >
              <Button onClick={handleCloseModalRemoveAddress} style={{ color: red[300], marginRight: '10px' }}>
                Cancelar
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                autoFocus
                className={buttonClassnameRemoveAddress}
                disabled={loadingRemoveAddress}
                onClick={() => handleRemoveAddress(addressId)}
              >
                Excluir
                {loadingRemoveAddress && <CircularProgress size={24} className={classes.buttonProgressRemoveAddress} />}
              </Button>
            </Box>
          </DialogActions>
        </Dialog>

        {/* REMOVE REGISTER MAIL */}
        <Dialog
          open={openModalRemoveMail}
          onClose={handleCloseModalRemoveMail}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
        >
          <DialogTitle id="alert-dialog-title">Remover registro de e-mail</DialogTitle>
          <DialogContent>
            <Typography>
              Deseja realmente excluir este registro de e-mail?
            </Typography>
          </DialogContent>
          <Divider style={{ marginTop: '20px' }} />
          <DialogActions>
            <Box
              display="flex"
              justifyContent="flex-start"
              alignItems="flex-end"
              padding="15px"
            >
              <Button onClick={handleCloseModalRemoveMail} style={{ color: red[300], marginRight: '10px' }}>
                Cancelar
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                autoFocus
                className={buttonClassnameRemoveMail}
                disabled={loadingRemoveMail}
                onClick={() => handleRemoveMail(personMailId)}
              >
                Excluir
                {loadingRemoveMail && <CircularProgress size={24} className={classes.buttonProgressRemoveMail} />}
              </Button>
            </Box>
          </DialogActions>
        </Dialog>

        {/* REMOVE REGISTER REFERENCE */}
        <Dialog
          open={openModalRemoveReference}
          onClose={handleCloseModalRemoveReference}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
        >
          <DialogTitle id="alert-dialog-title">Remover registro de referência pessoal</DialogTitle>
          <DialogContent>
            <Typography>
              Deseja realmente excluir este registro de referência pessoal?
            </Typography>
          </DialogContent>
          <Divider style={{ marginTop: '20px' }} />
          <DialogActions>
            <Box
              display="flex"
              justifyContent="flex-start"
              alignItems="flex-end"
              padding="15px"
            >
              <Button onClick={handleCloseModalRemoveReference} style={{ color: red[300], marginRight: '10px' }}>
                Cancelar
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                autoFocus
                className={buttonClassnameRemoveReference}
                disabled={loadingRemoveReference}
                onClick={() => handleRemoveReference(personReferenceId)}
              >
                Excluir
                {loadingRemoveReference && <CircularProgress size={24} className={classes.buttonProgressRemoveReference} />}
              </Button>
            </Box>
          </DialogActions>
        </Dialog>

        {/* REMOVE REGISTER BANKING */}
        <Dialog
          open={openModalRemoveBankingReference}
          onClose={handleCloseModalRemoveBankingReference}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
        >
          <DialogTitle id="alert-dialog-title">Remover registro de referência pessoal</DialogTitle>
          <DialogContent>
            <Typography>
              Deseja realmente excluir este registro de referência pessoal?
            </Typography>
          </DialogContent>
          <Divider style={{ marginTop: '20px' }} />
          <DialogActions>
            <Box
              display="flex"
              justifyContent="flex-start"
              alignItems="flex-end"
              padding="15px"
            >
              <Button onClick={handleCloseModalRemoveBankingReference} style={{ color: red[300], marginRight: '10px' }}>
                Cancelar
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                autoFocus
                className={buttonClassnameRemoveBankingReference}
                disabled={loadingRemoveBankingReference}
                onClick={() => handleRemoveBankingReference(bankingReferenceId)}
              >
                Excluir
                {loadingRemoveReference && <CircularProgress size={24} className={classes.buttonProgressRemoveBankingReference} />}
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
        <Box pt={4}>
          <Copyright />
        </Box>
      </main>
    </div>
  );
}
