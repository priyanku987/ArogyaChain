/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-vars */
import RegisterIdentityModal from '../../../Components/RegisterIdentityModal';
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { createUseStyles } from 'react-jss';

const useClasses = createUseStyles({
  registerIdentityTab: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#f6f2ff',
    },
  },
});

export default function Home() {
  const classes = useClasses();
  const [openRegisterIdentityModal, setOpenRegisterIdentityModal] =
    useState(false);
  return (
    <>
      <Typography variant="h5" gutterBottom style={{ marginBottom: '20px' }}>
        Welcome
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6} lg={4}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100px',
              border: '1px solid #865DFF',
              borderRadius: 7,
            }}
            className={classes?.registerIdentityTab}
            onClick={() => {
              setOpenRegisterIdentityModal(true);
            }}
          >
            <PersonAddIcon style={{ marginRight: '16px' }} />
            <Typography variant="h5" component="div">
              Register Patient
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100px',
              border: '1px solid #865DFF',
              borderRadius: 7,
            }}
            className={classes?.registerIdentityTab}
            onClick={() => {
              setOpenRegisterIdentityModal(true);
            }}
          >
            <PersonAddIcon style={{ marginRight: '16px' }} />
            <Typography variant="h5" component="div">
              Register Doctor
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100px',
              border: '1px solid #865DFF',
              borderRadius: 7,
            }}
            className={classes?.registerIdentityTab}
            onClick={() => {
              setOpenRegisterIdentityModal(true);
            }}
          >
            <PersonAddIcon style={{ marginRight: '16px' }} />
            <Typography variant="h5" component="div">
              Register Recieptionist
            </Typography>
          </div>
        </Grid>
      </Grid>
      <RegisterIdentityModal
        open={openRegisterIdentityModal}
        handleModalOpen={setOpenRegisterIdentityModal}
      />
    </>
  );
}
