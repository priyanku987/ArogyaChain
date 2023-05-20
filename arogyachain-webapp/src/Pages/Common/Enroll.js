/* eslint-disable no-console */
/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
import ArogyaChainLogo from '../../assets/Logo/ArogyaChainViolet.png';
import { useAxios } from '../../utils/axios';
import * as React from 'react';
import { withStyles } from '@mui/material/styles';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Tooltip,
  IconButton,
} from '@mui/material';
import { Help } from '@mui/icons-material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { createUseStyles } from 'react-jss';
import { toast } from 'react-toastify';
import * as yup from 'yup';

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

const validationSchema = yup.object({
  enrollmentId: yup.string().required(),
  enrollmentSecret: yup.string().required(),
  emailToSendCredentials: yup.string().required(),
});

export default function Enroll() {
  const classes = useClasses();
  const axios = useAxios();

  const [enrollmentId, setEnrollmentId] = React.useState('');
  const [enrollmentSecret, setEnrollmentSecret] = React.useState('');
  const [emailToSendCredentials, setEmailToSendCredentials] =
    React.useState('');
  const [enrolling, setEnrolling] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword(show => !show);

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  async function enroll() {
    setEnrolling(true);
    try {
      try {
        await validationSchema.validate({
          enrollmentId,
          enrollmentSecret,
          emailToSendCredentials,
        });
      } catch (error) {
        setEnrolling(false);
        return toast.error('Please provide all the required fields!', {
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

      console.log(enrollmentId, enrollmentSecret, emailToSendCredentials);

      // send enroll request
      await axios.post(
        '/user/auth/enroll',
        {
          enrollmentId,
          enrollmentSecret,
          emailToSendCredentials,
        },
        {
          withCredentials: true,
        },
      );
      setEnrolling(false);

      return toast.info(
        'Enrollment Successfull, please check your email to download the credentials!',
        {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        },
      );
    } catch (error) {
      setEnrolling(false);
      return toast.error('Something went wrong, please try again!', {
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
          <p className={classes?.loginTitle}>Enroll</p>
          <TextField
            id="outlined-basic"
            label="Aadhaar Number"
            variant="outlined"
            placeholder="Please enter your Aadhaar Number"
            // className={classes?.certificateUpload}
            style={{ width: '100%' }}
            InputLabelProps={{
              shrink: true,
            }}
            value={enrollmentId}
            onChange={e => setEnrollmentId(e.target.value)}
          />
        </div>
      </Grid>
      <Grid item xs={12}>
        <div className={classes?.certificateUpload}>
          <TextField
            // id="outlined-basic"
            label="Enrollment Secret"
            variant="outlined"
            placeholder="Please enter your enrollment secret"
            // className={classes?.certificateUpload}
            style={{ width: '100%' }}
            InputLabelProps={{
              shrink: true,
            }}
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            value={enrollmentSecret}
            onChange={e => setEnrollmentSecret(e.target.value)}
          />
        </div>
      </Grid>

      <Grid item xs={12}>
        <div className={classes?.certificateUpload}>
          <TextField
            id="outlined-basic"
            label="Email"
            variant="outlined"
            placeholder="Please enter your Email to recieve Credentials"
            // className={classes?.certificateUpload}
            style={{ width: '100%' }}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <Tooltip title="You will recieve ArgoyaChain Credentials on this Email Address!">
                    <Help />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
            value={emailToSendCredentials}
            onChange={e => setEmailToSendCredentials(e.target.value)}
          />
        </div>
        <div
          style={{
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'flex-start',
          }}
        >
          <a
            href="/login"
            style={{
              textDecoration: 'none',
              color: '#865DFF',
            }}
          >
            Login instead?
          </a>
        </div>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          className={classes?.loginButton}
          size="large"
          onClick={() => enroll()}
          disabled={enrolling}
        >
          {enrolling ? 'Processing...' : 'Enroll'}
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
