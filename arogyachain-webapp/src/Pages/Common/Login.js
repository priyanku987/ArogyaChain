/* eslint-disable no-unused-vars */
import ArogyaChainLogo from '../../assets/Logo/ArogyaChainViolet.png';
import {
  readFile,
  convertPEMFormatToNString,
  convertPEMFormatToRNString,
} from '../../utils/x509';
import { useAxios } from '../../utils/axios';
import * as React from 'react';
import { withStyles } from '@mui/material/styles';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { Help } from '@mui/icons-material';
import { createUseStyles } from 'react-jss';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';

const useClasses = createUseStyles({
  arogyachainLogo: {
    borderRadius: '7px',
    backgroundColor: '#EFEAFF',
    padding: '14px',
    height: '110px',
    '@media(max-width: 600px)': {
      height: '80px',
    },
  },
  certificateUpload: {
    width: '476px',
    '@media(max-width: 600px)': {
      width: '360px',
    },
  },
  loginTitle: {
    fontSize: '30px',
    marginBottom: '20px',
    marginTop: '0px',
    textAlign: 'start',
    color: '#414141',
    fontWeight: 600,
  },
  loginButton: {
    width: '476px',
    '@media(max-width: 600px)': {
      width: '360px',
    },
  },
});

export default function Login() {
  const classes = useClasses();
  const axios = useAxios();
  const history = useHistory();

  const [certificateFile, setCertificateFile] = React.useState('');
  const [privateKeyFile, setPrivateKeyFile] = React.useState('');
  const [loggingIn, setLoggingIn] = React.useState(false);

  async function login() {
    try {
      setLoggingIn(true);
      // read certificate
      if (!certificateFile || !privateKeyFile) {
        setLoggingIn(false);
        return toast.error('Please provide your Certificate and Private Key!', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      }
      const pemFormattedCertificate = await readFile(certificateFile);
      const pemFormattedPrivateKey = await readFile(privateKeyFile);

      // convert these to string format
      const certificate = convertPEMFormatToNString(pemFormattedCertificate);
      const privateKey = convertPEMFormatToRNString(pemFormattedPrivateKey);

      // pLogin
      await axios.post(
        '/common/login',
        {
          certificate,
          privateKey,
        },
        {
          withCredentials: true,
        },
      );

      // Cookies.set('ACLOGIN_MODE', 'healthcare');

      // if the test is successfull than fetch the identity details
      setLoggingIn(false);
      toast.info('Logged in successfully!', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        style: {
          backgroundColor: 'black',
        },
      });
      // redirect the user to homepage
      return window.location.reload();
    } catch (error) {
      setLoggingIn(false);
      return toast.error('Invalid Credentials!', {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    }
  }
  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={{ xs: 2, md: 3 }}
      style={{ marginTop: '100px' }}
    >
      <Grid item xs={12}>
        <img
          src={ArogyaChainLogo}
          alt="logo"
          className={classes?.arogyachainLogo}
        />
      </Grid>
      <Grid item xs={12}>
        <div className={classes?.certificateUpload}>
          <p className={classes?.loginTitle}>Login</p>
          <TextField
            id="outlined-basic"
            label="Enrollment Certificate"
            variant="outlined"
            type="file"
            placeholder="Please choose"
            // className={classes?.certificateUpload}
            style={{ width: '100%' }}
            InputLabelProps={{
              shrink: true,
            }}
            disabled={loggingIn}
            onChange={e => setCertificateFile(e?.target?.files[0])}
          />
        </div>
      </Grid>
      <Grid item xs={12}>
        <div className={classes?.certificateUpload}>
          <TextField
            id="outlined-basic"
            label="Private Key"
            variant="outlined"
            type="file"
            placeholder="Please choose"
            // className={classes?.certificateUpload}
            style={{ width: '100%' }}
            InputLabelProps={{
              shrink: true,
            }}
            disabled={loggingIn}
            onChange={e => setPrivateKeyFile(e?.target?.files[0])}
          />
        </div>
      </Grid>
      <Grid item xs={12}>
        <div className={classes?.certificateUpload}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Login as</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              // value={age}
              label="Login as"
              onChange={e => {
                Cookies.set('ACLOGIN_MODE', e.target.value);
              }}
            >
              <MenuItem value="healthcare">Healthcare</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div
          style={{
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'flex-start',
          }}
        >
          <a
            href="/enroll"
            style={{
              textDecoration: 'none',
              color: '#865DFF',
            }}
          >
            Enroll now
          </a>
        </div>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          className={classes?.loginButton}
          size="large"
          onClick={() => login()}
          disabled={loggingIn}
          startIcon={loggingIn ? <CircularProgress size={20} /> : null}
        >
          {' '}
          Login
        </Button>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Help style={{ color: '#6C6C6C' }} />
          <p style={{ padding: '10px', color: '#6C6C6C' }}>
            Where can i find my certificate and keys?
          </p>
        </div>
      </Grid>
    </Grid>
  );
}
