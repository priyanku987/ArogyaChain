/* eslint-disable no-console */
/* eslint-disable no-unreachable */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
import { useAxios } from '../../utils/axios';
import { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  Grid,
  TextField,
  Select,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Divider,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const validationSchema = yup.object({
  fullName: yup.string().required(),
  aadhaarNumber: yup.string().required(),
  phoneNumber: yup.string().required(),
  email: yup.string().required(),
  dob: yup.date().required(),
});

export default function RegisterIdentityModal({ open, handleModalOpen }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const axios = useAxios();

  const [aadhaarNumber, setAadharNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState(dayjs());
  // roles
  const [doctor, setDoctor] = useState(false);
  const [patient, setPatient] = useState(false);
  const [recieptionist, setRecieptionist] = useState(false);

  async function registerIdentity() {
    try {
      let validation;
      try {
        validation = await validationSchema.validate({
          aadhaarNumber,
          fullName,
          phoneNumber,
          email,
          dob,
        });
      } catch (error) {
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
      console.log('valid', validation);

      // make the roles
      const roles = [];
      if (doctor) {
        roles.push('DOCTOR');
      }
      if (patient) {
        roles.push('PATIENT');
      }
      if (recieptionist) {
        roles.push('RECIEPTIONIST');
      }
      if (roles?.length === 0) {
        roles?.push('PATIENT');
      }

      // format dob
      const formattedDOB = dob.format('DD-MM-YYYY');
      // pLogin
      await axios.post(
        '/healthcare/auth/registerIdentity',
        {
          aadhaarNumber,
          fullName,
          phoneNumber,
          email,
          dob: formattedDOB,
          roles,
        },
        {
          withCredentials: true,
        },
      );
      return toast.info('Successfully registered Identity!', {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    } catch (error) {
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
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={(e, reason) => {
        if (reason !== 'backdropClick') {
          handleModalOpen(false);
        }
      }}
      aria-labelledby="responsive-dialog-title"
      disableEscapeKeyDown
    >
      <DialogTitle id="responsive-dialog-title">Register Identity</DialogTitle>
      <DialogContent>
        <TextField
          id="outlined-basic"
          label="AADHAAR Number"
          variant="outlined"
          size="small"
          style={{ width: '100%', marginTop: '14px' }}
          value={aadhaarNumber}
          onChange={e => setAadharNumber(e.target.value)}
        />

        <TextField
          id="outlined-basic"
          label="Full Name"
          variant="outlined"
          size="small"
          style={{ width: '100%', marginTop: '14px' }}
          value={fullName}
          onChange={e => setFullName(e.target.value)}
        />

        <TextField
          id="outlined-basic"
          label="Phone Number"
          variant="outlined"
          size="small"
          style={{ width: '100%', marginTop: '14px' }}
          value={phoneNumber}
          onChange={e => setPhoneNumber(e.target.value)}
        />

        <TextField
          id="outlined-basic"
          label="Email"
          variant="outlined"
          size="small"
          style={{ width: '100%', marginTop: '14px' }}
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <DatePicker
          size="small"
          style={{ width: '100%' }}
          label="Date of Birth (As per Birth Certificate)"
          value={dob}
          onChange={val => {
            console.log(val);
          }}
        />
        <Divider textAlign="left">Roles</Divider>

        <FormGroup>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Doctor"
              value={doctor}
              onChange={e => setDoctor(e.target.checked)}
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Patient"
              value={patient}
              onChange={e => setPatient(e.target.checked)}
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Recieptionist"
              value={recieptionist}
              onChange={e => setRecieptionist(e.target.checked)}
            />
          </div>
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleModalOpen(false);
          }}
        >
          Close
        </Button>
        <Button
          onClick={() => {
            registerIdentity();
          }}
        >
          Register
        </Button>
      </DialogActions>
    </Dialog>
  );
}
